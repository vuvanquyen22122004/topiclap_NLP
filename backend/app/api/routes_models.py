from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.loader import registry
from app.schemas import ModelTopicSummary, TopicInfo

router = APIRouter(prefix="/models", tags=["Models"])

@router.get("", response_model=List[Dict[str, Any]])
def list_models():
    """List all available topic models and their core properties."""
    return [
        {
            "model_id": "lsi",
            "name": "LSI",
            "full_name": "Latent Semantic Indexing",
            "algorithm": "TruncatedSVD (Singular Value Decomposition)",
            "input_representation": "TF-IDF (10,000 đặc trưng)",
            "color": "#2563eb",
            "badge_color": "bg-blue-100 text-blue-800 border-blue-300",
            "num_topics": len(registry.model_summaries["lsi"].topics) if "lsi" in registry.model_summaries else 10,
            "weight_type": "Tọa độ không gian ngữ nghĩa (+/-)",
            "description": "Chiếu ma trận TF-IDF vào không gian con trực giao k chiều thông qua phân rã giá trị kỳ dị (SVD). Giảm chiều và gom cụm từ đồng nghĩa xuất sắc."
        },
        {
            "model_id": "lda",
            "name": "LDA",
            "full_name": "Latent Dirichlet Allocation",
            "algorithm": "Variational Bayes / Gibbs Sampling",
            "input_representation": "Bag-of-Words / CountVectorizer (10,000 đặc trưng)",
            "color": "#16a34a",
            "badge_color": "bg-green-100 text-green-800 border-green-300",
            "num_topics": len(registry.model_summaries["lda"].topics) if "lda" in registry.model_summaries else 10,
            "weight_type": "Phân phối xác suất (Sum = 1.0)",
            "description": "Mô hình sinh xác suất theo tiên nghiệm Dirichlet ba cấp độ: từ vựng, tài liệu và toàn bộ kho ngữ liệu. Mỗi bài báo là tổ hợp xác suất của nhiều chủ đề."
        },
        {
            "model_id": "nmf",
            "name": "NMF",
            "full_name": "Non-negative Matrix Factorization",
            "algorithm": "Coordinate Descent with NNDSVDa initialization",
            "input_representation": "TF-IDF (10,000 đặc trưng)",
            "color": "#ea580c",
            "badge_color": "bg-orange-100 text-orange-800 border-orange-300",
            "num_topics": len(registry.model_summaries["nmf"].topics) if "nmf" in registry.model_summaries else 10,
            "weight_type": "Trọng số phân rã không âm (W ≥ 0)",
            "description": "Phân rã xấp xỉ ma trận TF-IDF V ≈ WH với ràng buộc phi âm nghiêm ngặt. Tạo ra biểu diễn bộ phận (parts-based) với độ thưa cao, từ khóa sắc nét và độ mạch lạc cao nhất."
        }
    ]

@router.get("/{model_id}", response_model=ModelTopicSummary)
def get_model_summary(model_id: str):
    mid = model_id.lower()
    if mid not in registry.model_summaries:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy mô hình '{model_id}'. Các mô hình hợp lệ: lsi, lda, nmf")
    return registry.model_summaries[mid]

@router.get("/{model_id}/topics/{topic_id}", response_model=TopicInfo)
def get_model_topic(model_id: str, topic_id: int):
    mid = model_id.lower()
    if mid not in registry.model_summaries:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy mô hình '{model_id}'")
    
    summary = registry.model_summaries[mid]
    for t in summary.topics:
        if t.topic_id == topic_id:
            return t
            
    raise HTTPException(status_code=404, detail=f"Không tìm thấy chủ đề {topic_id} trong mô hình {model_id}")
