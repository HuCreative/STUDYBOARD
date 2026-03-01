export const apiClient = {
  async getQuestions(params: { tag?: string; sort?: string; search?: string } = {}) {
    const query = new URLSearchParams();
    if (params.tag) query.append('tag', params.tag);
    if (params.sort) query.append('sort', params.sort);
    if (params.search) query.append('search', params.search);
    
    const res = await fetch(`/api/questions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch questions');
    return res.json();
  },

  async getQuestion(id: number) {
    const res = await fetch(`/api/questions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch question');
    return res.json();
  },

  async createQuestion(data: { title: string; body: string; tag: string; author: string; honeypot?: string; startTime: number }) {
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create question');
    }
    return res.json();
  },

  async voteQuestion(id: number) {
    const res = await fetch(`/api/questions/${id}/vote`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to vote');
    return res.json();
  },

  async postAnswer(questionId: number, data: { body: string; author: string; honeypot?: string; startTime: number }) {
    const res = await fetch(`/api/questions/${questionId}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to post answer');
    }
    return res.json();
  },

  async voteAnswer(id: number) {
    const res = await fetch(`/api/answers/${id}/vote`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to vote');
    return res.json();
  },

  async acceptAnswer(id: number) {
    const res = await fetch(`/api/answers/${id}/accept`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to accept answer');
    return res.json();
  },

  async getStats() {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
