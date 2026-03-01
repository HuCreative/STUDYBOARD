'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StatsBar from '@/components/StatsBar';
import Sidebar from '@/components/Sidebar';
import QuestionCard from '@/components/QuestionCard';
import AskModal from '@/components/AskModal';
import { apiClient } from '@/api/client';
import { Filter, SortDesc } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  
  const tag = searchParams.get('tag') || undefined;
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || undefined;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getQuestions({ tag, sort, search });
        setQuestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [tag, sort, search]);

  // Handle /ask redirect-like behavior
  useEffect(() => {
    if (window.location.pathname === '/ask') {
      setIsAskModalOpen(true);
      router.replace('/');
    }
  }, [router]);

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    router.push(`/?${params.toString()}`);
  };

  const handleTagSelect = (newTag: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newTag) params.set('tag', newTag);
    else params.delete('tag');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Navbar onAskClick={() => setIsAskModalOpen(true)} />
      <StatsBar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
              <div>
                <h1 className="font-playfair text-4xl font-black mb-2">
                  {search ? `Search: "${search}"` : tag ? `Subject: ${tag}` : 'Academic Feed'}
                </h1>
                <div className="accent-underline" />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <SortDesc className="w-4 h-4 text-text-muted" />
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="font-mono text-[11px] uppercase tracking-wider bg-transparent border-none focus:ring-0 cursor-pointer outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="voted">Most Voted</option>
                    <option value="answered">Most Answered</option>
                  </select>
                </div>
              </div>
            </header>

            <div className="space-y-6">
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-gray-100 animate-pulse border-l-4 border-gray-200" />
                  ))}
                </div>
              ) : questions.length > 0 ? (
                questions.map(q => <QuestionCard key={q.id} question={q} />)
              ) : (
                <div className="text-center py-20 bg-white border border-dashed border-gray-200">
                  <p className="font-serif text-text-muted italic">No questions found matching your criteria.</p>
                  <button
                    onClick={() => setIsAskModalOpen(true)}
                    className="mt-4 study-btn study-btn-primary"
                  >
                    Be the first to ask
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Sidebar activeTag={tag} onTagSelect={handleTagSelect} />
          </div>
        </div>
      </main>

      <AskModal isOpen={isAskModalOpen} onClose={() => setIsAskModalOpen(false)} />

      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
            StudyBoard &copy; 2026 &bull; A Premium Editorial Q&A Platform
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomeContent />
    </Suspense>
  );
}
