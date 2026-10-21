import React from 'react';
import { useApp, AreaType } from '../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  Cpu,
  Columns3,
  BarChart3,
  BookOpen,
  FlaskConical,
  Tv,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeArea, setActiveArea, togglePresentationMode } = useApp();

  const navItems: Array<{
    id: AreaType;
    label: string;
    sublabel: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      id: 'overview',
      label: 'Tổng quan',
      sublabel: 'Kiến trúc & Dataset',
      icon: LayoutDashboard,
    },
    {
      id: 'document',
      label: 'Khám phá tài liệu',
      sublabel: 'Tiền xử lý & Token',
      icon: FileText,
      badge: '15 mẫu'
    },
    {
      id: 'models',
      label: 'Khám phá mô hình',
      sublabel: 'LSI • LDA • NMF',
      icon: Cpu,
    },
    {
      id: 'comparison',
      label: 'So sánh đối đầu',
      sublabel: 'Phân tích 3 cột song song',
      icon: Columns3,
      badge: 'Cốt lõi'
    },
    {
      id: 'evaluation',
      label: 'Đánh giá thực nghiệm',
      sublabel: 'Coherence & K-Sweep',
      icon: BarChart3,
    },
    {
      id: 'theory',
      label: 'Góc lý thuyết',
      sublabel: 'Toán học & Câu hỏi hiểu bài',
      icon: BookOpen,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-slate-800">
      <div>
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-slate-800/80 bg-slate-950/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-950">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div className="ml-3">
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              TopicLab
              <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-400/30">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-400 tracking-normal font-medium">
              LSI • LDA • NMF Explorer
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3">
          <div className="px-3 py-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Khu vực làm việc
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeArea === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveArea(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`} />
                    <div className="truncate">
                      <div className="text-xs font-semibold leading-tight truncate">{item.label}</div>
                      <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {item.sublabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {item.badge && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-blue-500/40 text-blue-100'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info & Legend */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30 space-y-3">
        {/* Color Legend */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
            Màu đại diện mô hình
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold text-center">
            <div className="bg-blue-950/60 border border-blue-600/40 text-blue-300 py-1 rounded-md">
              LSI
            </div>
            <div className="bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 py-1 rounded-md">
              LDA
            </div>
            <div className="bg-amber-950/60 border border-amber-600/40 text-amber-300 py-1 rounded-md">
              NMF
            </div>
          </div>
        </div>

        {/* Presentation Button in Sidebar */}
        <button
          onClick={togglePresentationMode}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition-all"
        >
          <Tv className="w-3.5 h-3.5" />
          <span>Thuyết trình toàn màn hình</span>
        </button>

        <div className="text-[10px] text-slate-400 text-center">
          Dữ liệu: 20,000 bài báo tiếng Việt (k=10)
        </div>
      </div>
    </aside>
  );
};
