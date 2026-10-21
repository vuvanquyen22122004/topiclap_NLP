import {
  HealthStatus,
  DocumentSummary,
  DocumentDetail,
  ModelTopicSummary,
  AnalysisResponse,
  ComparisonResponse,
  EvaluationResponse,
  TheorySection
} from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || `Lỗi máy chủ (${res.status})`);
  }
  return res.json();
}

export const api = {
  async getHealth(): Promise<{ status: HealthStatus; latencyMs: number }> {
    const t0 = performance.now();
    const res = await fetch(`${API_BASE}/health`);
    const status = await handleResponse<HealthStatus>(res);
    const latencyMs = Math.round(performance.now() - t0);
    return { status, latencyMs };
  },

  async getDocuments(category?: string, q?: string): Promise<DocumentSummary[]> {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    const url = `${API_BASE}/documents${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse<DocumentSummary[]>(res);
  },

  async getCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/documents/categories`);
    return handleResponse<string[]>(res);
  },

  async getDocument(id: number): Promise<DocumentDetail> {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    return handleResponse<DocumentDetail>(res);
  },

  async getModels(): Promise<Array<{
    model_id: string;
    name: string;
    full_name: string;
    algorithm: string;
    input_representation: string;
    color: string;
    badge_color: string;
    num_topics: number;
    weight_type: string;
    description: string;
  }>> {
    const res = await fetch(`${API_BASE}/models`);
    return handleResponse(res);
  },

  async getModel(modelId: string): Promise<ModelTopicSummary> {
    const res = await fetch(`${API_BASE}/models/${modelId}`);
    return handleResponse<ModelTopicSummary>(res);
  },

  async analyze(params: { document_id?: number; custom_text?: string }): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async compare(params: { document_id?: number; custom_text?: string }): Promise<ComparisonResponse> {
    const res = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return handleResponse<ComparisonResponse>(res);
  },

  async getEvaluation(): Promise<EvaluationResponse> {
    const res = await fetch(`${API_BASE}/evaluation`);
    return handleResponse<EvaluationResponse>(res);
  },

  async getTheory(): Promise<Record<string, TheorySection>> {
    const res = await fetch(`${API_BASE}/theory`);
    return handleResponse<Record<string, TheorySection>>(res);
  }
};
