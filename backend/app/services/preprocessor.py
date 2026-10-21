import re
import logging
from typing import List, Tuple, Set, Dict, Any
from app.services.loader import registry
from app.schemas import PreprocessResult

logger = logging.getLogger(__name__)

# Try importing underthesea, fallback to pyvi if underthesea has any issue
USE_UNDERTHESEA = False
try:
    from underthesea import word_tokenize, text_normalize
    USE_UNDERTHESEA = True
except Exception as e:
    logger.warning(f"Underthesea import note: {e}, falling back to pyvi / regex")
    try:
        from pyvi import ViTokenizer
    except ImportError:
        pass

def normalize_text_custom(text: str) -> str:
    """Normalize whitespace and lowercase."""
    text = text.lower()
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def tokenize_vietnamese(text: str) -> List[str]:
    """Tokenize Vietnamese text with compound word linking via underscores."""
    if not text:
        return []
    
    clean_text = text.lower()
    
    # Try underthesea first (as used in the Colab notebook)
    if USE_UNDERTHESEA:
        try:
            norm = text_normalize(clean_text)
            tokenized_str = word_tokenize(norm, format="text")
            tokens = tokenized_str.split()
            return tokens
        except Exception as e:
            logger.warning(f"Underthesea tokenization failed: {e}, using pyvi fallback")

    # PyVi fallback
    try:
        from pyvi import ViTokenizer
        tokenized_str = ViTokenizer.tokenize(clean_text)
        return tokenized_str.split()
    except Exception as e2:
        logger.warning(f"PyVi fallback failed: {e2}, using regex fallback")
        return re.findall(r'\b[a-zA-Z0-9_\u00C0-\u1EF9]+\b', clean_text)

def preprocess_document(raw_text: str) -> PreprocessResult:
    """Complete preprocessing pipeline matching the Colab training pipeline."""
    if not raw_text or not raw_text.strip():
        return PreprocessResult(
            raw_text="",
            normalized_text="",
            tokens=[],
            total_tokens=0,
            valid_tokens_count=0,
            stopwords_removed_count=0,
            vocab_overlap_ratio_tfidf=0.0,
            vocab_overlap_ratio_count=0.0,
            matched_words_tfidf=[],
            out_of_vocab_words=[],
            warnings=["Văn bản đầu vào rỗng. Vui lòng nhập nội dung để phân tích."]
        )

    norm_text = normalize_text_custom(raw_text)
    
    # Tokenize
    raw_tokens = tokenize_vietnamese(norm_text)
    total_tokens = len(raw_tokens)
    
    stopwords = registry.stopwords if registry.stopwords else set()
    
    cleaned_tokens: List[str] = []
    stopwords_count = 0

    for t in raw_tokens:
        token = t.lower()
        # Clean punctuation from edges
        token = re.sub(r'^[^\w\u00C0-\u1EF9]+|[^\w\u00C0-\u1EF9]+$', '', token)
        if not token:
            continue
            
        if token in stopwords or token.replace("_", " ") in stopwords:
            stopwords_count += 1
            continue
            
        # Ignore single characters or pure digits
        if len(token) <= 1 or token.isdigit():
            continue
            
        # Ignore tokens that are only punctuation or special symbols
        if not re.search(r'[a-zA-Z\u00C0-\u1EF9]', token):
            continue
            
        cleaned_tokens.append(token)

    # Check against vectorizers vocabulary
    tv_vocab = registry.tfidf_vectorizer.vocabulary_ if registry.tfidf_vectorizer else {}
    cv_vocab = registry.count_vectorizer.vocabulary_ if registry.count_vectorizer else {}

    matched_tfidf = [t for t in cleaned_tokens if t in tv_vocab]
    matched_count = [t for t in cleaned_tokens if t in cv_vocab]
    out_of_vocab = [t for t in cleaned_tokens if t not in tv_vocab and t not in cv_vocab]

    n_valid = len(cleaned_tokens)
    ratio_tfidf = round(len(matched_tfidf) / n_valid, 4) if n_valid > 0 else 0.0
    ratio_count = round(len(matched_count) / n_valid, 4) if n_valid > 0 else 0.0

    warnings: List[str] = []
    if n_valid == 0:
        warnings.append("Văn bản không chứa từ nào hợp lệ sau khi loại bỏ stopwords và ký tự đặc biệt.")
    elif len(matched_tfidf) == 0 and len(matched_count) == 0:
        warnings.append("Không có từ nào trong văn bản trùng khớp với từ vựng 10,000 từ đã học của mô hình. Kết quả suy luận có thể không mang ý nghĩa.")
    elif ratio_tfidf < 0.35:
        warnings.append(f"Tỷ lệ từ vựng khớp khá thấp ({int(ratio_tfidf * 100)}%). Mô hình có thể dự đoán kém chính xác đối với văn bản này.")
        
    if n_valid > 0 and n_valid < 5:
        warnings.append("Văn bản quá ngắn (dưới 5 từ hợp lệ), thông tin ngữ nghĩa có thể chưa đủ để phân bổ chủ đề rõ nét.")

    return PreprocessResult(
        raw_text=raw_text,
        normalized_text=norm_text,
        tokens=cleaned_tokens,
        total_tokens=total_tokens,
        valid_tokens_count=n_valid,
        stopwords_removed_count=stopwords_count,
        vocab_overlap_ratio_tfidf=ratio_tfidf,
        vocab_overlap_ratio_count=ratio_count,
        matched_words_tfidf=list(dict.fromkeys(matched_tfidf))[:25],
        out_of_vocab_words=list(dict.fromkeys(out_of_vocab))[:25],
        warnings=warnings
    )
