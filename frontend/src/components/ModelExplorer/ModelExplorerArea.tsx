import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RichMathText } from '../MathFormula';
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
  Cpu, 
  AlertCircle, 
  Layers, 
  BarChart2, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export const ModelExplorerArea: React.FC = () => {
  const { modelSummaries, analysisResult, setActiveArea } = useApp();
  const [activeTab, setActiveTab] = useState<'lsi' | 'lda' | 'nmf'>('lsi');
  const [selectedTopicId, setSelectedTopicId] = useState<number>(1);

  const currentSummary = modelSummaries[activeTab];
  const docRep = analysisResult ? analysisResult[activeTab] : null;

  const currentTopic = currentSummary?.topics.find(t => t.topic_id === selectedTopicId) || currentSummary?.topics[0];

  // Prepare top words chart data
  const topWordsData = currentTopic?.top_words.slice(0, 10).map(w => ({
    word: w.word.replace('_', ' '),
    weight: activeTab === 'lda' ? (w.probability ? Number((w.probability * 100).toFixed(2)) : w.weight) : w.weight,
    rawWeight: w.weight,
    probability: w.probability
  })) || [];

  // Prepare document representation chart data
  const docRepData = docRep?.raw_weights.map((val, idx) => ({
    topic: `CĐ ${idx + 1}`,
    value: activeTab === 'lda' ? Number((val * 100).toFixed(1)) : val,
    isDominant: idx + 1 === docRep.dominant_topic
  })) || [];

  const tabConfig = {
    lsi: {
      name: 'LSI (Latent Semantic Indexing)',
      color: '#2563eb',
      bgColor: 'bg-blue-600',
      textColor: 'text-blue-700',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
      metricLabel: 'Hệ số SVD (Tọa độ trực giao)',
      unit: '',
      intuition: 'Chiếu ma trận TF-IDF vào không gian con trực giao 10 chiều bằng SVD. Gom các từ đồng nghĩa vào cùng trục ngữ nghĩa tiềm ẩn.',
      principle: '$A \\approx U_k \\Sigma_k V_k^T$ (Phân rã giá trị kỳ dị rút gọn). Giữ lại 10 giá trị kỳ dị lớn nhất.',
      caveat: 'Hệ số có thể âm hoặc dương mang ý nghĩa phương hướng đại số. KHÔNG PHẢI xác suất.',
      inputDesc: 'TF-IDF (10,000 đặc trưng, min_df=5, max_df=0.9)'
    },
    lda: {
      name: 'LDA (Latent Dirichlet Allocation)',
      color: '#16a34a',
      bgColor: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      metricLabel: 'Xác suất từ (%)',
      unit: '%',
      intuition: 'Mô hình sinh xác suất giả định mỗi tài liệu là một hỗn hợp các chủ đề theo phân phối Dirichlet ba cấp độ.',
      principle: '$\\theta_d \\sim \\text{Dirichlet}(\\alpha), \\; \\phi_k \\sim \\text{Dirichlet}(\\beta)$. Suy luận biến phân (Variational Inference) ước lượng phân phối hậu nghiệm.',
      caveat: 'Đầu ra là phân phối xác suất hợp thức (tổng = 100%). Nhạy cảm với tham số α, β và tốn nhiều thời gian huấn luyện nhất.',
      inputDesc: 'Bag-of-Words / CountVectorizer (Đếm tần suất nguyên, min_df=1)'
    },
    nmf: {
      name: 'NMF (Non-negative Matrix Factorization)',
      color: '#ea580c',
      bgColor: 'bg-amber-600',
      textColor: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      metricLabel: 'Trọng số ma trận H (≥ 0)',
      unit: '',
      intuition: 'Phân rã ma trận không âm $V \\approx WH$ ($W \\ge 0, H \\ge 0$). Ràng buộc phi âm buộc mô hình học các thành phần ngữ nghĩa cộng dồn (parts-based).',
      principle: '$\\min_{W \\ge 0, \\, H \\ge 0} \\frac{1}{2} \\|V - WH\\|_F^2$ với khởi tạo NNDSVDa và thuật toán Coordinate Descent.',
      caveat: 'Hệ số thuần dương với độ thưa 54.7%, triệt tiêu hoàn toàn nhiễu âm. Trọng số gốc cần chuẩn hóa L1 nếu muốn tính tỷ lệ.',
      inputDesc: 'TF-IDF (10,000 đặc trưng, min_df=5, max_df=0.9)'
    }
  }[activeTab];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex space-x-2">
          {(['lsi', 'lda', 'nmf'] as const).map(tab => {
            const isActive = activeTab === tab;
            const colors = {
              lsi: isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100',
              lda: isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100',
              nmf: isActive ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            };
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedTopicId(1);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-wider ${colors[tab]}`}
              >
                {tab.toUpperCase()}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setActiveArea('comparison')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors flex items-center space-x-2 shadow-xs"
        >
          <span>So sánh trực tiếp cả 3 mô hình</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Model Overview Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-7 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide ${tabConfig.badgeBg}`}>
                {activeTab.toUpperCase()}
              </span>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">{tabConfig.name}</h2>
            </div>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed"><RichMathText text={tabConfig.intuition} /></p>
          </div>

          <div className="text-xs sm:text-sm bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
            <span className="text-slate-500 font-medium">Đầu vào: </span>
            <span className="font-semibold text-slate-800">{tabConfig.inputDesc}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <strong className="text-sm font-bold text-slate-700">Nguyên lý toán học:</strong>
            <div className="text-sm text-slate-800 py-0.5 leading-relaxed">
              <RichMathText text={tabConfig.principle} />
            </div>
          </div>
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1.5">
            <strong className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Lưu ý diễn giải:
            </strong>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">{tabConfig.caveat}</p>
          </div>
        </div>
      </div>

      {/* Topic Selector Pills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">
            Chọn chủ đề để xem chi tiết danh sách từ khóa và trọng số:
          </h3>
          <span className="text-xs sm:text-sm text-slate-500 font-semibold font-mono">
            {currentSummary?.topics.length || 10} Chủ đề đã học
          </span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 pt-0.5">
          {currentSummary?.topics.map(t => {
            const isSelected = selectedTopicId === t.topic_id;
            return (
              <button
                key={t.topic_id}
                onClick={() => setSelectedTopicId(t.topic_id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? `${tabConfig.bgColor} text-white border-transparent shadow-xs`
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.topic_name}
              </button>
            );
          })}
        </div>

        {currentTopic && (
          <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-700">Nhãn chủ đề: </span>
              <span className={`text-base font-bold ${tabConfig.textColor}`}>{currentTopic.label}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Top 15 từ vựng đặc trưng
            </div>
          </div>
        )}
      </div>

      {/* Charts Grid: Top Words Bar Chart & Document Representation Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Words Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>Biểu Đồ Trọng Số Top 10 Từ Khóa ({tabConfig.metricLabel})</span>
            </h4>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topWordsData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="word" type="category" tick={{ fontSize: 12.5 }} width={100} />
                <Tooltip
                  formatter={(val: any) => [`${val} ${tabConfig.unit}`, tabConfig.metricLabel]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                />
                <Bar dataKey="weight" fill={tabConfig.color} radius={[0, 4, 4, 0]}>
                  {topWordsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={tabConfig.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document-Topic Representation */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Biểu Diễn Tài Liệu Đang Xem (10 Chủ Đề)</span>
              </h4>
            </div>

            {docRep ? (
              <>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={docRepData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="topic" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(val: any) => [`${val} ${tabConfig.unit}`, docRep.weight_type]}
                        contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                      />
                      {activeTab === 'lsi' && <ReferenceLine y={0} stroke="#94a3b8" />}
                      <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                        {docRepData.map((entry, index) => (
                          <Cell 
                            key={`doc-cell-${index}`} 
                            fill={entry.isDominant ? tabConfig.color : '#cbd5e1'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Chủ đề chủ đạo:</span>
                    <span className={`font-bold ${tabConfig.textColor}`}>
                      {docRep.dominant_topic_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Độ tin cậy nhận diện:</span>
                    <span className="font-semibold text-slate-800">{docRep.confidence_level}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-200">
                    {docRep.interpretation}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-sm text-slate-400">
                Chưa có dữ liệu suy luận tài liệu.
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-100">
            Dữ liệu suy luận thời gian thực trên mô hình đã huấn luyện
          </div>
        </div>
      </div>
    </div>
  );
};
