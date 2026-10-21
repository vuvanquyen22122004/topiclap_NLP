import time
import logging
from typing import Dict, Any, List, Tuple
import numpy as np
from app.services.loader import registry
from app.services.preprocessor import preprocess_document
from app.schemas import DocTopicRepresentation, PreprocessResult

logger = logging.getLogger(__name__)

def infer_lsi(joined_text: str) -> Tuple[DocTopicRepresentation, float]:
    """Inference for LSI (TruncatedSVD) using TF-IDF input."""
    t0 = time.perf_counter()
    if not registry.lsi_model or not registry.tfidf_vectorizer:
        raise RuntimeError("LSI model or TF-IDF vectorizer not initialized.")
        
    vec = registry.tfidf_vectorizer.transform([joined_text])
    raw_coords = registry.lsi_model.transform(vec)[0]  # shape (10,)
    elapsed_ms = float((time.perf_counter() - t0) * 1000.0)

    raw_list = [float(round(v, 4)) for v in raw_coords]
    
    # Dominant component is identified by maximum magnitude (signal energy)
    abs_coords = np.abs(raw_coords)
    dominant_idx = int(np.argmax(abs_coords)) if float(np.max(abs_coords)) > 1e-6 else 0
    dominant_val = float(raw_list[dominant_idx])

    # Rank components by absolute significance
    sorted_indices = [int(i) for i in np.argsort(abs_coords)[::-1]]
    top_topics = []
    summary = registry.model_summaries.get("lsi")
    for r, idx in enumerate(sorted_indices[:5]):
        topic_info = summary.topics[idx] if summary and idx < len(summary.topics) else None
        label = str(topic_info.label) if topic_info else f"Thành phần {idx + 1}"
        top_words = [str(w.word) for w in topic_info.top_words[:5]] if topic_info else []
        top_topics.append({
            "rank": int(r + 1),
            "topic_id": int(idx + 1),
            "topic_name": f"Thành phần SVD {idx + 1}",
            "label": label,
            "raw_weight": float(raw_list[idx]),
            "magnitude": float(round(abs_coords[idx], 4)),
            "top_words": top_words
        })

    confidence = "Rõ ràng" if abs_coords[dominant_idx] > 0.08 else "Yếu / Không rõ"
    interpretation = (
        f"Chiếu tài liệu vào không gian 10 chiều tiềm ẩn của ma trận SVD (A ≈ UΣVᵀ). "
        f"Thành phần mạnh nhất là Thành phần {dominant_idx + 1} với tọa độ {dominant_val:+.4f}. "
        f"Lưu ý: Hệ số LSI là tọa độ đại số tuyến tính có dấu (+/-), KHÔNG PHẢI xác suất."
    )

    doc_rep = DocTopicRepresentation(
        model_id="lsi",
        model_name="LSI",
        color="#2563eb",
        input_type="TF-IDF",
        raw_weights=raw_list,
        display_weights=raw_list,
        weight_type="Tọa độ SVD có dấu (+/-)",
        dominant_topic=int(dominant_idx + 1),
        dominant_topic_name=f"Thành phần {dominant_idx + 1}: {top_topics[0]['label']}",
        dominant_weight=dominant_val,
        confidence_level=confidence,
        interpretation=interpretation,
        top_topics=top_topics
    )
    return doc_rep, elapsed_ms


def infer_nmf(joined_text: str) -> Tuple[DocTopicRepresentation, float]:
    """Inference for NMF using TF-IDF input."""
    t0 = time.perf_counter()
    if not registry.nmf_model or not registry.tfidf_vectorizer:
        raise RuntimeError("NMF model or TF-IDF vectorizer not initialized.")
        
    vec = registry.tfidf_vectorizer.transform([joined_text])
    raw_weights = registry.nmf_model.transform(vec)[0]  # shape (10,) non-negative
    elapsed_ms = float((time.perf_counter() - t0) * 1000.0)

    raw_list = [float(round(v, 4)) for v in raw_weights]
    sum_w = float(np.sum(raw_weights))
    
    # Normalized weights for visual comparison (L1 sum to 1.0 if sum > 0)
    if sum_w > 1e-8:
        norm_list = [float(round(v / sum_w, 4)) for v in raw_weights]
    else:
        norm_list = [0.1] * len(raw_weights)

    dominant_idx = int(np.argmax(raw_weights)) if sum_w > 1e-6 else 0
    dominant_val = float(raw_list[dominant_idx])

    sorted_indices = [int(i) for i in np.argsort(raw_weights)[::-1]]
    top_topics = []
    summary = registry.model_summaries.get("nmf")
    for r, idx in enumerate(sorted_indices[:5]):
        topic_info = summary.topics[idx] if summary and idx < len(summary.topics) else None
        label = str(topic_info.label) if topic_info else f"Chủ đề {idx + 1}"
        top_words = [str(w.word) for w in topic_info.top_words[:5]] if topic_info else []
        top_topics.append({
            "rank": int(r + 1),
            "topic_id": int(idx + 1),
            "topic_name": f"Chủ đề NMF {idx + 1}",
            "label": label,
            "raw_weight": float(raw_list[idx]),
            "norm_weight": float(norm_list[idx]),
            "top_words": top_words
        })

    confidence = "Rõ ràng" if norm_list[dominant_idx] > 0.35 else ("Trung bình" if norm_list[dominant_idx] > 0.20 else "Phân tán")
    interpretation = (
        f"Phân rã ma trận không âm V ≈ WH. Trọng số W ≥ 0 biểu thị mức độ pha trộn thành phần. "
        f"Chủ đề chiếm ưu thế là Chủ đề {dominant_idx + 1} ({top_topics[0]['label']}) "
        f"với trọng số {dominant_val:.4f} (chiếm {norm_list[dominant_idx]*100:.1f}% tổng trọng số). "
        f"Lưu ý: Trọng số gốc mang tính thành phần tuyến tính không âm, chỉ khi chuẩn hóa L1 mới biểu diễn tỷ lệ đóng góp."
    )

    doc_rep = DocTopicRepresentation(
        model_id="nmf",
        model_name="NMF",
        color="#ea580c",
        input_type="TF-IDF",
        raw_weights=raw_list,
        display_weights=norm_list,
        weight_type="Trọng số ma trận không âm (W ≥ 0)",
        dominant_topic=int(dominant_idx + 1),
        dominant_topic_name=f"Chủ đề {dominant_idx + 1}: {top_topics[0]['label']}",
        dominant_weight=dominant_val,
        confidence_level=confidence,
        interpretation=interpretation,
        top_topics=top_topics
    )
    return doc_rep, elapsed_ms


def infer_lda(joined_text: str) -> Tuple[DocTopicRepresentation, float]:
    """Inference for LDA using CountVectorizer (Bag-of-Words) input."""
    t0 = time.perf_counter()
    if not registry.lda_model or not registry.count_vectorizer:
        raise RuntimeError("LDA model or Count vectorizer not initialized.")
        
    vec = registry.count_vectorizer.transform([joined_text])
    raw_probs = registry.lda_model.transform(vec)[0]  # shape (10,) sums to 1.0
    elapsed_ms = float((time.perf_counter() - t0) * 1000.0)

    raw_list = [float(round(v, 4)) for v in raw_probs]
    dominant_idx = int(np.argmax(raw_probs))
    dominant_val = float(raw_list[dominant_idx])

    sorted_indices = [int(i) for i in np.argsort(raw_probs)[::-1]]
    top_topics = []
    summary = registry.model_summaries.get("lda")
    for r, idx in enumerate(sorted_indices[:5]):
        topic_info = summary.topics[idx] if summary and idx < len(summary.topics) else None
        label = str(topic_info.label) if topic_info else f"Chủ đề {idx + 1}"
        top_words = [str(w.word) for w in topic_info.top_words[:5]] if topic_info else []
        top_topics.append({
            "rank": int(r + 1),
            "topic_id": int(idx + 1),
            "topic_name": f"Chủ đề LDA {idx + 1}",
            "label": label,
            "probability": float(raw_list[idx]),
            "top_words": top_words
        })

    confidence = "Rất cao" if dominant_val > 0.6 else ("Trung bình" if dominant_val > 0.35 else "Đa chủ đề / Hỗn hợp")
    interpretation = (
        f"Mô hình sinh xác suất theo phân phối Dirichlet: theta_d ~ Dir(alpha). "
        f"Tài liệu có xác suất thuộc về Chủ đề {dominant_idx + 1} ({top_topics[0]['label']}) "
        f"cao nhất là {dominant_val * 100:.1f}%. Tổng xác suất của 10 chủ đề luôn bằng 100%."
    )

    doc_rep = DocTopicRepresentation(
        model_id="lda",
        model_name="LDA",
        color="#16a34a",
        input_type="Bag-of-Words (Đếm từ)",
        raw_weights=raw_list,
        display_weights=raw_list,
        weight_type="Xác suất chủ đề (Topic Probability, Sum = 1.0)",
        dominant_topic=int(dominant_idx + 1),
        dominant_topic_name=f"Chủ đề {dominant_idx + 1}: {top_topics[0]['label']}",
        dominant_weight=dominant_val,
        confidence_level=confidence,
        interpretation=interpretation,
        top_topics=top_topics
    )
    return doc_rep, elapsed_ms


def analyze_document_content(raw_text: str) -> Dict[str, Any]:
    """Run preprocessing and inference across all 3 models on the text."""
    prep = preprocess_document(raw_text)
    joined_text = " ".join(prep.tokens)

    lsi_rep, lsi_time = infer_lsi(joined_text)
    nmf_rep, nmf_time = infer_nmf(joined_text)
    lda_rep, lda_time = infer_lda(joined_text)

    return {
        "raw_text": raw_text,
        "preprocessed": prep,
        "lsi": lsi_rep,
        "nmf": nmf_rep,
        "lda": lda_rep,
        "inference_time_ms": {
            "LSI": float(round(lsi_time, 2)),
            "NMF": float(round(nmf_time, 2)),
            "LDA": float(round(lda_time, 2)),
            "Total": float(round(lsi_time + nmf_time + lda_time, 2))
        }
    }
