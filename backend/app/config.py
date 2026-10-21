import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
DATA_DIR = BASE_DIR / "data"

LSI_MODEL_PATH = ARTIFACTS_DIR / "lsi_model.pkl"
NMF_MODEL_PATH = ARTIFACTS_DIR / "nmf_model.pkl"
LDA_MODEL_PATH = ARTIFACTS_DIR / "lda_model.pkl"
TFIDF_VEC_PATH = ARTIFACTS_DIR / "tfidf_vectorizer.pkl"
COUNT_VEC_PATH = ARTIFACTS_DIR / "count_vectorizer.pkl"
STOPWORDS_PATH = ARTIFACTS_DIR / "vn_stopwords.pkl"
METADATA_PATH = ARTIFACTS_DIR / "metadata.json"
SAMPLE_DOCS_PATH = DATA_DIR / "sample_documents.json"

NUM_TOPICS = 10
TOP_WORDS_DEFAULT = 15
CORS_ORIGINS = ["*"]
