from __future__ import annotations

from dataclasses import dataclass
from hashlib import sha256
import re
import unicodedata

TAG_PATTERN = re.compile(r"^\s*//\s*([A-Za-z0-9._-]{1,32})\s*$")

@dataclass(frozen=True)
class ParsedCard:
    cutter_tag: str
    raw_text: str
    normalized_text: str
    start_position: int
    end_position: int
    exact_hash: str

def normalize_card(text: str) -> str:
    text = unicodedata.normalize("NFKC", text).lower()
    text = re.sub(r"https?://\S+", "", text)
    text = re.sub(r"[^\w\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()

def parse_cards(text: str, *, min_words: int = 5) -> list[ParsedCard]:
    lines = text.splitlines()
    tags = [(index, match.group(1).lower()) for index, line in enumerate(lines)
            if (match := TAG_PATTERN.fullmatch(line))]
    cards: list[ParsedCard] = []
    for tag_index, (line_index, cutter) in enumerate(tags):
        end = tags[tag_index + 1][0] if tag_index + 1 < len(tags) else len(lines)
        raw = "\n".join(lines[line_index + 1:end]).strip()
        normalized = normalize_card(raw)
        if len(normalized.split()) < min_words:
            continue
        cards.append(ParsedCard(cutter, raw, normalized, line_index + 1, end,
                                sha256(normalized.encode()).hexdigest()))
    return cards

def shingle_jaccard(left: str, right: str, *, size: int = 3) -> float:
    def shingles(value: str) -> set[tuple[str, ...]]:
        words = value.split()
        return {tuple(words[i:i + size]) for i in range(max(1, len(words) - size + 1))}
    a, b = shingles(normalize_card(left)), shingles(normalize_card(right))
    return len(a & b) / len(a | b) if a or b else 1.0

def duplicate_status(left: str, right: str) -> str:
    if normalize_card(left) == normalize_card(right):
        return "duplicate"
    similarity = shingle_jaccard(left, right)
    if similarity >= .92:
        return "duplicate"
    if similarity >= .80:
        return "near_duplicate"
    return "unique"
