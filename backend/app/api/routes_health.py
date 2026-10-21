from fastapi import APIRouter
from app.services.loader import registry
from app.schemas import HealthStatus

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthStatus)
def get_health():
    models_avail = []
    if registry.lsi_model is not None:
        models_avail.append("LSI")
    if registry.lda_model is not None:
        models_avail.append("LDA")
    if registry.nmf_model is not None:
        models_avail.append("NMF")

    return HealthStatus(
        status="healthy" if registry.is_loaded else "degraded",
        version="1.0.0",
        artifacts_loaded=registry.is_loaded,
        models_available=models_avail,
        num_topics=len(registry.model_summaries.get("lsi", {}).topics) if "lsi" in registry.model_summaries else 10,
        sample_docs_count=len(registry.sample_documents),
        warnings=registry.warnings
    )
