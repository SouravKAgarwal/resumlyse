export interface CategoryScore {
  category: string;
  score: number;
  weight: number;
  feedback: string;
  suggestions: string[];
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  context: string | null;
}

export interface SectionPresence {
  section_name: string;
  present: boolean;
  quality_score: number;
  feedback: string;
  suggested_content?: string | null;
}

export interface AnalysisResult {
  overall_score: number;
  category_scores: CategoryScore[];
  sections: SectionPresence[];
  keyword_matches: KeywordMatch[];
  strengths: string[];
  critical_improvements: string[];
  summary: string;
}

export interface AnalysisRecord {
  id: number;
  filename: string;
  overall_score: number;
  created_at: string;
  job_description: string | null;
}
