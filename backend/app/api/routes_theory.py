from fastapi import APIRouter, HTTPException
from typing import Dict
from app.services.theory import get_theory_data
from app.schemas import TheorySection

router = APIRouter(prefix="/theory", tags=["Theory"])

@router.get("", response_model=Dict[str, TheorySection])
def get_all_theory():
    """Retrieve full educational and theoretical breakdown for LSI, LDA, and NMF."""
    return get_theory_data()

@router.get("/{model_id}", response_model=TheorySection)
def get_model_theory(model_id: str):
    data = get_theory_data()
    mid = model_id.lower()
    if mid not in data:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy lý thuyết cho mô hình '{model_id}'")
    return data[mid]
