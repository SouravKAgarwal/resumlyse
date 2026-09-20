import pymupdf
from parsers.base import BaseParser
from schemas.resume import ParsedResume, Hyperlink


class PDFParser(BaseParser):
    """Extract text, hyperlinks, and font metadata from PDF files using PyMuPDF."""

    def parse(self, file_path: str) -> ParsedResume:
        doc = pymupdf.open(file_path)
        full_text = ""
        hyperlinks = []
        fonts_used = set()

        for page in doc:
            full_text += page.get_text("text")

            # Extract hyperlinks with visible text
            links = page.get_links()
            words = page.get_text("words")
            uri_links = [link for link in links if "uri" in link]

            for link in uri_links:
                link_rect = pymupdf.Rect(link["from"])
                link_url = link["uri"]

                # Find words overlapping the link's bounding box
                linked_words = []
                for w in words:
                    word_rect = pymupdf.Rect(w[0], w[1], w[2], w[3])
                    if link_rect.contains(word_rect) or word_rect.intersects(link_rect):
                        linked_words.append(w[4])

                visible_text = " ".join(linked_words).strip() or link_url
                hyperlinks.append(Hyperlink(text=visible_text, url=link_url))

            # Extract font information for formatting analysis
            try:
                blocks = page.get_text("dict")["blocks"]
                for block in blocks:
                    if "lines" in block:
                        for line in block["lines"]:
                            for span in line["spans"]:
                                fonts_used.add(f"{span['font']}:{span['size']:.1f}")
            except Exception:
                pass

        page_count = len(doc)
        doc.close()
        return ParsedResume(
            text=full_text,
            hyperlinks=hyperlinks,
            metadata={
                "page_count": page_count,
                "fonts": list(fonts_used)[:20],  # Cap at 20 to avoid noise
            },
        )
