from schemas.analysis import AnalysisResult


class ScoreCalculator:
    """Recalculate the overall score from category scores using their weights."""

    @staticmethod
    def calculate_overall(analysis: AnalysisResult) -> int:
        """Compute weighted average of category scores."""
        if not analysis.category_scores:
            return 0
        total = sum(cat.score * cat.weight for cat in analysis.category_scores)
        return min(max(round(total), 0), 100)
