'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/api/client';

export default function StatsBar() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    apiClient.getStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return null;

  const items = [
    { label: 'Questions', value: stats.totalQuestions },
    { label: 'Answers', value: stats.totalAnswers },
    { label: 'Subjects', value: stats.totalSubjects },
    { label: 'Views', value: stats.totalViews.toLocaleString() }
  ];

  return (
    <div className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center gap-8">
          {items.map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="font-playfair text-2xl font-black text-accent">{item.value}</span>
              <span className="mono-label text-text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
