import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MathFormula } from '../MathFormula';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  X
} from 'lucide-react';

export const PresentationModeView: React.FC = () => {
  const {
    presentationStep,
    setPresentationStep,
    nextStep,
    prevStep,
    togglePresentationMode,
    comparisonResult,
    selectedDocument,
    modelSummaries,
    resetDemo
  } = useApp();

  // Keyboard navigation listener (ArrowRight / ArrowLeft / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'Escape') {
        togglePresentationMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep, togglePresentationMode]);

  const steps = [
    { id: 0, title: "1. Đặt vấn đề & Giới thiệu Topic Modeling" },
    { id: 1, title: "2. Dữ liệu thực nghiệm & Tiền xử lý" },
    { id: 2, title: "3. Mô hình LSI (Latent Semantic Indexing)" },
    { id: 3, title: "4. Mô hình LDA (Latent Dirichlet Allocation)" },
    { id: 4, title: "5. Mô hình NMF (Non-negative Matrix Factorization)" },
    { id: 5, title: "6. So sánh đối đầu trực diện 3 mô hình" },
    { id: 6, title: "7. Đánh giá định lượng & Topic Coherence" },
    { id: 7, title: "8. Kết luận & Khuyến nghị giải pháp" },
  ];

  const lsi = comparisonResult?.lsi;
  const lda = comparisonResult?.lda;
  const nmf = comparisonResult?.nmf;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Presentation Top Bar */}
      <div className="h-16 px-8 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-md text-base">
            TL
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2.5">
              TopicLab Presentation
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-bold">
                Bước {presentationStep + 1} / 8
              </span>
            </h1>
            <div className="text-xs text-slate-400">
              Dùng phím mũi tên [ ← ] và [ → ] hoặc thanh điều khiển bên dưới
            </div>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="hidden lg:flex items-center space-x-2">
          {steps.map((st) => (
            <button
              key={st.id}
              onClick={() => setPresentationStep(st.id)}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                st.id === presentationStep
                  ? 'bg-indigo-400 w-9'
                  : st.id < presentationStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-700 hover:bg-slate-500'
              }`}
              title={st.title}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={resetDemo}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset demo</span>
          </button>

          <button
            onClick={togglePresentationMode}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 transition-all shadow-xs"
          >
            <X className="w-4 h-4" />
            <span>Thoát (Esc)</span>
          </button>
        </div>
      </div>

      {/* Main Slide Content Area (High contrast, Projector-optimized) */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto">
          {/* SLIDE 0: Introduction */}
          {presentationStep === 0 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                  Phần 1: Giới thiệu đề tài
                </span>
                <h2 className="text-4xl font-black text-white leading-tight">
                  Nghiên Cứu & So Sánh Ba Thuật Toán Topic Modeling: <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400">
                    LSI vs LDA vs NMF
                  </span>
                </h2>
                <p className="text-xl text-slate-300 leading-relaxed max-w-4xl">
                  Topic Modeling là kỹ thuật trích xuất chủ đề tiềm ẩn không giám sát từ tập văn bản lớn. 
                  Bài thuyết trình này đặt ba mô hình lên cùng một bàn cân thực nghiệm trên 20,000 bài báo tiếng Việt.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-6 rounded-2xl bg-slate-900 border-2 border-blue-500/50 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-blue-400">LSI (SVD)</div>
                  <div className="text-xl font-bold text-white">Đại số tuyến tính</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Phân rã ma trận TF-IDF thành các trục trực giao tiềm ẩn. Tối ưu sai số Frobenius nhưng có tới 47.5% hệ số âm.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-emerald-400">LDA (Dirichlet)</div>
                  <div className="text-xl font-bold text-white">Mô hình xác suất Bayes</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Mỗi tài liệu là hỗn hợp Dirichlet của các chủ đề. Đầu ra là phân phối xác suất hợp thức (tổng = 1.0).
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border-2 border-amber-500/50 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-amber-400">NMF (Non-negative)</div>
                  <div className="text-xl font-bold text-white">Phân rã không âm</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Ràng buộc W, H ≥ 0 triệt tiêu hoàn toàn nhiễu âm. Đạt Topic Coherence 0.7861 cao nhất thực nghiệm.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-400 flex items-center justify-between">
                <span>Nhấn nút <strong className="text-white">Tiếp theo</strong> để quan sát dữ liệu thực nghiệm</span>
                <span className="text-xs font-mono text-indigo-400">TopicLab v1.0 Academic</span>
              </div>
            </div>
          )}

          {/* SLIDE 1: Dataset & Preprocessing */}
          {presentationStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                  Phần 2: Dữ liệu & Tiền xử lý
                </span>
                <h2 className="text-3xl font-extrabold text-white">
                  Tập Ngữ Liệu Báo Chí Tiếng Việt & Pipeline Tiền Xử Lý
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-3xl font-black text-indigo-400">20,000</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Bài báo huấn luyện</div>
                </div>
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-3xl font-black text-indigo-400">10,000</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Từ vựng Vocabulary</div>
                </div>
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-3xl font-black text-indigo-400">10</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Số lượng chủ đề (k)</div>
                </div>
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-3xl font-black text-emerald-400">192</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Stopwords tiếng Việt</div>
                </div>
              </div>

              {selectedDocument && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">Bài viết thực nghiệm mẫu:</span>
                    <span className="font-mono text-indigo-400">ID: #{selectedDocument.id} • {selectedDocument.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-300">{selectedDocument.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed italic line-clamp-3">
                    "{selectedDocument.abstract}"
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 leading-relaxed">
                <strong>Điểm then chốt:</strong> Tiếng Việt là ngôn ngữ đơn lập, các từ ghép như <code className="bg-blue-900 px-1 py-0.5 rounded text-white">tổng_thống</code>, <code className="bg-blue-900 px-1 py-0.5 rounded text-white">triều_tiên</code>, <code className="bg-blue-900 px-1 py-0.5 rounded text-white">công_an</code> bắt buộc phải được tách từ bằng Underthesea để tạo token chính xác cho vectorizer.
              </div>
            </div>
          )}

          {/* SLIDE 2: LSI Observation */}
          {presentationStep === 2 && lsi && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800">
                  Phần 3: Thuật toán 1
                </span>
                <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                  <span className="text-blue-400">LSI:</span> Latent Semantic Indexing qua Truncated SVD
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-blue-900/60 space-y-4">
                  <div className="text-sm font-bold text-blue-300 uppercase tracking-wide">
                    Kết quả nhận diện tài liệu:
                  </div>
                  <div className="text-2xl font-black text-white">{lsi.dominant_topic_name}</div>
                  <div className="text-sm text-slate-300">
                    Tọa độ SVD lớn nhất: <span className="font-mono font-bold text-blue-400">{lsi.dominant_weight > 0 ? `+${lsi.dominant_weight}` : lsi.dominant_weight}</span>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-400 mb-2">Top từ vựng trên trục ngữ nghĩa:</div>
                    <div className="flex flex-wrap gap-2">
                      {lsi.top_topics[0]?.top_words.map((w, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-800 text-blue-200 text-xs font-mono font-semibold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-bold text-white mb-2">Đặc tính kỹ thuật cốt lõi:</div>
                    <ul className="text-sm text-slate-300 space-y-2 pl-5 list-disc leading-relaxed">
                      <li>Công thức: <MathFormula math="A \approx U_k \Sigma_k V_k^T" className="text-blue-300 font-bold ml-1" /></li>
                      <li>Tốc độ huấn luyện siêu tốc: <strong className="text-emerald-400">0.71 giây</strong> trên 20,000 văn bản.</li>
                      <li>Sai số tái tạo Frobenius tối ưu toán học: <strong className="text-white">134.84</strong>.</li>
                      <li><strong className="text-amber-400">Nhược điểm:</strong> 47.5% giá trị trong H mang dấu âm, gây khó khăn khi diễn giải thành xác suất thực tế.</li>
                    </ul>
                  </div>

                  <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    Kết luận phần: LSI cực kỳ hiệu quả cho tìm kiếm thông tin và giảm chiều, nhưng giải thích ngữ nghĩa chủ đề chưa tự nhiên đối với con người.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: LDA Observation */}
          {presentationStep === 3 && lda && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                  Phần 4: Thuật toán 2
                </span>
                <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                  <span className="text-emerald-400">LDA:</span> Latent Dirichlet Allocation & Xác Suất Bayes
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-900/60 space-y-4">
                  <div className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
                    Kết quả nhận diện tài liệu:
                  </div>
                  <div className="text-2xl font-black text-white">{lda.dominant_topic_name}</div>
                  <div className="text-sm text-slate-300">
                    Xác suất chủ đề (Topic Probability): <span className="font-mono font-bold text-emerald-400">{(lda.dominant_weight * 100).toFixed(1)}%</span>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-400 mb-2">Top từ vựng có xác suất cao nhất:</div>
                    <div className="flex flex-wrap gap-2">
                      {lda.top_topics[0]?.top_words.map((w, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-200 text-xs font-mono font-semibold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-bold text-white mb-2">Đặc tính kỹ thuật cốt lõi:</div>
                    <ul className="text-sm text-slate-300 space-y-2 pl-5 list-disc leading-relaxed">
                      <li>Công thức: <MathFormula math="\theta_d \sim \text{Dir}(\alpha), \; \phi_k \sim \text{Dir}(\beta)" className="text-emerald-300 font-bold ml-1" /></li>
                      <li>Phân phối xác suất chuẩn mực: Tổng xác suất của 10 chủ đề luôn bằng <strong className="text-white">100%</strong>.</li>
                      <li>Topic Coherence đạt: <strong className="text-white">0.6134</strong>.</li>
                      <li><strong className="text-rose-400">Nhược điểm:</strong> Thời gian huấn luyện rất lâu (<strong className="text-rose-300">397.72 giây</strong>, gần 6.6 phút), nhạy cảm với việc tinh chỉnh tham số biến phân.</li>
                    </ul>
                  </div>

                  <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    Kết luận phần: LDA cho đầu ra xác suất trực quan, phân bố tài liệu hài hòa, nhưng chi phí tính toán biến phân rất đắt đỏ.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: NMF Observation */}
          {presentationStep === 4 && nmf && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
                  Phần 5: Thuật toán 3
                </span>
                <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                  <span className="text-amber-400">NMF:</span> Non-negative Matrix Factorization
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-amber-900/60 space-y-4">
                  <div className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                    Kết quả nhận diện tài liệu:
                  </div>
                  <div className="text-2xl font-black text-white">{nmf.dominant_topic_name}</div>
                  <div className="text-sm text-slate-300">
                    Tỷ trọng thành phần W chuẩn hóa: <span className="font-mono font-bold text-amber-400">{(nmf.display_weights[nmf.dominant_topic - 1] * 100).toFixed(1)}%</span>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-400 mb-2">Top từ vựng không âm thuần túy:</div>
                    <div className="flex flex-wrap gap-2">
                      {nmf.top_topics[0]?.top_words.map((w, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-950 border border-amber-800 text-amber-200 text-xs font-mono font-semibold">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-bold text-white mb-2">Đặc tính kỹ thuật cốt lõi:</div>
                    <ul className="text-sm text-slate-300 space-y-2 pl-5 list-disc leading-relaxed">
                      <li>Công thức: <MathFormula math="V \approx WH, \; W \ge 0, \; H \ge 0" className="text-amber-300 font-bold ml-1" /></li>
                      <li>Topic Coherence (c_v) đạt: <strong className="text-amber-400 font-black text-base">0.7861 (Cao nhất)</strong>.</li>
                      <li>Topic Diversity: <strong className="text-emerald-400 font-bold">0.93</strong> (Rất ít trùng lặp từ khóa giữa các chủ đề).</li>
                      <li>Độ thưa trong ma trận H đạt: <strong className="text-white">54.7% giá trị bằng 0</strong>, tự động triệt tiêu từ nhiễu.</li>
                      <li>Thời gian huấn luyện: <strong className="text-white">2.57 giây</strong> (Nhanh gấp 155 lần so với LDA).</li>
                    </ul>
                  </div>

                  <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    Kết luận phần: NMF kết hợp hoàn hảo giữa tốc độ nhanh của đại số tuyến tính và độ mạch lạc ngữ nghĩa vượt trội nhờ ràng buộc không âm.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Tri-Column Comparison */}
          {presentationStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                  Phần 6: So sánh trực diện
                </span>
                <h2 className="text-3xl font-extrabold text-white">
                  Đối Đầu LSI | LDA | NMF Trên Cùng Một Bài Báo
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LSI */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-blue-500/60 space-y-3">
                  <div className="text-xs font-bold uppercase text-blue-400">LSI (SVD)</div>
                  <div className="text-sm font-bold text-white line-clamp-1">{lsi?.dominant_topic_name}</div>
                  <div className="text-xs text-blue-300 font-mono">Tọa độ SVD: {lsi?.dominant_weight}</div>
                  <div className="text-xs text-slate-400">
                    Top từ: {lsi?.top_topics[0]?.top_words.slice(0, 5).join(', ')}
                  </div>
                </div>

                {/* LDA */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/60 space-y-3">
                  <div className="text-xs font-bold uppercase text-emerald-400">LDA (Bayesian)</div>
                  <div className="text-sm font-bold text-white line-clamp-1">{lda?.dominant_topic_name}</div>
                  <div className="text-xs text-emerald-300 font-mono">Xác suất: {((lda?.dominant_weight || 0) * 100).toFixed(1)}%</div>
                  <div className="text-xs text-slate-400">
                    Top từ: {lda?.top_topics[0]?.top_words.slice(0, 5).join(', ')}
                  </div>
                </div>

                {/* NMF */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/60 space-y-3">
                  <div className="text-xs font-bold uppercase text-amber-400">NMF (Non-negative)</div>
                  <div className="text-sm font-bold text-white line-clamp-1">{nmf?.dominant_topic_name}</div>
                  <div className="text-xs text-amber-300 font-mono">Tỷ trọng W: {((nmf?.display_weights[nmf.dominant_topic - 1] || 0) * 100).toFixed(1)}%</div>
                  <div className="text-xs text-slate-400">
                    Top từ: {nmf?.top_topics[0]?.top_words.slice(0, 5).join(', ')}
                  </div>
                </div>
              </div>

              {/* Shared Keywords Box */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Từ khóa đồng thuận xuất hiện trong cả 3 mô hình:</span>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    {comparisonResult?.comparative_analysis.words_in_all_three.length} từ khóa chung
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {comparisonResult?.comparative_analysis.words_in_all_three.map((w, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-indigo-900/60 border border-indigo-500 text-indigo-200 text-xs font-mono font-bold">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: Evaluation Lab */}
          {presentationStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
                  Phần 7: Đánh giá định lượng
                </span>
                <h2 className="text-3xl font-extrabold text-white">
                  Kết Quả Thực Nghiệm & Đo Lường Topic Coherence
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Coherence (c_v)</div>
                  <div className="text-4xl font-black text-amber-400">0.7861</div>
                  <div className="text-xs text-slate-400 font-semibold">NMF vượt trội LSI (0.605) & LDA (0.613)</div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Topic Diversity</div>
                  <div className="text-4xl font-black text-emerald-400">0.9300</div>
                  <div className="text-xs text-slate-400 font-semibold">93% từ khóa không bị trùng lặp</div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tốc độ Fit Model</div>
                  <div className="text-4xl font-black text-blue-400">2.57s</div>
                  <div className="text-xs text-slate-400 font-semibold">Nhanh hơn LDA gấp 155 lần</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-2">
                <div className="font-bold text-white text-base">💡 Giải thích nguyên nhân NMF chiến thắng áp đảo:</div>
                <p className="leading-relaxed">
                  1. Ràng buộc phi âm (<MathFormula math="W, H \ge 0" className="text-amber-300" />) ép các thành phần chủ đề phải độc lập và có tính cộng dồn (parts-based).<br />
                  2. Ma trận H có độ thưa 54.7%, tự động triệt tiêu các từ vựng gây nhiễu về đúng 0, giữ lại những từ thực sự đại diện cho chủ đề.<br />
                  3. Không bị phân tán bởi nghiệm âm như SVD trong LSI, và không bị chậm chạp bởi lặp biến phân như LDA.
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 7: Conclusion */}
          {presentationStep === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-800">
                  Phần 8: Kết luận & Ứng dụng
                </span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white">
                  Tổng Kết Báo Cáo & Khuyến Nghị Ứng Dụng Thực Tế
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border-t-4 border-blue-500 space-y-3">
                  <div className="text-lg font-bold text-white">Khi nào nên dùng LSI?</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    • Hệ thống tìm kiếm thông tin (Information Retrieval) cần tốc độ cực nhanh.<br />
                    • Bài toán giảm số chiều (Dimensionality Reduction) làm bước tiền đề cho các mô hình phân loại (Classification).
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border-t-4 border-emerald-500 space-y-3">
                  <div className="text-lg font-bold text-white">Khi nào nên dùng LDA?</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    • Bài toán yêu cầu phân phối xác suất toán học nghiêm ngặt.<br />
                    • Phân tích xu hướng chủ đề dài hạn theo thời gian (Dynamic Topic Modeling), nơi cần mô hình sinh xác suất.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border-t-4 border-amber-500 space-y-3">
                  <div className="text-lg font-bold text-white">Khi nào nên dùng NMF? (Khuyến nghị số 1)</div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    • Xây dựng hệ thống phân tích báo chí, tin tức tiếng Việt thực tế.<br />
                    • Cần chủ đề mạch lạc cao nhất, dễ giải thích cho người dùng, tốc độ xử lý nhanh và độ thưa tối ưu.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-indigo-700/50 text-center space-y-3">
                <h3 className="text-2xl font-extrabold text-white">Cảm ơn Quý Thầy Cô và Các Bạn Đã Theo Dõi!</h3>
                <p className="text-sm text-indigo-200">
                  Website TopicLab sẵn sàng cho phần hỏi đáp và thao tác trực tiếp trên giao diện tương tác.
                </p>
                <button
                  onClick={togglePresentationMode}
                  className="mt-2 px-6 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors shadow-md"
                >
                  Quay lại giao diện phòng thí nghiệm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Presentation Bottom Navigation Bar */}
      <div className="h-16 px-8 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between shrink-0">
        <div className="text-sm text-slate-400 font-mono">
          Slide {presentationStep + 1} / 8: <span className="text-slate-200 font-bold">{steps[presentationStep].title}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={prevStep}
            disabled={presentationStep === 0}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trang trước</span>
          </button>

          <button
            onClick={nextStep}
            disabled={presentationStep === 7}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-md shadow-indigo-950"
          >
            <span>Trang tiếp theo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
