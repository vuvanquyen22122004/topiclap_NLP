import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewArea } from './components/Overview/OverviewArea';
import { DocumentExplorerArea } from './components/DocumentExplorer/DocumentExplorerArea';
import { ModelExplorerArea } from './components/ModelExplorer/ModelExplorerArea';
import { ModelComparisonArea } from './components/ModelComparison/ModelComparisonArea';
import { EvaluationLabArea } from './components/EvaluationLab/EvaluationLabArea';
import { TheoryLabArea } from './components/TheoryLab/TheoryLabArea';
import { PresentationModeView } from './components/PresentationMode/PresentationModeView';
import { AlertCircle, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeArea, isPresentationMode, error, clearError } = useApp();

  if (isPresentationMode) {
    return <PresentationModeView />;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-800">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />

        {/* Global Error Banner if any */}
        {error && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center justify-between text-xs text-rose-800 animate-slideDown">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-rose-500 hover:text-rose-800 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dynamic Area Container */}
        <main className="flex-1 overflow-y-auto">
          {activeArea === 'overview' && <OverviewArea />}
          {activeArea === 'document' && <DocumentExplorerArea />}
          {activeArea === 'models' && <ModelExplorerArea />}
          {activeArea === 'comparison' && <ModelComparisonArea />}
          {activeArea === 'evaluation' && <EvaluationLabArea />}
          {activeArea === 'theory' && <TheoryLabArea />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
