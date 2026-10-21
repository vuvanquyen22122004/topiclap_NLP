from fastapi import APIRouter
from app.services.evaluator import get_evaluation_data
from app.schemas import EvaluationResponse

router = APIRouter(prefix="/evaluation", tags=["Evaluation"])

@router.get("", response_model=EvaluationResponse)
def get_evaluation():
    """Retrieve experimental evaluation results, metric tables, and K-sweep curves."""
    return get_evaluation_data()
