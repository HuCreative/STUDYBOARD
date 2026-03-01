'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar({ onAskClick }: { onAskClick: () => void }) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="bg-[#111] border-b-[3px] border-accent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="font-playfair text-white text-2xl font-black tracking-tighter">
                STUDY<span className="text-accent">BOARD</span>
              </span>
            </Link>
            
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#222] text-white font-mono text-xs px-4 py-2 pl-10 w-64 border-none focus:ring-1 focus:ring-accent outline-none"
              />
              <Search className="absolute left-3 w-4 h-4 text-gray-500" />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onAskClick}
              className="study-btn study-btn-primary"
            >
              Ask Question
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
