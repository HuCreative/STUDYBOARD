'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import TagBadge from '@/components/TagBadge';
import Avatar from '@/components/Avatar';
import AnswerCard from '@/components/AnswerCard';
import AskModal from '@/components/AskModal';
import { apiClient } from '@/api/client';
import { formatDistanceToNow } from 'date-fns';
import { ChevronUp, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [answerBody, setAnswerBody] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    setStartTime(Date.now());
    const fetchQuestion = async () => {
      try {
        const data = await apiClient.getQuestion(parseInt(id));
        setQuestion(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleVote = async () => {
    try {
      await apiClient.voteQuestion(question.id);
      setQuestion({ ...question, votes: question.votes + 1 });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answerBody.length < 20) return;
    
    setIsSubmitting(true);
    try {
      const newAnswer = await apiClient.postAnswer(question.id, {
        body: answerBody,
        author: authorName,
        honeypot,
        startTime
      });
      setQuestion({
        ...question,
        answers: [newAnswer, ...question.answers]
      });
      setAnswerBody('');
      setAuthorName('');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to post answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptAnswer = async (answerId: number) => {
    try {
      await apiClient.acceptAnswer(answerId);
      setQuestion({
        ...question,
        answers: question.answers.map((a: any) => ({
          ...a,
          isAccepted: a.id === answerId
        }))
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen bg-background animate-pulse" />;
  if (!question) return <div className="min-h-screen flex items-center justify-center">Question not found</div>;

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Navbar onAskClick={() => setIsAskModalOpen(true)} />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted hover:text-accent mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to feed
        </Link>

        {/* Question Header */}
        <article className="bg-white border-l-4 border-accent p-8 mb-12 shadow-sm">
          <div className="flex items-start gap-8">
            {/* Vote Column */}
            <div className="flex flex-col items-center gap-1">
              <button onClick={handleVote} className="p-2 text-gray-400 hover:text-accent transition-colors">
                <ChevronUp className="w-8 h-8" />
              </button>
              <span className="font-mono font-bold text-2xl">{question.votes}</span>
              <span className="mono-label text-[10px] text-text-muted">Votes</span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <TagBadge tag={question.tag} />
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  Posted {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </span>
              </div>

              <h1 className="font-playfair text-4xl font-black mb-6 leading-tight">
                {question.title}
              </h1>

              <div className="font-serif text-lg leading-relaxed text-text-primary mb-8 whitespace-pre-wrap">
                {question.body}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar name={question.author} />
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-wider">{question.author}</p>
                    <p className="font-mono text-[10px] text-text-muted">QUESTION AUTHOR</p>
                  </div>
                </div>
                <div className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                  {question.views} Views
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Answers Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-playfair text-2xl font-bold italic">
              {question.answers.length} <span className="text-accent">Answers</span>
            </h2>
            <div className="flex-1 h-[2px] bg-accent/20" />
          </div>

          <div className="space-y-0 divide-y divide-gray-100 border-y border-gray-100">
            {question.answers.map((answer: any) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                isQuestionAuthor={true} // In a real app, check if current user is question author
                onAccept={() => handleAcceptAnswer(answer.id)}
              />
            ))}
          </div>

          {/* Post Answer Form */}
          <div className="mt-12 bg-[#FFFBEB] p-8 border-l-4 border-accent">
            <h3 className="font-playfair text-xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-accent" />
              Your <span className="text-accent">Answer</span>
            </h3>
            
            <form onSubmit={handlePostAnswer} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mono-label block mb-2">Display Name</label>
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={authorName}
                    onChange={e => setAuthorName(e.target.value)}
                    className="w-full bg-white border border-gray-200 p-3 font-serif focus:border-accent outline-none"
                    placeholder="e.g. John Smith"
                  />
                </div>
              </div>
              
              <div>
                <label className="mono-label block mb-2">Answer Body</label>
                <textarea
                  required
                  rows={8}
                  value={answerBody}
                  onChange={e => setAnswerBody(e.target.value)}
                  className="w-full bg-white border border-gray-200 p-4 font-serif leading-relaxed focus:border-accent outline-none resize-none"
                  placeholder="Provide a detailed, helpful answer (min 20 characters)..."
                />
              </div>

              {/* Honeypot */}
              <input
                type="text"
                className="hidden"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || answerBody.length < 20}
                  className={`study-btn study-btn-primary ${isSubmitting || answerBody.length < 20 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Posting...' : 'Post Answer'}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <AskModal isOpen={isAskModalOpen} onClose={() => setIsAskModalOpen(false)} />
    </div>
  );
}
