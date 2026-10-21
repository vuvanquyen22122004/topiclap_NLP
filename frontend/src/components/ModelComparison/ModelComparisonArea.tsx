import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';
import {
  Columns3,
  BarChart2,
  Table as TableIcon,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  RotateCcw,
  Tag,
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export const ModelComparisonArea: React.FC = () => {
  const { 
    comparisonResult, 
    documents, 
    selectedDocId, 
    selectDocument, 
    isAnalyzing,
    resetDemo
  } = useApp();

  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [filterSharedWord, setFilterSharedWord] = useState<string | null>(null);

  if (!comparisonResult) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold">Đang chuẩn bị dữ liệu so sánh 3 mô hình...</p>
      </div>
    );
  }

  const { lsi, lda, nmf, shared_keywords, unique_to_lsi, unique_to_lda, unique_to_nmf, comparative_analysis, inference_time_ms } = comparisonResult;

  // Top words for dominant topics
  const lsiTopWords = lsi.top_topics[0]?.top_words || [];
  const ldaTopWords = lda.top_topics[0]?.top_words || [];
  const nmfTopWords = nmf.top_topics[0]?.top_words || [];

  // Prepare chart data for top 8 words of dominant topic for each model
  const lsiChartData = lsiTopWords.slice(0, 8).map(w => ({ word: w.replace('_', ' '), val: 0.15 }));
  const ldaChartData = ldaTopWords.slice(0, 8).map(w => ({ word: w.replace('_', ' '), val: 12.5 }));
  const nmfChartData = nmfTopWords.slice(0, 8).map(w => ({ word: w.replace('_', ' '), val: 0.75 }));

  // Filtered shared keywords
  const displaySharedWords = filterSharedWord
    ? shared_keywords.filter(w => w.word.toLowerCase().includes(filterSharedWord.toLowerCase()))
    : shared_keywords;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Document Selection Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Khu Vực So Sánh Trực Diện
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                LSI | LDA | NMF Trên Cùng Một Tài Liệu
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Chọn tài liệu để cập nhật kết quả suy luận của cả 3 mô hình cùng lúc. Quan sát sự tương đồng và khác biệt về từ khóa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('chart')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === 'chart'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Biểu đồ</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Bảng dữ liệu</span>
              </button>
            </div>

            {/* Document Switcher Dropdown */}
            <select
              value={selectedDocId || ''}
              onChange={(e) => selectDocument(Number(e.target.value))}
              disabled={isAnalyzing}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 max-w-xs"
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>
                  [{d.category}] #{d.id}: {d.title.slice(0, 45)}...
                </option>
              ))}
            </select>

            <button
              onClick={resetDemo}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
              title="Khôi phục trạng thái ban đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Inference Latency Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Thời gian suy luận thực tế (Inference Latency):</span>
          </div>
          <div className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 font-mono font-bold border border-blue-200">
            LSI: {inference_time_ms.LSI} ms
          </div>
          <div className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200">
            LDA: {inference_time_ms.LDA} ms
          </div>
          <div className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-mono font-bold border border-amber-200">
            NMF: {inference_time_ms.NMF} ms
          </div>
          <div className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px]">
            Tổng: {inference_time_ms.Total} ms
          </div>
        </div>
      </div>

      {/* Tri-Column Comparison View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: LSI */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  LSI (TruncatedSVD)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Latent Semantic Indexing</h3>
              </div>
              <span className="text-[11px] font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                TF-IDF
              </span>
            </div>

            {/* Dominant Topic */}
            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 space-y-1">
              <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wide">
                Thành phần chủ đạo
              </div>
              <div className="font-extrabold text-sm text-blue-900">
                {lsi.dominant_topic_name}
              </div>
              <div className="text-xs text-blue-700 flex justify-between pt-1">
                <span>Tọa độ SVD có dấu:</span>
                <span className="font-mono font-bold">{lsi.dominant_weight > 0 ? `+${lsi.dominant_weight}` : lsi.dominant_weight}</span>
              </div>
            </div>

            {/* Top Words Display */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Top từ khóa trong thành phần:</span>
                <span className="text-[10px] text-slate-400">Trục ngữ nghĩa tiềm ẩn</span>
              </div>

              {viewMode === 'chart' ? (
                <div className="space-y-1.5">
                  {lsiTopWords.map((word, idx) => {
                    const isCommon = shared_keywords.some(s => s.word === word && s.occurrence_count >= 2);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isCommon
                            ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400 font-mono w-4">{idx + 1}.</span>
                          <span className="font-mono">{word}</span>
                        </div>
                        {isCommon && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-200 text-blue-800">
                            Chung
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 space-y-1 border border-slate-200">
                  {lsiTopWords.join(', ')}
                </div>
              )}
            </div>

            {/* Document Vector Chart */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>10 Tọa độ SVD tài liệu:</span>
                <span className="text-[10px] text-slate-400">Có dấu (+/-)</span>
              </div>
              <div className="h-28 w-full bg-slate-50 rounded-xl p-2 border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lsi.raw_weights.map((v, i) => ({ name: `C${i+1}`, val: v }))}>
                    <ReferenceLine y={0} stroke="#94a3b8" />
                    <Bar dataKey="val" fill="#2563eb" radius={[2, 2, 0, 0]}>
                      {lsi.raw_weights.map((_, i) => (
                        <Cell key={`cell-lsi-${i}`} fill={i + 1 === lsi.dominant_topic ? '#1d4ed8' : '#93c5fd'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-blue-800 bg-blue-50 p-2.5 rounded-lg border border-blue-200 leading-snug">
            <strong>Bản chất:</strong> Đại số tuyến tính thuần túy. Cho phép hệ số âm để triệt tiêu trực giao.
          </div>
        </div>

        {/* Column 2: LDA */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  LDA (Bayesian)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Latent Dirichlet Allocation</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Count (BoW)
              </span>
            </div>

            {/* Dominant Topic */}
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 space-y-1">
              <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                Chủ đề chiếm ưu thế
              </div>
              <div className="font-extrabold text-sm text-emerald-900">
                {lda.dominant_topic_name}
              </div>
              <div className="text-xs text-emerald-700 flex justify-between pt-1">
                <span>Xác suất chủ đề (Probability):</span>
                <span className="font-mono font-bold">{(lda.dominant_weight * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Top Words Display */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Top từ khóa trong chủ đề:</span>
                <span className="text-[10px] text-slate-400">Xác suất Dirichlet</span>
              </div>

              {viewMode === 'chart' ? (
                <div className="space-y-1.5">
                  {ldaTopWords.map((word, idx) => {
                    const isCommon = shared_keywords.some(s => s.word === word && s.occurrence_count >= 2);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isCommon
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400 font-mono w-4">{idx + 1}.</span>
                          <span className="font-mono">{word}</span>
                        </div>
                        {isCommon && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800">
                            Chung
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 space-y-1 border border-slate-200">
                  {ldaTopWords.join(', ')}
                </div>
              )}
            </div>

            {/* Document Vector Chart */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Phân phối xác suất 10 chủ đề:</span>
                <span className="text-[10px] text-slate-400">Tổng = 100%</span>
              </div>
              <div className="h-28 w-full bg-slate-50 rounded-xl p-2 border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lda.raw_weights.map((v, i) => ({ name: `C${i+1}`, val: Number((v*100).toFixed(1)) }))}>
                    <Bar dataKey="val" fill="#16a34a" radius={[2, 2, 0, 0]}>
                      {lda.raw_weights.map((_, i) => (
                        <Cell key={`cell-lda-${i}`} fill={i + 1 === lda.dominant_topic ? '#15803d' : '#86efac'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 leading-snug">
            <strong>Bản chất:</strong> Mô hình sinh xác suất Bayes. Phân bổ cân bằng, giải thích xác suất tự nhiên.
          </div>
        </div>

        {/* Column 3: NMF */}
        <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  NMF (Non-negative)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Matrix Factorization</h3>
              </div>
              <span className="text-[11px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                TF-IDF
              </span>
            </div>

            {/* Dominant Topic */}
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-100 space-y-1">
              <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                Chủ đề chiếm ưu thế
              </div>
              <div className="font-extrabold text-sm text-amber-900">
                {nmf.dominant_topic_name}
              </div>
              <div className="text-xs text-amber-700 flex justify-between pt-1">
                <span>Tỷ trọng W chuẩn hóa:</span>
                <span className="font-mono font-bold">{(nmf.display_weights[nmf.dominant_topic - 1] * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Top Words Display */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Top từ khóa trong chủ đề:</span>
                <span className="text-[10px] text-slate-400">Không âm (W, H ≥ 0)</span>
              </div>

              {viewMode === 'chart' ? (
                <div className="space-y-1.5">
                  {nmfTopWords.map((word, idx) => {
                    const isCommon = shared_keywords.some(s => s.word === word && s.occurrence_count >= 2);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isCommon
                            ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400 font-mono w-4">{idx + 1}.</span>
                          <span className="font-mono">{word}</span>
                        </div>
                        {isCommon && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-800">
                            Chung
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 space-y-1 border border-slate-200">
                  {nmfTopWords.join(', ')}
                </div>
              )}
            </div>

            {/* Document Vector Chart */}
            <div className="pt-2">
              <div className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>10 Trọng số W chuẩn hóa:</span>
                <span className="text-[10px] text-slate-400">Thưa (Sparsity 54%)</span>
              </div>
              <div className="h-28 w-full bg-slate-50 rounded-xl p-2 border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={nmf.display_weights.map((v, i) => ({ name: `C${i+1}`, val: Number((v*100).toFixed(1)) }))}>
                    <Bar dataKey="val" fill="#ea580c" radius={[2, 2, 0, 0]}>
                      {nmf.display_weights.map((_, i) => (
                        <Cell key={`cell-nmf-${i}`} fill={i + 1 === nmf.dominant_topic ? '#c2410c' : '#fdba74'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 leading-snug">
            <strong>Bản chất:</strong> Biểu diễn từng phần không âm. Đạt Topic Coherence cao nhất (0.7861).
          </div>
        </div>
      </div>

      {/* Shared and Distinct Keywords Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">
              Phân Tích Đối Chiếu Từ Khóa Chung & Riêng (Keyword Intersection Matrix)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logic tự động tính toán từ tập từ khóa thực tế của cả 3 mô hình khi phân tích cùng văn bản.
          </p>
        </div>

        {/* Level of Consensus Indicator */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">Mức độ đồng thuận giữa 3 thuật toán:</div>
            <div className="text-sm font-extrabold text-slate-800 flex items-center space-x-2 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{comparative_analysis.degree_of_consensus}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="font-medium text-slate-500">Từ khóa chung xuất hiện trong cả 3 mô hình:</span>
            <span className="font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
              {comparative_analysis.words_in_all_three.length} từ
            </span>
          </div>
        </div>

        {/* Common Words Tags */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700">
            Từ khóa xuất hiện đồng thời trong 2 hoặc cả 3 mô hình:
          </div>

          <div className="flex flex-wrap gap-2">
            {displaySharedWords.map((item, idx) => {
              const inAll = item.occurrence_count === 3;
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                    inAll
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-2xs'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{item.word}</span>
                  <div className="flex space-x-1 shrink-0">
                    <span className={`w-2 h-2 rounded-full ${item.in_lsi ? 'bg-blue-500' : 'bg-slate-300'}`} title="LSI" />
                    <span className={`w-2 h-2 rounded-full ${item.in_lda ? 'bg-emerald-500' : 'bg-slate-300'}`} title="LDA" />
                    <span className={`w-2 h-2 rounded-full ${item.in_nmf ? 'bg-amber-500' : 'bg-slate-300'}`} title="NMF" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distinct Keywords per model */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
            <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
              <span>Đặc trưng riêng LSI:</span>
              <span className="text-[10px] text-blue-700 font-mono">{unique_to_lsi.length} từ</span>
            </div>
            <div className="text-xs text-blue-800 font-mono flex flex-wrap gap-1">
              {unique_to_lsi.slice(0, 6).map((w, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-blue-100/60 rounded">{w}</span>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
            <div className="text-xs font-bold text-emerald-900 flex items-center justify-between">
              <span>Đặc trưng riêng LDA:</span>
              <span className="text-[10px] text-emerald-700 font-mono">{unique_to_lda.length} từ</span>
            </div>
            <div className="text-xs text-emerald-800 font-mono flex flex-wrap gap-1">
              {unique_to_lda.slice(0, 6).map((w, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-emerald-100/60 rounded">{w}</span>
              ))}
            </div>
          </div>

          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-2">
            <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
              <span>Đặc trưng riêng NMF:</span>
              <span className="text-[10px] text-amber-700 font-mono">{unique_to_nmf.length} từ</span>
            </div>
            <div className="text-xs text-amber-800 font-mono flex flex-wrap gap-1">
              {unique_to_nmf.slice(0, 6).map((w, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-amber-100/60 rounded">{w}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Scientific Disclaimers */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
          <div className="font-bold text-slate-800 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Nguyên tắc so sánh khoa học:</span>
          </div>
          <ul className="space-y-1 pl-5 list-disc text-slate-600">
            {comparative_analysis.scientific_notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
