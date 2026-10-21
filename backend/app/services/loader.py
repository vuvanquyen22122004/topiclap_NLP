import json
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
import joblib
import numpy as np
from app.config import (
    LSI_MODEL_PATH,
    NMF_MODEL_PATH,
    LDA_MODEL_PATH,
    TFIDF_VEC_PATH,
    COUNT_VEC_PATH,
    STOPWORDS_PATH,
    METADATA_PATH,
    SAMPLE_DOCS_PATH,
    NUM_TOPICS
)
from app.schemas import TopicInfo, WordWeight, ModelTopicSummary

logger = logging.getLogger(__name__)

class ModelRegistry:
    _instance: Optional['ModelRegistry'] = None

    def __init__(self):
        self.is_loaded = False
        self.lsi_model = None
        self.nmf_model = None
        self.lda_model = None
        self.tfidf_vectorizer = None
        self.count_vectorizer = None
        self.stopwords = set()
        self.metadata = {}
        self.sample_documents = []
        self.tfidf_feature_names: np.ndarray = np.array([])
        self.count_feature_names: np.ndarray = np.array([])
        self.topic_labels: Dict[str, Dict[int, str]] = {"lsi": {}, "lda": {}, "nmf": {}}
        self.model_summaries: Dict[str, ModelTopicSummary] = {}
        self.warnings: List[str] = []

    @classmethod
    def get_instance(cls) -> 'ModelRegistry':
        if cls._instance is None:
            cls._instance = ModelRegistry()
        return cls._instance

    def load_all(self):
        logger.info("Initializing ModelRegistry: loading artifacts...")
        self.warnings = []

        # 1. Stopwords
        try:
            self.stopwords = joblib.load(STOPWORDS_PATH)
            logger.info(f"Loaded {len(self.stopwords)} stopwords.")
        except Exception as e:
            msg = f"Failed to load stopwords: {e}"
            logger.error(msg)
            self.warnings.append(msg)
            self.stopwords = set()

        # 2. TF-IDF Vectorizer
        try:
            self.tfidf_vectorizer = joblib.load(TFIDF_VEC_PATH)
            self.tfidf_feature_names = self.tfidf_vectorizer.get_feature_names_out()
            logger.info(f"Loaded TF-IDF Vectorizer with {len(self.tfidf_feature_names)} features.")
        except Exception as e:
            msg = f"Failed to load TF-IDF vectorizer: {e}"
            logger.error(msg)
            self.warnings.append(msg)

        # 3. Count Vectorizer
        try:
            self.count_vectorizer = joblib.load(COUNT_VEC_PATH)
            self.count_feature_names = self.count_vectorizer.get_feature_names_out()
            logger.info(f"Loaded Count Vectorizer with {len(self.count_feature_names)} features.")
        except Exception as e:
            msg = f"Failed to load Count vectorizer: {e}"
            logger.error(msg)
            self.warnings.append(msg)

        # 4. LSI Model
        try:
            self.lsi_model = joblib.load(LSI_MODEL_PATH)
            logger.info(f"Loaded LSI (TruncatedSVD) model: shape {self.lsi_model.components_.shape}")
        except Exception as e:
            msg = f"Failed to load LSI model: {e}"
            logger.error(msg)
            self.warnings.append(msg)

        # 5. NMF Model
        try:
            self.nmf_model = joblib.load(NMF_MODEL_PATH)
            logger.info(f"Loaded NMF model: shape {self.nmf_model.components_.shape}")
        except Exception as e:
            msg = f"Failed to load NMF model: {e}"
            logger.error(msg)
            self.warnings.append(msg)

        # 6. LDA Model
        try:
            self.lda_model = joblib.load(LDA_MODEL_PATH)
            logger.info(f"Loaded LDA model: shape {self.lda_model.components_.shape}")
        except Exception as e:
            msg = f"Failed to load LDA model: {e}"
            logger.error(msg)
            self.warnings.append(msg)

        # 7. Metadata
        try:
            with open(METADATA_PATH, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)
            logger.info("Loaded metadata.json.")
        except Exception as e:
            msg = f"Failed to load metadata: {e}"
            logger.error(msg)
            self.warnings.append(msg)

        # 8. Sample Documents
        try:
            with open(SAMPLE_DOCS_PATH, "r", encoding="utf-8") as f:
                self.sample_documents = json.load(f)
            logger.info(f"Loaded {len(self.sample_documents)} sample documents.")
        except Exception as e:
            msg = f"Failed to load sample documents: {e}"
            logger.error(msg)
            self.warnings.append(msg)

        # Build topic summaries and automatic descriptive labels
        self._build_topic_summaries()
        self.is_loaded = (
            self.lsi_model is not None and
            self.nmf_model is not None and
            self.lda_model is not None and
            self.tfidf_vectorizer is not None and
            self.count_vectorizer is not None
        )
        logger.info(f"ModelRegistry initialization complete. Ready: {self.is_loaded}")

    def _generate_topic_label(self, top_words: List[str]) -> str:
        words = [w.replace("_", " ") for w in top_words[:3]]
        return " - ".join(words).title()

    def _build_topic_summaries(self):
        # Human-interpretable thematic interpretations for the 10 topics in each model
        # derived from the actual top keywords
        
        # 1. LSI
        if self.lsi_model is not None and len(self.tfidf_feature_names) > 0:
            lsi_topics = []
            for i in range(self.lsi_model.components_.shape[0]):
                comp = self.lsi_model.components_[i]
                top_idx = [int(x) for x in np.argsort(comp)[::-1][:15]]
                top_words = [
                    WordWeight(
                        word=str(self.tfidf_feature_names[j]),
                        weight=float(round(comp[j], 4)),
                        rank=int(r + 1)
                    )
                    for r, j in enumerate(top_idx)
                ]
                label = self._generate_topic_label([w.word for w in top_words])
                lsi_topics.append(TopicInfo(
                    topic_id=int(i + 1),
                    topic_name=f"Thành phần SVD {i + 1}",
                    label=label,
                    top_words=top_words,
                    interpretation=f"Thành phần ngữ nghĩa tiềm ẩn thứ {i+1} trong không gian phân rã SVD."
                ))
            self.model_summaries["lsi"] = ModelTopicSummary(
                model_id="lsi",
                name="LSI",
                full_name="Latent Semantic Indexing",
                color="#2563eb",
                input_representation="TF-IDF",
                num_topics=len(lsi_topics),
                topics=lsi_topics
            )

        # 2. NMF
        if self.nmf_model is not None and len(self.tfidf_feature_names) > 0:
            nmf_topics = []
            for i in range(self.nmf_model.components_.shape[0]):
                comp = self.nmf_model.components_[i]
                top_idx = [int(x) for x in np.argsort(comp)[::-1][:15]]
                top_words = [
                    WordWeight(
                        word=str(self.tfidf_feature_names[j]),
                        weight=float(round(comp[j], 4)),
                        rank=int(r + 1)
                    )
                    for r, j in enumerate(top_idx)
                ]
                label = self._generate_topic_label([w.word for w in top_words])
                nmf_topics.append(TopicInfo(
                    topic_id=int(i + 1),
                    topic_name=f"Chủ đề NMF {i + 1}",
                    label=label,
                    top_words=top_words,
                    interpretation=f"Thành phần chủ đề không âm thứ {i+1} từ phân rã ma trận V ≈ WH."
                ))
            self.model_summaries["nmf"] = ModelTopicSummary(
                model_id="nmf",
                name="NMF",
                full_name="Non-negative Matrix Factorization",
                color="#ea580c",
                input_representation="TF-IDF",
                num_topics=len(nmf_topics),
                topics=nmf_topics
            )

        # 3. LDA
        if self.lda_model is not None and len(self.count_feature_names) > 0:
            lda_topics = []
            for i in range(self.lda_model.components_.shape[0]):
                comp = self.lda_model.components_[i]
                prob = comp / comp.sum()
                top_idx = [int(x) for x in np.argsort(comp)[::-1][:15]]
                top_words = [
                    WordWeight(
                        word=str(self.count_feature_names[j]),
                        weight=float(round(comp[j], 2)),
                        probability=float(round(prob[j], 5)),
                        rank=int(r + 1)
                    )
                    for r, j in enumerate(top_idx)
                ]
                label = self._generate_topic_label([w.word for w in top_words])
                lda_topics.append(TopicInfo(
                    topic_id=int(i + 1),
                    topic_name=f"Chủ đề LDA {i + 1}",
                    label=label,
                    top_words=top_words,
                    interpretation=f"Phân phối xác suất từ phi_k theo phân phối tiền định Dirichlet."
                ))
            self.model_summaries["lda"] = ModelTopicSummary(
                model_id="lda",
                name="LDA",
                full_name="Latent Dirichlet Allocation",
                color="#16a34a",
                input_representation="Bag-of-Words (Count)",
                num_topics=len(lda_topics),
                topics=lda_topics
            )

registry = ModelRegistry.get_instance()
