'use client';

import { ChevronUp, Check } from 'lucide-react';
import Avatar from './Avatar';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { apiClient } from '@/api/client';

interface AnswerCardProps {
  answer: {
    id: number;
    body: string;
    author: string;
    votes: number;
    isAccepted: boolean;
    createdAt: string;
  };
  isQuestionAuthor?: boolean;
  onAccept?: () => void;
}

export default function AnswerCard({ answer, isQuestionAuthor, onAccept }: AnswerCardProps) {
  const [votes, setVotes] = useState(answer.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async () => {
    if (hasVoted) return;
    try {
      await apiClient.voteAnswer(answer.id);
      setVotes(prev => prev + 1);
      setHasVoted(true);
    } catch (error) {
      console.error('Vote failed', error);
    }
  };

  return (
    <div className={`bg-white p-6 flex gap-6 border-b border-gray-100 ${answer.isAccepted ? 'border-l-4 border-l-success' : ''}`}>
      {/* Vote Column */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleVote}
          className={`p-2 transition-colors ${hasVoted ? 'text-accent' : 'text-gray-400 hover:text-accent'}`}
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <span className="font-mono font-bold text-lg">{votes}</span>
      </div>

      {/* Content Column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar name={answer.author} size="sm" />
            <span className="font-mono text-[11px] font-medium">{answer.author}</span>
            <span className="text-gray-300">•</span>
            <span className="font-mono text-[10px] text-text-muted">
              {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {answer.isAccepted && (
              <div className="flex items-center gap-1 text-success font-mono text-[10px] uppercase tracking-wider font-bold">
                <Check className="w-4 h-4" />
                Accepted Answer
              </div>
            )}
            {isQuestionAuthor && !answer.isAccepted && (
              <button
                onClick={onAccept}
                className="font-mono text-[10px] uppercase tracking-wider text-text-muted hover:text-success transition-colors"
              >
                Mark as Accepted
              </button>
            )}
          </div>
        </div>

        <div className="font-serif text-[15px] leading-relaxed text-text-primary whitespace-pre-wrap">
          {answer.body}
        </div>
      </div>
    </div>
  );
}
