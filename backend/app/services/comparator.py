import logging
from typing import Dict, Any, List, Set, Optional
from app.services.loader import registry
from app.services.inference import analyze_document_content
from app.schemas import ComparisonResponse, WordComparisonItem

logger = logging.getLogger(__name__)

def compare_document_across_models(raw_text: str, document_id: Optional[int] = None) -> ComparisonResponse:
    """Analyze a single document across all 3 models and compute keyword intersections."""
    analysis = analyze_document_content(raw_text)
    
    lsi_rep = analysis["lsi"]
    lda_rep = analysis["lda"]
    nmf_rep = analysis["nmf"]
    prep = analysis["preprocessed"]
    times = analysis["inference_time_ms"]

    # Get the dominant topic top words for each model
    lsi_summary = registry.model_summaries.get("lsi")
    lda_summary = registry.model_summaries.get("lda")
    nmf_summary = registry.model_summaries.get("nmf")

    lsi_dom_id = lsi_rep.dominant_topic - 1
    lda_dom_id = lda_rep.dominant_topic - 1
    nmf_dom_id = nmf_rep.dominant_topic - 1

    lsi_words_dict: Dict[str, float] = {}
    if lsi_summary and 0 <= lsi_dom_id < len(lsi_summary.topics):
        for w in lsi_summary.topics[lsi_dom_id].top_words[:12]:
            lsi_words_dict[w.word] = w.weight

    lda_words_dict: Dict[str, float] = {}
    if lda_summary and 0 <= lda_dom_id < len(lda_summary.topics):
        for w in lda_summary.topics[lda_dom_id].top_words[:12]:
            lda_words_dict[w.word] = w.probability or w.weight

    nmf_words_dict: Dict[str, float] = {}
    if nmf_summary and 0 <= nmf_dom_id < len(nmf_summary.topics):
        for w in nmf_summary.topics[nmf_dom_id].top_words[:12]:
            nmf_words_dict[w.word] = w.weight

    all_vocab_words = set(lsi_words_dict.keys()) | set(lda_words_dict.keys()) | set(nmf_words_dict.keys())
    
    shared_items: List[WordComparisonItem] = []
    unique_lsi: List[str] = []
    unique_lda: List[str] = []
    unique_nmf: List[str] = []

    for word in all_vocab_words:
        in_lsi = word in lsi_words_dict
        in_lda = word in lda_words_dict
        in_nmf = word in nmf_words_dict
        count = int(in_lsi) + int(in_lda) + int(in_nmf)

        item = WordComparisonItem(
            word=word,
            in_lsi=in_lsi,
            in_lda=in_lda,
            in_nmf=in_nmf,
            lsi_weight=lsi_words_dict.get(word),
            lda_weight=lda_words_dict.get(word),
            nmf_weight=nmf_words_dict.get(word),
            occurrence_count=count
        )

        if count >= 2:
            shared_items.append(item)
        elif in_lsi:
            unique_lsi.append(word)
        elif in_lda:
            unique_lda.append(word)
        elif in_nmf:
            unique_nmf.append(word)

    # Sort shared items: 3-model matches first, then 2-model matches
    shared_items.sort(key=lambda x: (x.occurrence_count, (x.nmf_weight or 0)), reverse=True)

    # Synthesize comparative insights
    words_in_all_3 = [item.word for item in shared_items if item.occurrence_count == 3]
    
    comparative_analysis = {
        "lsi_dominant": lsi_rep.dominant_topic_name,
        "lda_dominant": lda_rep.dominant_topic_name,
        "nmf_dominant": nmf_rep.dominant_topic_name,
        "words_in_all_three": words_in_all_3,
        "degree_of_consensus": (
            "Đồng thuận cao" if len(words_in_all_3) >= 3 else (
                "Đồng thuận một phần" if len(shared_items) >= 4 else "Phân kỳ / Tiếp cận góc nhìn khác nhau"
            )
        ),
        "scientific_notes": [
            "LSI sử dụng SVD tạo các trục trực giao trong không gian ngữ nghĩa tiềm ẩn. Hệ số có thể âm hoặc dương, thể hiện hướng tương phản ngữ nghĩa.",
            "LDA là mô hình sinh xác suất theo tiên nghiệm Dirichlet, gán mỗi văn bản một phân phối xác suất hợp thức (tổng = 1.0).",
            "NMF phân rã không âm V ≈ WH, buộc các thành phần chỉ cộng dồn (additive parts-based), loại bỏ hoàn toàn giá trị âm, giúp từ vựng đặc trưng rõ ràng và dễ diễn giải nhất.",
            "Lưu ý quan trọng: Thứ tự topic giữa các mô hình (ví dụ Chủ đề 1 của LSI so với Chủ đề 1 của NMF) KHÔNG mang ý nghĩa tương đương mặc định, do thuật toán phân cụm không giám sát khởi tạo ngẫu nhiên."
        ]
    }

    return ComparisonResponse(
        document_id=document_id,
        raw_text_preview=raw_text[:280] + ("..." if len(raw_text) > 280 else ""),
        preprocessed=prep,
        lsi=lsi_rep,
        lda=lda_rep,
        nmf=nmf_rep,
        shared_keywords=shared_items,
        unique_to_lsi=unique_lsi,
        unique_to_lda=unique_lda,
        unique_to_nmf=unique_nmf,
        comparative_analysis=comparative_analysis,
        inference_time_ms=times
    )
