import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FAQ[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-750 transition-colors"
          >
            <span className="text-sm font-medium text-white">{faq.question}</span>
            {openIndex === i ? (
              <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-sm text-gray-300 border-t border-gray-700 pt-3">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
