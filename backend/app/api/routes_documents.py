from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.loader import registry
from app.schemas import DocumentSummary, DocumentDetail

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("", response_model=List[DocumentSummary])
def get_documents(
    category: Optional[str] = Query(None, description="Lọc theo danh mục chủ đề"),
    q: Optional[str] = Query(None, description="Tìm kiếm từ khóa trong tiêu đề/nội dung")
):
    docs = registry.sample_documents
    if category:
        docs = [d for d in docs if d.get("category", "").lower() == category.lower()]
    if q:
        query = q.lower()
        docs = [
            d for d in docs 
            if query in d.get("title", "").lower() or query in d.get("content", "").lower()
        ]
    
    return [
        DocumentSummary(
            id=d["id"],
            title=d["title"],
            category=d["category"],
            abstract=d["abstract"],
            char_count=d["char_count"],
            word_count=d["word_count"]
        )
        for d in docs
    ]

@router.get("/categories", response_model=List[str])
def get_categories():
    cats = list(dict.fromkeys(d.get("category", "") for d in registry.sample_documents if d.get("category")))
    return cats

@router.get("/{doc_id}", response_model=DocumentDetail)
def get_document_by_id(doc_id: int):
    for d in registry.sample_documents:
        if d["id"] == doc_id:
            return DocumentDetail(
                id=d["id"],
                title=d["title"],
                category=d["category"],
                abstract=d["abstract"],
                content=d["content"],
                char_count=d["char_count"],
                word_count=d["word_count"]
            )
    raise HTTPException(status_code=404, detail=f"Không tìm thấy tài liệu có ID {doc_id}")
