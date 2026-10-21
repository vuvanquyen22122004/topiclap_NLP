import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    if (!math) return '';
    try {
      return katex.renderToString(math.trim(), {
        displayMode: block,
        throwOnError: false,
        strict: false
      });
    } catch (e) {
      console.warn("KaTeX render error:", e);
      return `<span class="font-mono text-xs text-rose-500">${math}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`${block ? 'block text-center my-1' : 'inline-block align-middle'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Parses mixed text containing $...$ delimiters:
 * e.g. "Phân rã ma trận $A \approx U_k \Sigma_k V_k^T$ với rank $k$."
 */
export const RichMathText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split by $...$
  const parts = text.split(/(\$[^\$]+\$)/g);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          const math = part.slice(1, -1);
          return <MathFormula key={idx} math={math} className="px-0.5 inline-block" />;
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
};
