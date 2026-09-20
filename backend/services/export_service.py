import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from schemas.analysis import AnalysisResult


class ExportService:
    @staticmethod
    def generate_pdf(analysis: AnalysisResult, filename: str = "Resume") -> bytes:
        """Generate a professional PDF report from analysis results."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            topMargin=0.75 * inch,
            bottomMargin=0.75 * inch,
        )
        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            "CustomTitle",
            parent=styles["Heading1"],
            alignment=TA_CENTER,
            spaceAfter=6,
        )
        subtitle_style = ParagraphStyle(
            "Subtitle",
            parent=styles["Normal"],
            alignment=TA_CENTER,
            fontSize=10,
            textColor=colors.grey,
        )

        elements = []

        # Title
        elements.append(Paragraph("Resume Analysis Report", title_style))
        elements.append(Paragraph(f"{filename} — {datetime.now().strftime('%B %d, %Y')}", subtitle_style))
        elements.append(Spacer(1, 20))

        # Overall Score
        score_color = (
            colors.green if analysis.overall_score >= 76
            else colors.orange if analysis.overall_score >= 51
            else colors.red
        )
        elements.append(Paragraph(
            f'<font size="16" color="{score_color}"><b>Overall Score: {analysis.overall_score}/100</b></font>',
            ParagraphStyle("ScoreStyle", parent=styles["Normal"], alignment=TA_CENTER),
        ))
        elements.append(Spacer(1, 12))

        # Summary
        elements.append(Paragraph("<b>Executive Summary</b>", styles["Heading2"]))
        elements.append(Paragraph(analysis.summary, styles["Normal"]))
        elements.append(Spacer(1, 16))

        # Category Breakdown
        elements.append(Paragraph("<b>Category Breakdown</b>", styles["Heading2"]))
        data = [["Category", "Score", "Weight", "Feedback"]]
        for cat in analysis.category_scores:
            data.append([
                cat.category,
                f"{cat.score}/100",
                f"{cat.weight:.0%}",
                Paragraph(cat.feedback, ParagraphStyle("CellText", parent=styles["Normal"], fontSize=8)),
            ])

        col_widths = [1.5 * inch, 0.7 * inch, 0.6 * inch, 3.7 * inch]
        t = Table(data, colWidths=col_widths)
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),  # Slate-900
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, 0), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
            ("TOPPADDING", (0, 0), (-1, 0), 10),
            ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F8FAFC")), # Slate-50
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),  # Slate-200
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("FONTSIZE", (0, 1), (-1, -1), 8),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 16))

        # Section Analysis
        elements.append(Paragraph("<b>Resume Sections</b>", styles["Heading2"]))
        section_data = [["Section", "Status", "Quality", "Feedback"]]
        for sec in analysis.sections:
            status = "Present" if sec.present else "Missing"
            section_data.append([
                sec.section_name,
                status,
                f"{sec.quality_score}/100" if sec.present else "N/A",
                Paragraph(sec.feedback, ParagraphStyle("CellText", parent=styles["Normal"], fontSize=8)),
            ])

        st = Table(section_data, colWidths=[1.5 * inch, 0.7 * inch, 0.7 * inch, 3.6 * inch])
        st.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),  # Slate-900
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 10),
            ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F8FAFC")), # Slate-50
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),  # Slate-200
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("FONTSIZE", (0, 1), (-1, -1), 8),
        ]))
        elements.append(st)
        elements.append(Spacer(1, 16))

        # Keyword Matches (if any)
        if analysis.keyword_matches:
            elements.append(Paragraph("<b>Keyword Matches</b>", styles["Heading2"]))
            kw_data = [["Keyword", "Status", "Context"]]
            for kw in analysis.keyword_matches:
                kw_data.append([
                    kw.keyword,
                    "Found" if kw.found else "Missing",
                    kw.context or "—",
                ])

            kt = Table(kw_data, colWidths=[1.5 * inch, 0.7 * inch, 4.3 * inch])
            kt.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),  # Slate-900
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F8FAFC")), # Slate-50
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),  # Slate-200
                ("FONTSIZE", (0, 1), (-1, -1), 8),
            ]))
            elements.append(kt)
            elements.append(Spacer(1, 16))

        # Strengths
        elements.append(Paragraph("<b>Strengths</b>", styles["Heading2"]))
        for strength in analysis.strengths:
            elements.append(Paragraph(f"• {strength}", styles["Normal"]))
        elements.append(Spacer(1, 12))

        # Critical Improvements
        elements.append(Paragraph("<b>Critical Improvements</b>", styles["Heading2"]))
        for imp in analysis.critical_improvements:
            elements.append(Paragraph(f"• {imp}", styles["Normal"]))
        elements.append(Spacer(1, 12))

        # Detailed Suggestions by Category
        elements.append(Paragraph("<b>Detailed Suggestions</b>", styles["Heading2"]))
        for cat in analysis.category_scores:
            if cat.suggestions:
                elements.append(Paragraph(f"<i><u>{cat.category}</u></i>", styles["Normal"]))
                for sug in cat.suggestions:
                    elements.append(Paragraph(f"  • {sug}", styles["Normal"]))
                elements.append(Spacer(1, 6))

        doc.build(elements)
        return buffer.getvalue()
