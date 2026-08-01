import unittest
from card_pipeline import duplicate_status, parse_cards

class CardPipelineTests(unittest.TestCase):
    def test_parses_until_next_strict_tag(self):
        cards = parse_cards("// pingkang\nA complete evidence card with enough words here.\n// tony\nAnother complete evidence card with enough words.")
        self.assertEqual(["pingkang", "tony"], [card.cutter_tag for card in cards])

    def test_ignores_inline_and_short_sections(self):
        text = "note // pingkang\nnot a card\n// tony\ntoo short"
        self.assertEqual([], parse_cards(text))

    def test_format_only_change_is_exact_duplicate(self):
        self.assertEqual("duplicate", duplicate_status("Grid POWER -- solves now.", "grid power solves now"))

    def test_different_evidence_is_unique(self):
        self.assertEqual("unique", duplicate_status("transmission capacity prevents outages across regions", "health insurance access improves rural outcomes"))

if __name__ == "__main__":
    unittest.main()
