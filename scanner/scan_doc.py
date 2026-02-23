from __future__ import annotations

import os
from pathlib import Path
import re

from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH)

# -------- CONFIG --------
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_CREDENTIALS_FILE")
DOCUMENT_ID = os.getenv("DOCUMENT_ID")
ROOT_FOLDER_ID = os.getenv("ROOT_FOLDER_ID")  # Google Drive folder to scan (optional)
# Person -> tags: "Emily:ezpz,ezpeasy|ilovebeabadoobee:ilovebeabadoobee" (each tag counts toward that person)
PEOPLE_TAGS = os.getenv("PEOPLE_TAGS", "")
TARGET_NAMES = os.getenv("TARGET_NAMES", "")  # fallback: comma-separated names (each name = 1 tag)
DEBUG_TABS = os.getenv("DEBUG_TABS", "0").lower() in ("1", "true", "yes")
# ------------------------


def parse_people_tags() -> dict[str, list[str]]:
    """
    Parse PEOPLE_TAGS into {person: [tag1, tag2, ...]}.
    Format: Emily:ezpz,ezpeasy|ilovebeabadoobee:ilovebeabadoobee
    Fallback: if PEOPLE_TAGS empty, use TARGET_NAMES (each name = person with that single tag).
    """
    if PEOPLE_TAGS.strip():
        out: dict[str, list[str]] = {}
        for pair in PEOPLE_TAGS.split("|"):
            pair = pair.strip()
            if not pair:
                continue
            if ":" not in pair:
                continue
            person, tags_str = pair.split(":", 1)
            person = person.strip()
            tags = [t.strip() for t in tags_str.split(",") if t.strip()]
            if person and tags:
                out[person] = tags
        return out
    # Fallback: TARGET_NAMES -> each name is both person and single tag
    names = [n.strip() for n in TARGET_NAMES.split(",") if n.strip()]
    return {n: [n] for n in names}

SCOPES = [
    "https://www.googleapis.com/auth/documents.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
]


def _extract_text_from_body_content(body_content: list[dict]) -> str:
    """Extract plain text from a Docs API body.content list."""
    out: list[str] = []
    for element in body_content:
        paragraph = element.get("paragraph")
        if not paragraph:
            continue
        for run in paragraph.get("elements", []):
            tr = run.get("textRun")
            if tr and "content" in tr:
                out.append(tr["content"])
    return "".join(out)


def _walk_tabs(tab: dict, collected_text: list[str], debug: bool = False) -> None:
    """Recursively walk a tab (and child tabs) collecting text."""
    props = tab.get("tabProperties", {})
    title = props.get("title", "<untitled>")
    tab_id = props.get("tabId", "<no-id>")

    doc_tab = tab.get("documentTab")
    if doc_tab and doc_tab.get("body", {}).get("content"):
        if debug:
            print(f"Scanning tab: {title} ({tab_id})")
        collected_text.append(_extract_text_from_body_content(doc_tab["body"]["content"]))
    else:
        if debug:
            print(f"Skipping non-document/empty tab: {title} ({tab_id})")

    for child in tab.get("childTabs", []):
        _walk_tabs(child, collected_text, debug=debug)


def get_doc_text_all_tabs(
    document_id: str, *, docs_service=None, debug: bool = False
) -> str:
    """Fetch a Google Doc and return concatenated text across all tabs (plus fallback)."""
    # Allow caller to pass in a pre-built Docs service so we can reuse
    # credentials when scanning many files. Fall back to creating one.
    if docs_service is None:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )
        docs_service = build("docs", "v1", credentials=creds)

    # includeTabsContent=True so doc["tabs"] actually contains tab bodies.
    doc = docs_service.documents().get(
        documentId=document_id,
        includeTabsContent=True
    ).execute()

    chunks: list[str] = []

    tabs = doc.get("tabs", [])
    if tabs:
        for tab in tabs:
            _walk_tabs(tab, chunks, debug=debug)
    else:
        # Fallback for non-tabbed / older docs
        body = doc.get("body", {})
        content = body.get("content")
        if content:
            if debug:
                print("Scanning single-tab document body")
            chunks.append(_extract_text_from_body_content(content))

    return "".join(chunks)


def count_tag(text: str, tag: str) -> int:
    """
    Count occurrences of either:
      // tag   or   / tag
    (with optional space around slashes). Does not double-count: // tag
    matches once (not as both // and /). Each match = 1 card.
    """
    # Match // tag OR / tag; (?<!/)/ ensures we don't match the second / in //
    pattern = re.compile(
        rf"[ \t]*(?://[ \t]*{re.escape(tag)}\b|(?<!/)/[ \t]*{re.escape(tag)}\b)",
        re.IGNORECASE | re.MULTILINE,
    )
    return len(pattern.findall(text))


def count_cards_for_person(text: str, tags: list[str]) -> int:
    """Sum counts of all tags for one person. Each tag match counts toward that person."""
    return sum(count_tag(text, t) for t in tags)


def _iter_docs_in_folder(
    folder_id: str, drive_service, debug: bool = False
) -> list[tuple[str, str]]:
    """
    Recursively list all Google Docs inside a Drive folder (and its subfolders).

    Returns a list of (file_id, file_name).
    """
    docs: list[tuple[str, str]] = []

    page_token: str | None = None
    query = f"'{folder_id}' in parents and trashed = false"

    while True:
        response = (
            drive_service.files()
            .list(
                q=query,
                spaces="drive",
                fields="nextPageToken, files(id, name, mimeType)",
                pageToken=page_token,
            )
            .execute()
        )

        for f in response.get("files", []):
            file_id = f["id"]
            name = f.get("name", "<unnamed>")
            mime_type = f.get("mimeType", "")

            if mime_type == "application/vnd.google-apps.folder":
                if debug:
                    print(f"Descending into folder: {name} ({file_id})")
                docs.extend(_iter_docs_in_folder(file_id, drive_service, debug=debug))
            elif mime_type == "application/vnd.google-apps.document":
                if debug:
                    print(f"Found doc: {name} ({file_id})")
                docs.append((file_id, name))
            else:
                if debug:
                    print(f"Skipping non-doc file: {name} ({mime_type})")

        page_token = response.get("nextPageToken")
        if not page_token:
            break

    return docs


def scan_folder_for_keywords(
    root_folder_id: str,
    people_tags: dict[str, list[str]],
    debug: bool = False,
) -> tuple[dict[str, int], list[tuple[str, str, dict[str, int]]]]:
    """
    Scan every tab of every Google Doc in a Drive folder (and subfolders)
    for tags. Each person has a list of tags; any tag match counts toward that person.

    people_tags: {person: [tag1, tag2, ...]}  e.g. {"Emily": ["ezpz", "ezpeasy"]}

    Returns:
      - totals: {person: total_matches_across_all_docs}
      - per_doc: list of (doc_id, doc_name, {person: matches_in_that_doc})
    """
    if not people_tags:
        raise ValueError("No PEOPLE_TAGS (or TARGET_NAMES) provided.")

    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    drive_service = build("drive", "v3", credentials=creds)
    docs_service = build("docs", "v1", credentials=creds)

    doc_list = _iter_docs_in_folder(root_folder_id, drive_service, debug=debug)

    totals: dict[str, int] = {p: 0 for p in people_tags}
    per_doc: list[tuple[str, str, dict[str, int]]] = []

    for doc_id, doc_name in doc_list:
        if debug:
            print(f"\n=== Scanning document: {doc_name} ({doc_id}) ===")

        text = get_doc_text_all_tabs(doc_id, docs_service=docs_service, debug=debug)
        doc_counts: dict[str, int] = {}

        for person, tags in people_tags.items():
            c = count_cards_for_person(text, tags)
            doc_counts[person] = c
            totals[person] += c

        per_doc.append((doc_id, doc_name, doc_counts))

    return totals, per_doc


if __name__ == "__main__":
    if not SERVICE_ACCOUNT_FILE:
        raise RuntimeError("GOOGLE_CREDENTIALS_FILE is not set in .env")

    people_tags = parse_people_tags()
    if not people_tags:
        raise RuntimeError(
            "Set PEOPLE_TAGS (e.g. Emily:ezpz,ezpeasy|adi:adi) or TARGET_NAMES in .env"
        )

    if ROOT_FOLDER_ID:
        print(f"Scanning Drive folder {ROOT_FOLDER_ID}")
        for person, tags in people_tags.items():
            print(f"  {person} <- {tags}")
        totals, per_doc = scan_folder_for_keywords(
            ROOT_FOLDER_ID, people_tags, debug=DEBUG_TABS
        )

        print("\n=== Totals (every tab, every document, every folder) ===")
        for person in people_tags:
            print(f"{person}: {totals.get(person, 0)}")

        print("\n=== Per-document breakdown ===")
        for doc_id, doc_name, counts in per_doc:
            line_parts = [f"{doc_name} ({doc_id})"]
            for person in people_tags:
                line_parts.append(f"{person}={counts.get(person, 0)}")
            print(" | ".join(line_parts))

    elif DOCUMENT_ID:
        print(f"Scanning single document {DOCUMENT_ID}")
        doc_text = get_doc_text_all_tabs(DOCUMENT_ID, debug=DEBUG_TABS)
        for person, tags in people_tags.items():
            count = count_cards_for_person(doc_text, tags)
            print(f"{person}: {count} (tags: {tags})")
    else:
        raise RuntimeError(
            "You must set either DOCUMENT_ID or ROOT_FOLDER_ID in the .env file."
        )