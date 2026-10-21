import logging
import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from app.config import CORS_ORIGINS
from app.services.loader import registry
from app.api.routes_health import router as health_router
from app.api.routes_documents import router as documents_router
from app.api.routes_models import router as models_router
from app.api.routes_analyze import router as analyze_router
from app.api.routes_compare import router as compare_router
from app.api.routes_evaluation import router as eval_router
from app.api.routes_theory import router as theory_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("topiclab")

DIST_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("TopicLab Backend starting up: Loading ML models and artifacts...")
    registry.load_all()
    logger.info("All artifacts loaded successfully. Server ready for requests.")
    yield
    logger.info("TopicLab Backend shutting down.")

app = FastAPI(
    title="TopicLab API — Interactive Topic Modeling Explorer",
    description="Backend API for scientific exploration and comparison of LSI, LDA, and NMF algorithms.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Lỗi máy chủ nội bộ", "detail": str(exc)}
    )

# Include API routes under /api
app.include_router(health_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(models_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(compare_router, prefix="/api")
app.include_router(eval_router, prefix="/api")
app.include_router(theory_router, prefix="/api")

# Serve frontend build if dist exists
if DIST_DIR.exists() and (DIST_DIR / "index.html").exists():
    logger.info(f"Mounting static frontend from {DIST_DIR}")
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = DIST_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(DIST_DIR / "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "platform": "TopicLab — Interactive Topic Modeling Explorer",
            "algorithms": ["LSI (Latent Semantic Indexing)", "LDA (Latent Dirichlet Allocation)", "NMF (Non-negative Matrix Factorization)"],
            "docs_url": "/docs",
            "health_url": "/api/health"
        }
