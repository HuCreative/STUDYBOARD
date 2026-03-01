'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';
import { HelpCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'CS', 'Economics'];

export default function Sidebar({ activeTag, onTagSelect }: { activeTag?: string; onTagSelect: (tag: string | undefined) => void }) {
  const [unanswered, setUnanswered] = useState<any[]>([]);

  useEffect(() => {
    const fetchUnanswered = async () => {
      try {
        const questions = await apiClient.getQuestions({ sort: 'newest' });
        setUnanswered(questions.filter((q: any) => q._count.answers === 0).slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    fetchUnanswered();
  }, []);

  return (
    <aside className="space-y-8">
      {/* Tag Filter */}
      <section>
        <h4 className="mono-label mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          Browse Subjects
        </h4>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onTagSelect(undefined)}
            className={`study-btn text-left w-full ${!activeTag ? 'bg-dark-bg text-white' : 'hover:bg-gray-100'}`}
          >
            All Questions
          </button>
          {SUBJECTS.map(tag => (
            <button
              key={tag}
              onClick={() => onTagSelect(tag)}
              className={`study-btn text-left w-full ${activeTag === tag ? 'bg-dark-bg text-white' : 'hover:bg-gray-100'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Needs Answers */}
      <section className="bg-accent/5 p-6 border-l-4 border-accent">
        <h4 className="mono-label mb-4 flex items-center gap-2 text-accent">
          <HelpCircle className="w-4 h-4" />
          Needs Answers
        </h4>
        <div className="space-y-4">
          {unanswered.length > 0 ? (
            unanswered.map(q => (
              <Link key={q.id} href={`/questions/${q.id}`} className="block group">
                <h5 className="font-playfair font-bold text-sm group-hover:text-accent transition-colors line-clamp-2">
                  {q.title}
                </h5>
                <span className="font-mono text-[9px] text-text-muted uppercase">
                  {q.tag}
                </span>
              </Link>
            ))
          ) : (
            <p className="font-serif text-xs text-text-muted italic">No unanswered questions found.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-bg p-6 text-white">
        <h4 className="font-playfair text-xl font-bold mb-2 italic">
          Join the <span className="text-accent">Community</span>
        </h4>
        <p className="font-serif text-xs text-gray-400 mb-6 leading-relaxed">
          Share your knowledge, help others, and grow your academic reputation.
        </p>
        <div className="accent-underline mb-6" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">
          StudyBoard Editorial
        </p>
      </section>
    </aside>
  );
}
