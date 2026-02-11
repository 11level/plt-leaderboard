from __future__ import annotations

from google.oauth2 import service_account
from googleapiclient.discovery import build
import re

import os
from dotenv import load_dotenv
from pathlib import Path

ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH)

# -------- CONFIG --------
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_CREDENTIALS_FILE")
DOCUMENT_ID = os.getenv("DOCUMENT_ID")
TARGET_NAMES = os.getenv("TARGET_NAMES")
# ------------------------

SCOPES = ["https://www.googleapis.com/auth/documents.readonly"]


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


def get_doc_text_all_tabs(document_id: str, debug: bool = False) -> str:
    """Fetch a Google Doc and return concatenated text across all tabs (plus fallback)."""
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build("docs", "v1", credentials=creds)

    # Key fix: includeTabsContent=True so doc["tabs"] actually contains tab bodies.
    doc = service.documents().get(
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


def count_cards(text: str, name: str) -> int:
    """
    Count occurrences of a pattern like:
      //ilovebeabadoobee
      //  ilovebeabadoobee
      //    ilovebeabadoobee
    Matches anywhere in a line (not just at start).
    """
    pattern = re.compile(
        rf"[ \t]*//[ \t]*{re.escape(name)}\b",
        re.IGNORECASE | re.MULTILINE
    )
    return len(pattern.findall(text))


if __name__ == "__main__":
    # Key fix: call the all-tabs function (and print which tabs are scanned)
    doc_text = get_doc_text_all_tabs(DOCUMENT_ID, debug=True)
    count = count_cards(doc_text, TARGET_NAME)
    print(f"Cards cut by {TARGET_NAME}: {count}")