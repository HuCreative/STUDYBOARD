'use client';

import Link from 'next/link';
import { ChevronUp, MessageSquare } from 'lucide-react';
import TagBadge from './TagBadge';
import Avatar from './Avatar';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { apiClient } from '@/api/client';

interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    body: string;
    tag: string;
    author: string;
    votes: number;
    views: number;
    createdAt: string;
    _count?: { answers: number };
  };
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const [votes, setVotes] = useState(question.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVoted) return;
    
    try {
      await apiClient.voteQuestion(question.id);
      setVotes(prev => prev + 1);
      setHasVoted(true);
    } catch (error) {
      console.error('Vote failed', error);
    }
  };

  const answerCount = question._count?.answers || 0;

  return (
    <Link href={`/questions/${question.id}`}>
      <div className="study-card p-6 flex gap-6">
        {/* Vote Column */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleVote}
            className={`p-2 transition-colors ${hasVoted ? 'text-accent' : 'text-gray-400 hover:text-accent'}`}
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className="font-mono font-bold text-lg">{votes}</span>
          <span className="mono-label text-[9px] text-text-muted">Votes</span>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <TagBadge tag={question.tag} />
            <div className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 ${answerCount > 0 ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'}`}>
              <MessageSquare className="w-3 h-3" />
              {answerCount} {answerCount === 1 ? 'Answer' : 'Answers'}
            </div>
          </div>

          <h3 className="font-playfair text-xl font-bold mb-2 line-clamp-2 hover:text-accent transition-colors">
            {question.title}
          </h3>
          
          <p className="font-serif text-sm text-text-muted mb-4 line-clamp-2 leading-relaxed">
            {question.body}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar name={question.author} size="sm" />
              <span className="font-mono text-[11px] font-medium">{question.author}</span>
              <span className="text-gray-300">•</span>
              <span className="font-mono text-[10px] text-text-muted">
                {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="font-mono text-[10px] text-text-muted">
              {question.views} VIEWS
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
