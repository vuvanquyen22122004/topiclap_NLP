import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DocumentSummary,
  DocumentDetail,
  AnalysisResponse,
  ComparisonResponse,
  ModelTopicSummary,
  HealthStatus
} from '../types';
import { api } from '../api/client';

export type AreaType = 'overview' | 'document' | 'models' | 'comparison' | 'evaluation' | 'theory';

interface AppContextType {
  activeArea: AreaType;
  setActiveArea: (area: AreaType) => void;
  documents: DocumentSummary[];
  selectedDocument: DocumentDetail | null;
  selectedDocId: number | null;
  selectDocument: (id: number) => Promise<void>;
  analysisResult: AnalysisResponse | null;
  comparisonResult: ComparisonResponse | null;
  isAnalyzing: boolean;
  modelSummaries: Record<string, ModelTopicSummary>;
  backendHealth: HealthStatus | null;
  backendLatencyMs: number;
  isPresentationMode: boolean;
  presentationStep: number;
  togglePresentationMode: () => void;
  setPresentationStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  runAnalysis: (docId?: number, customText?: string) => Promise<void>;
  runComparison: (docId?: number, customText?: string) => Promise<void>;
  resetDemo: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeArea, setActiveArea] = useState<AreaType>('overview');
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentDetail | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [modelSummaries, setModelSummaries] = useState<Record<string, ModelTopicSummary>>({});
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null);
  const [backendLatencyMs, setBackendLatencyMs] = useState<number>(0);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [presentationStep, setPresentationStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const { status, latencyMs } = await api.getHealth();
        setBackendHealth(status);
        setBackendLatencyMs(latencyMs);

        // Load models summary
        const [lsi, lda, nmf] = await Promise.all([
          api.getModel('lsi'),
          api.getModel('lda'),
          api.getModel('nmf')
        ]);
        setModelSummaries({ lsi, lda, nmf });

        // Load sample documents list
        const docs = await api.getDocuments();
        setDocuments(docs);

        // Default select first document for immediate readiness
        if (docs.length > 0) {
          const firstDoc = await api.getDocument(docs[0].id);
          setSelectedDocument(firstDoc);
          setSelectedDocId(firstDoc.id);

          // Pre-run analysis and comparison on default document
          const [anRes, compRes] = await Promise.all([
            api.analyze({ document_id: firstDoc.id }),
            api.compare({ document_id: firstDoc.id })
          ]);
          setAnalysisResult(anRes);
          setComparisonResult(compRes);
        }
      } catch (err: any) {
        console.error('Initialization error:', err);
        setError(err.message || 'Không thể kết nối đến TopicLab Backend');
      }
    }
    init();
  }, []);

  const selectDocument = async (id: number) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const doc = await api.getDocument(id);
      setSelectedDocument(doc);
      setSelectedDocId(id);

      const [anRes, compRes] = await Promise.all([
        api.analyze({ document_id: id }),
        api.compare({ document_id: id })
      ]);
      setAnalysisResult(anRes);
      setComparisonResult(compRes);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải tài liệu');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAnalysis = async (docId?: number, customText?: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const anRes = await api.analyze({ document_id: docId, custom_text: customText });
      setAnalysisResult(anRes);
      const compRes = await api.compare({ document_id: docId, custom_text: customText });
      setComparisonResult(compRes);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi phân tích văn bản');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runComparison = async (docId?: number, customText?: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const compRes = await api.compare({ document_id: docId, custom_text: customText });
      setComparisonResult(compRes);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi so sánh mô hình');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePresentationMode = () => {
    setIsPresentationMode(prev => !prev);
  };

  const nextStep = () => {
    setPresentationStep(prev => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setPresentationStep(prev => Math.max(prev - 1, 0));
  };

  const resetDemo = async () => {
    if (documents.length > 0) {
      await selectDocument(documents[0].id);
    }
    setPresentationStep(0);
    setActiveArea('overview');
  };

  return (
    <AppContext.Provider
      value={{
        activeArea,
        setActiveArea,
        documents,
        selectedDocument,
        selectedDocId,
        selectDocument,
        analysisResult,
        comparisonResult,
        isAnalyzing,
        modelSummaries,
        backendHealth,
        backendLatencyMs,
        isPresentationMode,
        presentationStep,
        togglePresentationMode,
        setPresentationStep,
        nextStep,
        prevStep,
        runAnalysis,
        runComparison,
        resetDemo,
        error,
        clearError: () => setError(null)
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
