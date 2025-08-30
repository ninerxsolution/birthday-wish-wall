'use client';

import { useState, useEffect } from 'react';
import WishCard from './WishCard';
import Link from 'next/link';
import { Wish, Reply } from '@prisma/client';

type WishWithReplies = Wish & { replies: Reply[] };

export default function WishWall() {
  const [wishes, setWishes] = useState<WishWithReplies[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const response = await fetch('/api/wishes');
      if (response.ok) {
        const data = await response.json();
        setWishes(data);
      }
    } catch (error) {
      console.error('Error fetching wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎂</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          No wishes yet
        </h3>
        <p className="text-gray-500 mb-6">
          Be the first to leave a birthday wish!
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          Leave a Wish
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-900">
          Birthday Wishes ({wishes.length})
        </h3>
        <Link
          href="/submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          + Add Wish
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishes.map((wish) => (
          <WishCard key={wish.id} wish={wish} onUpdate={fetchWishes} />
        ))}
      </div>
    </div>
  );
}
