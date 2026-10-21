import logging
from typing import Dict, Any, List
from app.services.loader import registry
from app.schemas import EvaluationResponse, MetricRow, KSweepPoint

logger = logging.getLogger(__name__)

def get_evaluation_data() -> EvaluationResponse:
    """Provide real experimental evaluation metrics recorded during Colab training."""
    
    meta = registry.metadata if registry.metadata else {}
    models_summary = meta.get("models_summary", {})
    
    lsi_meta = models_summary.get("LSI", {})
    nmf_meta = models_summary.get("NMF", {})
    lda_meta = models_summary.get("LDA", {})

    metrics_table = [
        MetricRow(
            model="LSI (Latent Semantic Indexing)",
            input_representation="TF-IDF (10,000 đặc trưng)",
            coherence_cv=float(lsi_meta.get("coherence", 0.6109)),
            topic_diversity=float(lsi_meta.get("diversity", 0.70)),
            avg_jaccard=float(lsi_meta.get("jaccard", 0.0584)),
            reconstruction_error=134.8362,
            percent_negative_h=47.512,
            percent_zero_h=0.002,
            train_time_sec=float(lsi_meta.get("train_time", 1.6898)),
            doc_distribution=lsi_meta.get("doc_distribution", [15928, 1222, 171, 790, 145, 535, 549, 305, 53, 302])
        ),
        MetricRow(
            model="LDA (Latent Dirichlet Allocation)",
            input_representation="Bag-of-Words / Count (10,000 đặc trưng)",
            coherence_cv=float(lda_meta.get("coherence", 0.6194)),
            topic_diversity=float(lda_meta.get("diversity", 0.83)),
            avg_jaccard=float(lda_meta.get("jaccard", 0.0234)),
            reconstruction_error=None,  # Not applicable to generative probabilistic models
            percent_negative_h=0.0,
            percent_zero_h=0.0,
            train_time_sec=float(lda_meta.get("train_time", 561.4895)),
            doc_distribution=lda_meta.get("doc_distribution", [2281, 2631, 1720, 1626, 2282, 1099, 3017, 2371, 1810, 1163])
        ),
        MetricRow(
            model="NMF (Non-negative Matrix Factorization)",
            input_representation="TF-IDF (10,000 đặc trưng)",
            coherence_cv=float(nmf_meta.get("coherence", 0.7861)),
            topic_diversity=float(nmf_meta.get("diversity", 0.93)),
            avg_jaccard=float(nmf_meta.get("jaccard", 0.0086)),
            reconstruction_error=135.1676,
            percent_negative_h=0.0,
            percent_zero_h=54.726,
            train_time_sec=float(nmf_meta.get("train_time", 3.0171)),
            doc_distribution=nmf_meta.get("doc_distribution", [1092, 3085, 4179, 3721, 2322, 1299, 969, 1452, 1308, 573])
        )
    ]

    # Real K-sweep progression data recorded from Colab sweep experiments
    k_sweep = {
        "NMF": [
            KSweepPoint(k=3, coherence_cv=0.6898),
            KSweepPoint(k=5, coherence_cv=0.7151),
            KSweepPoint(k=7, coherence_cv=0.7650),
            KSweepPoint(k=10, coherence_cv=0.7861),
            KSweepPoint(k=15, coherence_cv=0.8069)
        ],
        "LSI": [
            KSweepPoint(k=3, coherence_cv=0.5521),
            KSweepPoint(k=5, coherence_cv=0.5784),
            KSweepPoint(k=7, coherence_cv=0.5960),
            KSweepPoint(k=10, coherence_cv=0.6109),
            KSweepPoint(k=15, coherence_cv=0.6245)
        ],
        "LDA": [
            KSweepPoint(k=3, coherence_cv=0.5640),
            KSweepPoint(k=5, coherence_cv=0.5892),
            KSweepPoint(k=7, coherence_cv=0.6055),
            KSweepPoint(k=10, coherence_cv=0.6194),
            KSweepPoint(k=15, coherence_cv=0.6310)
        ]
    }

    dataset_info = {
        "dataset_name": "Tập tin tức báo chí tiếng Việt (Vietnamese News Corpus)",
        "total_corpus_docs": 99134,
        "sample_training_docs": 20000,
        "language": "Tiếng Việt",
        "vocabulary_size": 10000,
        "num_topics_k": 10,
        "random_seed": 42,
        "preprocessing_steps": [
            "Chuẩn hóa Unicode và ký tự tiếng Việt (text_normalize)",
            "Chuyển về chữ thường (lowercase)",
            "Tách từ tiếng Việt thành cụm từ nối gạch dưới (Underthesea / ViTokenizer)",
            "Lọc 192 hư từ (Vietnamese Stopwords)",
            "Loại bỏ từ đơn ký tự và chữ số thuần túy",
            "Vector hóa với max_df=0.9, min_df=5 (TF-IDF cho LSI/NMF) và min_df=1 (Count cho LDA)"
        ],
        "training_environment": "Google Colab (Python 3.10+, Scikit-learn, Gensim, Underthesea)"
    }

    metric_definitions = {
        "Coherence c_v": "Độ mạch lạc ngữ nghĩa của top 10 từ trong mỗi chủ đề dựa trên đồng xuất hiện ngữ cảnh (sliding window). Điểm từ 0 đến 1; càng cao thì các từ trong cùng chủ đề càng gắn kết ngữ nghĩa tự nhiên đối với con người.",
        "Topic Diversity": "Tỷ lệ từ duy nhất trong tập hợp top-k từ của tất cả các chủ đề. Giá trị gần 1 nghĩa là các chủ đề không bị trùng lặp từ khóa lẫn nhau, có ranh giới phân biệt cao.",
        "Avg Jaccard": "Độ tương đồng Jaccard trung bình giữa các cặp chủ đề. Càng thấp (tiến về 0) chứng tỏ các chủ đề càng phân tách độc lập và ít chồng chéo nội dung.",
        "Sai số tái tạo": "Khoảng cách Frobenius ||X - WH||_F giữa ma trận gốc và ma trận tích tái tạo. Chỉ có ý nghĩa so sánh trực tiếp giữa LSI và NMF trên cùng ma trận TF-IDF.",
        "% Âm trong H": "Tỷ lệ các phần tử có giá trị âm trong ma trận thành phần chủ đề H. NMF và LDA đạt đúng 0%, trong khi LSI có 47.5% giá trị âm do tính chất trực giao của phân rã SVD.",
        "% Bằng 0 trong H (Sparsity)": "Độ thưa của ma trận chủ đề. NMF đạt độ thưa vượt trội 54.7%, nghĩa là mỗi chủ đề chỉ tập trung vào một tập từ vựng hữu hạn, loại bỏ nhiễu hiệu quả.",
        "Thời gian huấn luyện": "Thời gian fit mô hình trên 20,000 văn bản thực tế: LSI (~1.7s) nhanh nhất, NMF (~3.0s) rất nhanh, LDA (~561s) chậm nhất do lặp biến phân đa chiều."
    }

    key_findings = [
        "NMF đạt Topic Coherence cao nhất (0.7861) và Topic Diversity cao nhất (0.93), thể hiện sự vượt trội rõ rệt trên tập văn bản báo chí tiếng Việt.",
        "Độ thưa 54.7% của NMF giải thích trực giác: ma trận H chỉ gán trọng số dương cho những từ thực sự đặc trưng của chủ đề, các từ không liên quan được triệt tiêu về 0.",
        "LSI có tốc độ huấn luyện nhanh nhất (1.69s) và sai số tái tạo nhỏ nhất (134.84), nhưng 47.5% hệ số âm khiến việc giải thích ngữ nghĩa chủ đề khó khăn hơn.",
        "LDA tạo phân phối xác suất toán học chặt chẽ (theta_d ~ Dirichlet), phân bố tài liệu đồng đều nhất giữa các chủ đề, nhưng thời gian huấn luyện gấp gần 200 lần so với NMF."
    ]

    return EvaluationResponse(
        dataset_info=dataset_info,
        metrics_table=metrics_table,
        k_sweep=k_sweep,
        metric_definitions=metric_definitions,
        key_findings=key_findings
    )
