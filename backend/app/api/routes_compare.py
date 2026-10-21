from fastapi import APIRouter, HTTPException
from typing import Optional
from app.services.loader import registry
from app.services.comparator import compare_document_across_models
from app.schemas import AnalysisRequest, ComparisonResponse

router = APIRouter(prefix="/compare", tags=["Comparison"])

@router.post("", response_model=ComparisonResponse)
def compare_models(request: AnalysisRequest):
    """Direct comparative analysis of LSI, LDA, and NMF on the same text."""
    target_text = ""
    doc_id = request.document_id

    if request.document_id is not None:
        found = False
        for d in registry.sample_documents:
            if d["id"] == request.document_id:
                target_text = d["content"]
                found = True
                break
        if not found:
            raise HTTPException(status_code=404, detail=f"Không tìm thấy tài liệu mẫu với ID {request.document_id}")
    elif request.custom_text is not None and request.custom_text.strip():
        target_text = request.custom_text.strip()
    else:
        # Default to first sample document if nothing specified
        if registry.sample_documents:
            target_text = registry.sample_documents[0]["content"]
            doc_id = registry.sample_documents[0]["id"]
        else:
            raise HTTPException(status_code=400, detail="Không có tài liệu để so sánh.")

    return compare_document_across_models(target_text, document_id=doc_id)
