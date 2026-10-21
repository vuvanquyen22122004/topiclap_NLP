import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { EvaluationResponse } from '../../types';
import { RichMathText } from '../MathFormula';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Layers,
  Award,
  CheckCircle2,
  Info,
  Database,
  Cpu
} from 'lucide-react';

export const EvaluationLabArea: React.FC = () => {
  const [data, setData] = useState<EvaluationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEval() {
      try {
        const res = await api.getEvaluation();
        setData(res);
      } catch (err) {
        console.error('Error loading evaluation data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEval();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold">Đang nạp kết quả đánh giá thực nghiệm từ Google Colab...</p>
      </div>
    );
  }

  // Bar chart data for Coherence and Diversity
  const coherenceChartData = data.metrics_table.map(row => ({
    name: row.model.split(' ')[0],
    coherence: row.coherence_cv,
    diversity: row.topic_diversity,
  }));

  // Bar chart data for Runtime
  const runtimeChartData = data.metrics_table.map(row => ({
    name: row.model.split(' ')[0],
    runtime: row.train_time_sec,
  }));

  // Prepare K-sweep chart data
  const kSweepData = [3, 5, 7, 10, 15].map(k => {
    const nmfPt = data.k_sweep.NMF?.find(p => p.k === k);
    const lsiPt = data.k_sweep.LSI?.find(p => p.k === k);
    const ldaPt = data.k_sweep.LDA?.find(p => p.k === k);
    return {
      k: `k=${k}`,
      NMF: nmfPt ? nmfPt.coherence_cv : null,
      LSI: lsiPt ? lsiPt.coherence_cv : null,
      LDA: ldaPt ? ldaPt.coherence_cv : null,
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Thực Nghiệm Khoa Học
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Đánh Giá Thực Nghiệm Trên 20,000 Văn Bản
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Số liệu đo đạc thực tế từ quá trình huấn luyện trên Google Colab với cùng một tập ngữ liệu và cùng thước đo Gensim c_v
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-slate-600">
            K = 10 chủ đề • Vocab = 10k
          </div>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
              Topic Coherence (c_v)
            </span>
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600">0.7861</div>
          <div className="text-xs text-slate-600">
            <strong>NMF dẫn đầu:</strong> Vượt trội 28.7% so với LSI (0.605) và LDA (0.613). Các từ trong cùng chủ đề kết dính ngữ nghĩa cao nhất.
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
              Topic Diversity
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600">0.9300</div>
          <div className="text-xs text-slate-600">
            <strong>NMF đạt 93%:</strong> 93% từ khóa trong top 10 của các chủ đề là duy nhất. Rất ít trùng lặp từ khóa giữa các chủ đề.
          </div>
        </div>

        <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
              Tốc Độ Huấn Luyện (Runtime)
            </span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-600">0.71s</div>
          <div className="text-xs text-slate-600">
            <strong>LSI nhanh nhất (0.71s):</strong> NMF về nhì rất sát (2.57s), trong khi LDA chậm gấp gần 155 lần (397.7s) do lặp biến phân.
          </div>
        </div>
      </div>

      {/* Charts Grid: Coherence & Diversity Bar Chart + K-Sweep Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coherence & Diversity Bar Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>So Sánh Độ Mạch Lạc (Coherence c_v) & Độ Phân Biệt (Diversity)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Thang điểm từ 0.0 đến 1.0 (Càng cao càng tốt)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coherenceChartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <YAxis domain={[0, 1.0]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [val, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="coherence" name="Coherence (c_v)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="diversity" name="Topic Diversity" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* K-Sweep Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Biểu Đồ K-Sweep: Coherence c_v Theo Số Lượng Chủ Đề K</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Kiểm thử Coherence khi thay đổi số lượng chủ đề K ∈ [3, 5, 7, 10, 15]</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kSweepData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="k" tick={{ fontSize: 11 }} />
                <YAxis domain={[0.5, 0.85]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="NMF" stroke="#ea580c" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="LSI" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="LDA" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Metrics Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Bảng Đối Chiếu Số Liệu Đầy Đủ (Benchmark Matrix)</h3>
          <p className="text-xs text-slate-500 mt-1">Toàn bộ 9 chỉ số định lượng thu được từ Google Colab</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Mô hình</th>
                <th className="py-3 px-3">Đầu vào</th>
                <th className="py-3 px-3 text-center">Coherence (c_v)</th>
                <th className="py-3 px-3 text-center">Topic Diversity</th>
                <th className="py-3 px-3 text-center">Avg Jaccard</th>
                <th className="py-3 px-3 text-center">Sai số tái tạo</th>
                <th className="py-3 px-3 text-center">% Âm trong H</th>
                <th className="py-3 px-3 text-center">% Bằng 0 trong H</th>
                <th className="py-3 px-3 text-center">Thời gian train</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {data.metrics_table.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      row.model.startsWith('LSI') ? 'bg-blue-600' : (row.model.startsWith('LDA') ? 'bg-emerald-600' : 'bg-amber-600')
                    }`}></span>
                    <span>{row.model}</span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">{row.input_representation}</td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-900">
                    <span className={row.coherence_cv > 0.7 ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-black' : ''}>
                      {row.coherence_cv.toFixed(4)}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold">{row.topic_diversity.toFixed(2)}</td>
                  <td className="py-3.5 px-3 text-center font-mono">{row.avg_jaccard.toFixed(4)}</td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    {row.reconstruction_error !== null ? row.reconstruction_error.toFixed(2) : 'N/A (Bayesian)'}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    <span className={row.percent_negative_h > 0 ? 'text-blue-700 font-bold' : 'text-slate-400'}>
                      {row.percent_negative_h.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">
                    <span className={row.percent_zero_h > 50 ? 'text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded' : 'text-slate-400'}>
                      {row.percent_zero_h.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-semibold">
                    {row.train_time_sec < 10 ? `${row.train_time_sec.toFixed(2)}s` : `${row.train_time_sec.toFixed(1)}s`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Findings and Scientific Notes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Nhận Xét Thực Nghiệm Có Điều Kiện Dựa Trên Số Liệu Thực</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          {data.key_findings.map((finding, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed">
              <span className="font-bold text-slate-800">#{idx + 1}. </span>
              <RichMathText text={finding} />
            </div>
          ))}
        </div>

        {/* Metric Definitions Guide */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 mb-2">Định nghĩa và phương pháp tính toán:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600">
            {Object.entries(data.metric_definitions).slice(0, 4).map(([k, v], idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800"><RichMathText text={k} />: </span>
                <RichMathText text={v} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
