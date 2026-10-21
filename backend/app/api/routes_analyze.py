from fastapi import APIRouter, HTTPException
from typing import Optional
from app.services.loader import registry
from app.services.inference import analyze_document_content
from app.schemas import AnalysisRequest, AnalysisResponse

router = APIRouter(prefix="/analyze", tags=["Analysis"])

@router.post("", response_model=AnalysisResponse)
def analyze_document(request: AnalysisRequest):
    """Analyze a document or custom text across all three topic models."""
    target_text = ""
    title = None
    category = None
    doc_id = request.document_id

    if request.document_id is not None:
        found = False
        for d in registry.sample_documents:
            if d["id"] == request.document_id:
                target_text = d["content"]
                title = d["title"]
                category = d["category"]
                found = True
                break
        if not found:
            raise HTTPException(status_code=404, detail=f"Không tìm thấy tài liệu mẫu với ID {request.document_id}")
    elif request.custom_text is not None and request.custom_text.strip():
        target_text = request.custom_text.strip()
        title = "Văn bản tùy biến người dùng"
        category = "Tùy biến"
    else:
        raise HTTPException(status_code=400, detail="Vui lòng cung cấp 'document_id' hoặc 'custom_text'.")

    result = analyze_document_content(target_text)

    return AnalysisResponse(
        document_id=doc_id,
        title=title,
        category=category,
        raw_text=result["raw_text"],
        preprocessed=result["preprocessed"],
        lsi=result["lsi"],
        lda=result["lda"],
        nmf=result["nmf"],
        inference_time_ms=result["inference_time_ms"]
    )
