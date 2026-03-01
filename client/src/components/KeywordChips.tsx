interface KeywordChipsProps {
  keywords: string[];
  label?: string;
}

export default function KeywordChips({ keywords, label }: KeywordChipsProps) {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div>
      {label && <h4 className="text-sm font-semibold text-gray-400 mb-2">{label}</h4>}
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
