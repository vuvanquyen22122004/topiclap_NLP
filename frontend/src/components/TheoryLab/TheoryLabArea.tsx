import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { TheorySection } from '../../types';
import {
  BookOpen,
  HelpCircle,
  CheckCircle,
  XCircle,
  Layers,
  Sparkles,
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TheoryLabArea: React.FC = () => {
  const [theoryMap, setTheoryMap] = useState<Record<string, TheorySection>>({});
  const [activeModel, setActiveModel] = useState<'lsi' | 'lda' | 'nmf'>('lsi');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTheory() {
      try {
        const data = await api.getTheory();
        setTheoryMap(data);
      } catch (err) {
        console.error('Error fetching theory data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTheory();
  }, []);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [questionId]: true }));
  };

  if (loading || !theoryMap[activeModel]) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold">Đang nạp dữ liệu lý thuyết học thuật...</p>
      </div>
    );
  }

  const current = theoryMap[activeModel];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Cơ Sở Học Thuật
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Góc Lý Thuyết Toán Học & Nguyên Lý Hoạt Động
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hiểu bản chất toán học từ trực giác cơ bản, ví dụ đồ chơi, công thức giải tích đến ưu nhược điểm thực tế
          </p>
        </div>

        {/* Algorithm Tabs */}
        <div className="flex space-x-2">
          {(['lsi', 'lda', 'nmf'] as const).map(m => {
            const isActive = activeModel === m;
            const tabColors = {
              lsi: isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100',
              lda: isActive ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100',
              nmf: isActive ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            };
            return (
              <button
                key={m}
                onClick={() => {
                  setActiveModel(m);
                  setSelectedAnswers({});
                  setShowExplanation({});
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all tracking-wider ${tabColors[m]}`}
              >
                {m.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-8">
        {/* Title & Intuition */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              activeModel === 'lsi' ? 'bg-blue-100 text-blue-800 border-blue-300' :
              activeModel === 'lda' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
              'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {current.name}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">{current.full_name}</h3>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900 block mb-1">💡 Trực giác đời thường (Intuition):</strong>
            {current.intuition}
          </div>
        </div>

        {/* Toy Example */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Ví Dụ Minh Họa Nhỏ (Toy Example)</span>
          </h4>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <p className="font-semibold text-slate-800">{current.toy_example.description}</p>
            <p className="text-slate-600 leading-relaxed">{current.toy_example.explanation}</p>
          </div>
        </div>

        {/* Processing Pipeline Workflow */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Sơ Đồ Luồng Xử Lý (Processing Pipeline)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {current.processing_pipeline.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-slate-900">{item.step}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mathematical Formulations & Symbol Table */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Công Thức Toán Học & Giải Thích Ký Hiệu</span>
          </h4>

          {/* Formulas Highlight */}
          <div className="p-5 bg-slate-900 text-slate-100 rounded-xl space-y-2 font-mono text-sm shadow-inner">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-sans font-bold">
              Phương trình cốt lõi:
            </div>
            <div className="text-emerald-400 font-bold text-base py-1">
              {current.math_formulation.main_equation}
            </div>
            {current.math_formulation.objective && (
              <div className="text-xs text-slate-300">
                <span className="text-slate-400 font-sans">Mục tiêu tối ưu: </span>
                {current.math_formulation.objective}
              </div>
            )}
            {current.math_formulation.topic_dist && (
              <div className="text-xs text-slate-300">
                <span className="text-slate-400 font-sans">Tiên nghiệm chủ đề: </span>
                {current.math_formulation.topic_dist}
              </div>
            )}
          </div>

          {/* Symbol Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-4 w-32">Ký hiệu</th>
                  <th className="py-2.5 px-4">Ý nghĩa toán học & vật lý trong TopicLab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {current.symbol_table.map((sym, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">{sym.symbol}</td>
                    <td className="py-2.5 px-4 leading-relaxed">{sym.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros & Cons Balance Sheet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
            <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Ưu điểm vượt trội</span>
            </div>
            <ul className="text-xs text-emerald-800 space-y-1.5 pl-4 list-disc leading-relaxed">
              {current.pros.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2">
            <div className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center space-x-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Hạn chế & Lưu ý</span>
            </div>
            <ul className="text-xs text-rose-800 space-y-1.5 pl-4 list-disc leading-relaxed">
              {current.cons.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Mini Quiz */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Kiểm Tra Mức Độ Hiểu Bài (Interactive Comprehension Check)
            </h4>
          </div>

          <div className="space-y-4">
            {current.quiz.map((q) => {
              const selectedIdx = selectedAnswers[q.id];
              const isAnswered = selectedIdx !== undefined;
              const isCorrect = selectedIdx === q.correct_index;

              return (
                <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="text-xs font-bold text-slate-900">
                    Câu hỏi: {q.question}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedIdx === optIdx;
                      const isOptionCorrect = optIdx === q.correct_index;
                      
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                      if (isAnswered) {
                        if (isOptionCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs border transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && isOptionCorrect && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                          {isAnswered && isOptionSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback explanation */}
                  {showExplanation[q.id] && (
                    <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                      isCorrect ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-300' : 'bg-rose-100/70 text-rose-900 border border-rose-300'
                    }`}>
                      <span className="font-bold">{isCorrect ? '✓ Chính xác! ' : '✗ Chưa đúng. '}</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
