import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Tv, 
  Activity, 
  RotateCcw, 
  Layers,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeArea, 
    backendHealth, 
    backendLatencyMs, 
    isPresentationMode, 
    togglePresentationMode,
    selectedDocument,
    resetDemo
  } = useApp();

  const areaTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: "Tổng quan nền tảng", subtitle: "Giới thiệu TopicLab & Kiến trúc mô hình" },
    document: { title: "Khám phá tài liệu", subtitle: "Dữ liệu mẫu & Tiền xử lý văn bản tiếng Việt" },
    models: { title: "Khám phá từng mô hình", subtitle: "Phân tích chuyên sâu LSI, LDA và NMF" },
    comparison: { title: "So sánh trực tiếp 3 mô hình", subtitle: "Phòng thí nghiệm đối đầu trực diện LSI | LDA | NMF" },
    evaluation: { title: "Đánh giá thực nghiệm", subtitle: "Topic Coherence, Diversity, Runtime & Sai số tái tạo" },
    theory: { title: "Góc lý thuyết học thuật", subtitle: "Công thức toán học, Sơ đồ luồng & Bài kiểm tra hiểu bài" },
  };

  const current = areaTitles[activeArea] || { title: "TopicLab", subtitle: "Topic Modeling Platform" };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center space-x-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">{current.title}</h1>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">
              v1.0 Academic
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal">{current.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {selectedDocument && (
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600 max-w-xs truncate">
            <FileCheck2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-medium text-slate-500">Tài liệu:</span>
            <span className="font-semibold text-slate-700 truncate">{selectedDocument.title}</span>
          </div>
        )}

        {/* Backend Status Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold">Backend Sẵn sàng</span>
          <span className="text-emerald-600/80 text-[10px]">({backendLatencyMs}ms)</span>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={resetDemo}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          title="Khôi phục trạng thái ban đầu"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Khôi phục demo</span>
        </button>

        {/* Presentation Mode Toggle */}
        <button
          onClick={togglePresentationMode}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ${
            isPresentationMode
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>{isPresentationMode ? 'Thoát thuyết trình' : 'Chế độ Thuyết trình'}</span>
        </button>
      </div>
    </header>
  );
};
