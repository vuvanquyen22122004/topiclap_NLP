from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Union

class DocumentSummary(BaseModel):
    id: int
    title: str
    category: str
    abstract: str
    char_count: int
    word_count: int

class DocumentDetail(DocumentSummary):
    content: str

class PreprocessResult(BaseModel):
    raw_text: str
    normalized_text: str
    tokens: List[str]
    total_tokens: int
    valid_tokens_count: int
    stopwords_removed_count: int
    vocab_overlap_ratio_tfidf: float
    vocab_overlap_ratio_count: float
    matched_words_tfidf: List[str]
    out_of_vocab_words: List[str]
    warnings: List[str]

class WordWeight(BaseModel):
    word: str
    weight: float
    probability: Optional[float] = None
    rank: int

class TopicInfo(BaseModel):
    topic_id: int
    topic_name: str
    label: str
    top_words: List[WordWeight]
    interpretation: Optional[str] = None

class ModelTopicSummary(BaseModel):
    model_id: str
    name: str
    full_name: str
    color: str
    input_representation: str
    num_topics: int
    topics: List[TopicInfo]

class DocTopicRepresentation(BaseModel):
    model_id: str
    model_name: str
    color: str
    input_type: str
    raw_weights: List[float]
    display_weights: List[float]
    weight_type: str  # "SVD Coordinate", "Dirichlet Probability", "NMF Factorization Weight"
    dominant_topic: int
    dominant_topic_name: str
    dominant_weight: float
    confidence_level: str
    interpretation: str
    top_topics: List[Dict[str, Any]]

class AnalysisRequest(BaseModel):
    document_id: Optional[int] = None
    custom_text: Optional[str] = None

class AnalysisResponse(BaseModel):
    document_id: Optional[int] = None
    title: Optional[str] = None
    category: Optional[str] = None
    raw_text: str
    preprocessed: PreprocessResult
    lsi: DocTopicRepresentation
    lda: DocTopicRepresentation
    nmf: DocTopicRepresentation
    inference_time_ms: Dict[str, float]

class WordComparisonItem(BaseModel):
    word: str
    in_lsi: bool
    in_lda: bool
    in_nmf: bool
    lsi_weight: Optional[float] = None
    lda_weight: Optional[float] = None
    nmf_weight: Optional[float] = None
    occurrence_count: int

class ComparisonResponse(BaseModel):
    document_id: Optional[int] = None
    raw_text_preview: str
    preprocessed: PreprocessResult
    lsi: DocTopicRepresentation
    lda: DocTopicRepresentation
    nmf: DocTopicRepresentation
    shared_keywords: List[WordComparisonItem]
    unique_to_lsi: List[str]
    unique_to_lda: List[str]
    unique_to_nmf: List[str]
    comparative_analysis: Dict[str, Any]
    inference_time_ms: Dict[str, float]

class MetricRow(BaseModel):
    model: str
    input_representation: str
    coherence_cv: float
    topic_diversity: float
    avg_jaccard: float
    reconstruction_error: Optional[float]
    percent_negative_h: float
    percent_zero_h: float
    train_time_sec: float
    doc_distribution: List[int]

class KSweepPoint(BaseModel):
    k: int
    coherence_cv: float

class EvaluationResponse(BaseModel):
    dataset_info: Dict[str, Any]
    metrics_table: List[MetricRow]
    k_sweep: Dict[str, List[KSweepPoint]]
    metric_definitions: Dict[str, str]
    key_findings: List[str]

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_index: int
    explanation: str

class TheorySection(BaseModel):
    model_id: str
    name: str
    full_name: str
    badge_color: str
    intuition: str
    toy_example: Dict[str, Any]
    processing_pipeline: List[Dict[str, str]]
    math_formulation: Dict[str, str]
    symbol_table: List[Dict[str, str]]
    pros: List[str]
    cons: List[str]
    platform_connection: str
    quiz: List[QuizQuestion]

class HealthStatus(BaseModel):
    status: str
    version: str
    artifacts_loaded: bool
    models_available: List[str]
    num_topics: int
    sample_docs_count: int
    warnings: List[str]
