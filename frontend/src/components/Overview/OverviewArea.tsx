import React from 'react';
import { useApp } from '../../context/AppContext';
import { MathFormula } from '../MathFormula';
import { 
  ArrowRight, 
  Database, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  FileText, 
  BarChart, 
  GitFork,
  Check
} from 'lucide-react';

export const OverviewArea: React.FC = () => {
  const { setActiveArea, backendHealth } = useApp();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 lg:p-10 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-48 bottom-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nền tảng Học thuật & Thí nghiệm Tương tác</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            TopicLab: Phòng Thí Nghiệm So Sánh <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400">LSI, LDA & NMF</span>
          </h1>

          <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
            Topic Modeling (Mô hình hóa chủ đề) là kỹ thuật học máy không giám sát (unsupervised learning) 
            giúp tự động trích xuất các chủ đề ngữ nghĩa tiềm ẩn từ kho văn bản lớn mà không cần gán nhãn thủ công. 
            TopicLab được xây dựng để bạn quan sát, kiểm chứng và so sánh cách 3 thuật toán nền tảng biểu diễn cùng một tập ngữ liệu báo chí tiếng Việt.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveArea('comparison')}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-900/50 transition-all hover:scale-[1.02]"
            >
              <span>Bắt đầu so sánh đối đầu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveArea('document')}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Khám phá 15 bài báo mẫu</span>
            </button>
            <button
              onClick={() => setActiveArea('evaluation')}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <BarChart className="w-4 h-4 text-amber-400" />
              <span>Xem kết quả Coherence</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Model Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Ba Trụ Cột Thuật Toán Trong Thí Nghiệm</h2>
            <p className="text-xs text-slate-500">Mỗi mô hình đại diện cho một trường phái toán học và tối ưu khác biệt</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LSI Card */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                  LSI (SVD)
                </span>
                <span className="text-xs text-slate-500 font-mono">Đại số tuyến tính</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Latent Semantic Indexing</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Phân rã ma trận TF-IDF bằng Truncated SVD (<MathFormula math="A \approx U \Sigma V^T" className="text-blue-700 font-bold" />) để tìm các trục trực giao tiềm ẩn.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Biểu diễn đầu vào:</span>
                  <span className="font-semibold text-slate-800">TF-IDF (10,000 từ)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bản chất hệ số:</span>
                  <span className="font-semibold text-blue-700">Tọa độ trực giao (+/-)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tốc độ huấn luyện:</span>
                  <span className="font-semibold text-slate-800">0.71 giây (Nhanh nhất)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Topic Coherence (c_v):</span>
                  <span className="font-semibold text-slate-800">0.6050</span>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                <strong className="text-slate-700">Điểm lưu ý:</strong> Hệ số mang dấu âm/dương để biểu thị hướng trực giao, tuyệt đối không phải là xác suất.
              </div>
            </div>

            <button
              onClick={() => setActiveArea('models')}
              className="mt-5 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors border border-blue-200 flex items-center justify-center space-x-1"
            >
              <span>Xem chi tiết LSI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* LDA Card */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  LDA (Bayesian)
                </span>
                <span className="text-xs text-slate-500 font-mono">Xác suất Bayes</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Latent Dirichlet Allocation</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Mô hình sinh xác suất giả định mỗi tài liệu là hỗn hợp của các chủ đề theo phân phối Dirichlet (<MathFormula math="\theta \sim \text{Dir}(\alpha)" className="text-emerald-700 font-bold" />).
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Biểu diễn đầu vào:</span>
                  <span className="font-semibold text-slate-800">Bag-of-Words (Đếm từ)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bản chất hệ số:</span>
                  <span className="font-semibold text-emerald-700">Xác suất (Sum = 1.0)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tốc độ huấn luyện:</span>
                  <span className="font-semibold text-slate-800">397.72 giây (~6.6 phút)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Topic Coherence (c_v):</span>
                  <span className="font-semibold text-slate-800">0.6134</span>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                <strong className="text-slate-700">Điểm lưu ý:</strong> Đầu ra là phân phối xác suất toán học hợp thức, phân bố tài liệu đồng đều nhất.
              </div>
            </div>

            <button
              onClick={() => setActiveArea('models')}
              className="mt-5 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors border border-emerald-200 flex items-center justify-center space-x-1"
            >
              <span>Xem chi tiết LDA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* NMF Card */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  NMF (Không âm)
                </span>
                <span className="text-xs text-slate-500 font-mono">Tối ưu hóa không âm</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Non-negative Matrix Factorization</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Phân rã ma trận TF-IDF <MathFormula math="V \approx WH" className="text-amber-700 font-bold" /> với ràng buộc nghiêm ngặt <MathFormula math="W, H \ge 0" className="text-amber-700 font-bold" />, tạo biểu diễn từng phần (parts-based).
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Biểu diễn đầu vào:</span>
                  <span className="font-semibold text-slate-800">TF-IDF (10,000 từ)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bản chất hệ số:</span>
                  <span className="font-semibold text-amber-700">Trọng số W ≥ 0 (Thưa 54.7%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tốc độ huấn luyện:</span>
                  <span className="font-semibold text-slate-800">2.57 giây (Rất nhanh)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Topic Coherence (c_v):</span>
                  <span className="font-semibold text-amber-700 font-bold">0.7861 (Cao nhất)</span>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                <strong className="text-slate-700">Điểm lưu ý:</strong> Ràng buộc phi âm loại bỏ hoàn toàn các giá trị âm gây nhiễu, cho chủ đề sắc nét và mạch lạc nhất.
              </div>
            </div>

            <button
              onClick={() => setActiveArea('models')}
              className="mt-5 w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-colors border border-amber-200 flex items-center justify-center space-x-1"
            >
              <span>Xem chi tiết NMF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dataset & Artifact Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-800">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base">Thông Tin Ngữ Liệu Thực Nghiệm (Dataset)</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-slate-800">20,000</div>
              <div className="text-[11px] text-slate-500 font-medium">Văn bản huấn luyện</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-slate-800">10,000</div>
              <div className="text-[11px] text-slate-500 font-medium">Kích thước từ vựng</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-slate-800">10</div>
              <div className="text-[11px] text-slate-500 font-medium">Số chủ đề (k)</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl font-black text-emerald-600">192</div>
              <div className="text-[11px] text-slate-500 font-medium">Stopwords tiếng Việt</div>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-700">Quy trình tiền xử lý thực tế từ Colab:</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Chuẩn hóa Unicode tiếng Việt (text_normalize)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Tách từ ghép tiếng Việt (Underthesea / ViTokenizer)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Lọc bỏ 192 hư từ (stopwords) chuyên sâu</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Loại bỏ từ đơn ký tự và các số thuần túy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Model Loading Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-800 mb-3">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base">Trạng Thái Artifact Model</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Model và vectorizer được nạp trực tiếp từ các file pickle Colab đã xuất, không retrain khi chạy web.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-medium text-emerald-900">lsi_model.pkl (TruncatedSVD)</span>
                <span className="font-bold text-emerald-700">Đã nạp (k=10)</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-medium text-emerald-900">lda_model.pkl (LDA)</span>
                <span className="font-bold text-emerald-700">Đã nạp (k=10)</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-medium text-emerald-900">nmf_model.pkl (NMF)</span>
                <span className="font-bold text-emerald-700">Đã nạp (k=10)</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-medium text-emerald-900">tfidf_vectorizer.pkl</span>
                <span className="font-bold text-emerald-700">10,000 vocab</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Trạng thái hệ thống:</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              100% Sẵn sàng suy luận
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Pipeline Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs">
        <div className="mb-6">
          <h3 className="font-bold text-base text-slate-800 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Sơ Đồ Luồng Xử Lý Toàn Diện (End-to-End Pipeline)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Từ văn bản thô đến biểu diễn chủ đề và đối chiếu thực nghiệm</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs mx-auto">1</div>
            <div className="text-xs font-bold text-slate-800">Văn bản gốc</div>
            <div className="text-[11px] text-slate-500 leading-tight">Bài báo tiếng Việt hoặc text nhập tùy biến</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mx-auto">2</div>
            <div className="text-xs font-bold text-slate-800">Tiền xử lý & Token</div>
            <div className="text-[11px] text-slate-500 leading-tight">Tách từ ghép tiếng Việt, loại bỏ 192 stopwords</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mx-auto">3</div>
            <div className="text-xs font-bold text-slate-800">Vector hóa (10k từ)</div>
            <div className="text-[11px] text-slate-500 leading-tight">TF-IDF (LSI, NMF) hoặc Count (LDA)</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mx-auto">4</div>
            <div className="text-xs font-bold text-slate-800">Suy luận 3 mô hình</div>
            <div className="text-[11px] text-slate-500 leading-tight">LSI SVD, LDA Dirichlet, NMF Matrix</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs mx-auto">5</div>
            <div className="text-xs font-bold text-slate-800">So sánh & Đánh giá</div>
            <div className="text-[11px] text-slate-500 leading-tight">Đối chiếu top từ, Coherence, Diversity</div>
          </div>
        </div>
      </div>
    </div>
  );
};
