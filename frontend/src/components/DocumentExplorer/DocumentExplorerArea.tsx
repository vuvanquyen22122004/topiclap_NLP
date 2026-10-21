import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  FileText, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Hash, 
  Layers, 
  ExternalLink,
  Edit3
} from 'lucide-react';

export const DocumentExplorerArea: React.FC = () => {
  const { 
    documents, 
    selectedDocument, 
    selectDocument, 
    analysisResult, 
    runAnalysis,
    isAnalyzing, 
    setActiveArea 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customText, setCustomText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const categories = ['all', ...Array.from(new Set(documents.map(d => d.category)))];

  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesQuery = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    await runAnalysis(undefined, customText);
  };

  const handleAnalyzeAndCompare = () => {
    setActiveArea('comparison');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Khám Phá Ngữ Liệu Báo Chí Tiếng Việt</h2>
          <p className="text-xs text-slate-500 mt-1">
            Chọn một bài báo thực tế trong tập dữ liệu 20,000 tài liệu hoặc nhập văn bản mới để quan sát các bước tiền xử lý
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors border ${
              isCustomMode
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isCustomMode ? 'Xem tài liệu mẫu' : 'Nhập văn bản tùy biến'}</span>
          </button>

          <button
            onClick={handleAnalyzeAndCompare}
            disabled={!analysisResult}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/20 transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            <span>So sánh 3 mô hình</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Custom Text Form */}
      {isCustomMode && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">Nhập văn bản tiếng Việt mới để kiểm tra suy luận</h3>
            </div>
            <span className="text-[11px] text-slate-400">Tự động chuẩn hóa, tách từ ghép và đối chiếu vocabulary</span>
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Dán hoặc gõ một đoạn văn bản tiếng Việt bất kỳ (ví dụ tin thời sự, giao thông, giáo dục, quân sự...)"
              className="w-full h-32 p-3 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
            ></textarea>

            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-500">
                {customText.trim().split(/\s+/).filter(Boolean).length} từ • {customText.length} ký tự
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setCustomText("Tổng thống Nga Vladimir Putin và Tổng thống Mỹ Donald Trump đã có cuộc gặp thượng đỉnh tại Helsinki bàn về vấn đề Syria và tên lửa Triều Tiên.")}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Dán văn bản mẫu
                </button>
                <button
                  type="submit"
                  disabled={!customText.trim() || isAnalyzing}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <span>{isAnalyzing ? 'Đang phân tích...' : 'Phân tích văn bản này'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: Document List on Left, Document Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Selector Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết theo tiêu đề hoặc từ khóa..."
                className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả danh mục' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Document Cards Scroll List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDocument?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => selectDocument(doc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: #{doc.id}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                    {doc.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {doc.abstract}
                  </p>

                  <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-400">
                    <span>{doc.word_count} từ</span>
                    <span>•</span>
                    <span>{doc.char_count} ký tự</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Document Details & Preprocessing */}
        <div className="lg:col-span-7 space-y-6">
          {analysisResult && (
            <>
              {/* Warnings Box if any */}
              {analysisResult.preprocessed.warnings.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Lưu ý về từ vựng / tiền xử lý của văn bản:</span>
                  </div>
                  <ul className="text-xs text-amber-700 space-y-1 pl-6 list-disc">
                    {analysisResult.preprocessed.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Document Metadata Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        {analysisResult.category || 'Tài liệu thực tế'}
                      </span>
                      {analysisResult.document_id && (
                        <span className="text-xs text-slate-400 font-mono">
                          ID: #{analysisResult.document_id}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {analysisResult.title || 'Văn bản đang chọn'}
                    </h3>
                  </div>

                  <button
                    onClick={handleAnalyzeAndCompare}
                    className="shrink-0 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <span>Xem so sánh</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Preprocessing Statistics Gauges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <div className="text-lg font-extrabold text-slate-800">
                      {analysisResult.preprocessed.total_tokens}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Tổng số từ gốc</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <div className="text-lg font-extrabold text-blue-600">
                      {analysisResult.preprocessed.valid_tokens_count}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Token hợp lệ</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <div className="text-lg font-extrabold text-slate-600">
                      {analysisResult.preprocessed.stopwords_removed_count}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Stopwords đã lọc</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <div className="text-lg font-extrabold text-emerald-600">
                      {Math.round(analysisResult.preprocessed.vocab_overlap_ratio_tfidf * 100)}%
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Khớp từ vựng 10k</div>
                  </div>
                </div>
              </div>

              {/* Preprocessed Tokens View */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Chuỗi Token Sau Tiền Xử Lý (Underthesea / ViTokenizer)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Từ ghép tiếng Việt được nối gạch dưới ( _ )
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {analysisResult.preprocessed.tokens.map((token, idx) => {
                    const isInVocab = analysisResult.preprocessed.matched_words_tfidf.includes(token);
                    return (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-0.5 rounded-md font-mono transition-colors ${
                          isInVocab
                            ? 'bg-blue-100 text-blue-800 border border-blue-200 font-medium'
                            : 'bg-slate-200 text-slate-600 border border-slate-300'
                        }`}
                        title={isInVocab ? 'Từ vựng nằm trong 10,000 từ đã huấn luyện' : 'Từ ngoài từ vựng (OOV)'}
                      >
                        {token}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Full Raw Document View */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Nội Dung Văn Bản Gốc</span>
                  </h4>
                </div>

                <div className="max-h-64 overflow-y-auto p-4 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                  {analysisResult.raw_text}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
