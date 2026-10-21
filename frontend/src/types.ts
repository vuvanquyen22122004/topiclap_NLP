export interface DocumentSummary {
  id: number;
  title: string;
  category: string;
  abstract: string;
  char_count: number;
  word_count: number;
}

export interface DocumentDetail extends DocumentSummary {
  content: string;
}

export interface PreprocessResult {
  raw_text: string;
  normalized_text: string;
  tokens: string[];
  total_tokens: number;
  valid_tokens_count: number;
  stopwords_removed_count: number;
  vocab_overlap_ratio_tfidf: number;
  vocab_overlap_ratio_count: number;
  matched_words_tfidf: string[];
  out_of_vocab_words: string[];
  warnings: string[];
}

export interface WordWeight {
  word: string;
  weight: number;
  probability?: number;
  rank: number;
}

export interface TopicInfo {
  topic_id: number;
  topic_name: string;
  label: string;
  top_words: WordWeight[];
  interpretation?: string;
}

export interface ModelTopicSummary {
  model_id: string;
  name: string;
  full_name: string;
  color: string;
  input_representation: string;
  num_topics: number;
  topics: TopicInfo[];
}

export interface TopTopicEntry {
  rank: number;
  topic_id: number;
  topic_name: string;
  label: string;
  raw_weight: number;
  magnitude?: number;
  norm_weight?: number;
  probability?: number;
  top_words: string[];
}

export interface DocTopicRepresentation {
  model_id: string;
  model_name: string;
  color: string;
  input_type: string;
  raw_weights: number[];
  display_weights: number[];
  weight_type: string;
  dominant_topic: number;
  dominant_topic_name: string;
  dominant_weight: number;
  confidence_level: string;
  interpretation: string;
  top_topics: TopTopicEntry[];
}

export interface AnalysisResponse {
  document_id?: number;
  title?: string;
  category?: string;
  raw_text: string;
  preprocessed: PreprocessResult;
  lsi: DocTopicRepresentation;
  lda: DocTopicRepresentation;
  nmf: DocTopicRepresentation;
  inference_time_ms: Record<string, number>;
}

export interface WordComparisonItem {
  word: string;
  in_lsi: boolean;
  in_lda: boolean;
  in_nmf: boolean;
  lsi_weight?: number;
  lda_weight?: number;
  nmf_weight?: number;
  occurrence_count: number;
}

export interface ComparisonResponse {
  document_id?: number;
  raw_text_preview: string;
  preprocessed: PreprocessResult;
  lsi: DocTopicRepresentation;
  lda: DocTopicRepresentation;
  nmf: DocTopicRepresentation;
  shared_keywords: WordComparisonItem[];
  unique_to_lsi: string[];
  unique_to_lda: string[];
  unique_to_nmf: string[];
  comparative_analysis: {
    lsi_dominant: string;
    lda_dominant: string;
    nmf_dominant: string;
    words_in_all_three: string[];
    degree_of_consensus: string;
    scientific_notes: string[];
  };
  inference_time_ms: Record<string, number>;
}

export interface MetricRow {
  model: string;
  input_representation: string;
  coherence_cv: number;
  topic_diversity: number;
  avg_jaccard: number;
  reconstruction_error: number | null;
  percent_negative_h: number;
  percent_zero_h: number;
  train_time_sec: number;
  doc_distribution: number[];
}

export interface KSweepPoint {
  k: number;
  coherence_cv: number;
}

export interface EvaluationResponse {
  dataset_info: {
    dataset_name: string;
    total_corpus_docs: number;
    sample_training_docs: number;
    language: string;
    vocabulary_size: number;
    num_topics_k: number;
    random_seed: number;
    preprocessing_steps: string[];
    training_environment: string;
  };
  metrics_table: MetricRow[];
  k_sweep: Record<string, KSweepPoint[]>;
  metric_definitions: Record<string, string>;
  key_findings: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface TheorySection {
  model_id: string;
  name: string;
  full_name: string;
  badge_color: string;
  intuition: string;
  toy_example: {
    description: string;
    matrix_raw: number[][];
    explanation: string;
  };
  processing_pipeline: Array<{ step: string; detail: string }>;
  math_formulation: Record<string, string>;
  symbol_table: Array<{ symbol: string; meaning: string }>;
  pros: string[];
  cons: string[];
  platform_connection: string;
  quiz: QuizQuestion[];
}

export interface HealthStatus {
  status: string;
  version: string;
  artifacts_loaded: boolean;
  models_available: string[];
  num_topics: number;
  sample_docs_count: number;
  warnings: string[];
}
