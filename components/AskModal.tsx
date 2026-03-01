'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '@/api/client';
import { useRouter } from 'next/navigation';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'CS', 'Economics'];

export default function AskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    tag: SUBJECTS[0],
    title: '',
    body: '',
    honeypot: ''
  });
  const [startTime, setStartTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
      setStep(1);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.title.length < 15) {
        setError('Title must be at least 15 characters');
        return;
      }
      setStep(2);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const question = await apiClient.createQuestion({
        title: formData.title,
        body: formData.body,
        tag: formData.tag,
        author: formData.name,
        honeypot: formData.honeypot,
        startTime
      });
      onClose();
      router.push(`/questions/${question.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="bg-[#111] p-6 flex items-center justify-between border-b-4 border-accent">
          <h2 className="font-playfair text-white text-xl font-bold italic">
            Ask a <span className="text-accent">Question</span>
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex h-1 bg-gray-100">
          <div className={`h-full bg-accent transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-mono text-xs">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="mono-label block mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 p-3 font-serif focus:border-accent outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="mono-label block mb-2">Subject Tag</label>
                <select
                  value={formData.tag}
                  onChange={e => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full border border-gray-200 p-3 font-mono text-xs focus:border-accent outline-none appearance-none bg-white"
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="mono-label block mb-2">Question Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-200 p-3 font-playfair font-bold text-lg focus:border-accent outline-none"
                  placeholder="What is your question?"
                />
                <p className="mt-1 text-[10px] text-text-muted font-mono">Min 15 characters</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="mono-label block mb-2">Context / Details (Optional)</label>
                <textarea
                  rows={6}
                  value={formData.body}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  className="w-full border border-gray-200 p-3 font-serif leading-relaxed focus:border-accent outline-none resize-none"
                  placeholder="Provide more details to help others answer..."
                />
              </div>
              {/* Honeypot */}
              <input
                type="text"
                className="hidden"
                value={formData.honeypot}
                onChange={e => setFormData({ ...formData, honeypot: e.target.value })}
              />
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="study-btn study-btn-secondary"
              >
                Back
              </button>
            )}
            <div className="flex-1" />
            <button
              type="submit"
              disabled={loading}
              className={`study-btn study-btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {step === 1 ? 'Next Step' : loading ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
