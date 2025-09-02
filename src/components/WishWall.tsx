'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, AlertCircle, Heart } from 'lucide-react';

type WallWish = {
  id: string;
  avatarUrl: string | null;
  revealed: boolean;
  message?: string;
  replies: {
    id: string;
    message: string;
    createdAt: string;
  }[];
};

export default function WishWall() {
  const [wishes, setWishes] = useState<WallWish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWall();
  }, []);

  const fetchWall = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }
    
    try {
      setError(null);
      const response = await fetch('/api/wall');
      if (response.ok) {
        const data = await response.json();
        setWishes(data.wishes);
      } else {
        throw new Error('Failed to fetch wishes');
      }
    } catch (error) {
      console.error('Error fetching wall:', error);
      setError('Failed to load birthday wishes. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchWall(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        <p className="text-gray-600">Loading birthday wishes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😔</div>
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {error}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {refreshing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </>
            )}
          </button>
          <Link
            href="/submit"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Leave a Wish
          </Link>
        </div>
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎂</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          No wishes yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Be the first to leave a birthday wish and make this birthday extra special!
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <Heart className="w-5 h-5 mr-2" />
          Leave a Wish
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Birthday Wishes ({wishes.length})
          </h3>
          <p className="text-gray-600 mt-1">
            {wishes.filter(w => w.revealed).length} revealed, {wishes.filter(w => !w.revealed).length} awaiting reply
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            href="/submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            + Add Wish
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishes.map((w) => (
          <div key={w.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white shadow-md">
                {w.avatarUrl && (w.avatarUrl.startsWith('http://') || w.avatarUrl.startsWith('https://')) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">{w.avatarUrl || '🎂'}</span>
                )}
              </div>
              <div className="flex-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  w.revealed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {w.revealed ? '✨ Revealed' : '⏳ Awaiting reply'}
                </span>
              </div>
            </div>

            {w.revealed ? (
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {w.message}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Heart className="w-3 h-3 mr-1 text-pink-500" />
                  Message revealed
                </div>
              </div>
            ) : (
              <div className="h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <div className="text-2xl mb-1">🔒</div>
                  Message hidden until reply
                </div>
              </div>
            )}

            {/* Reply Messages Section */}
            {w.replies && w.replies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Replies ({w.replies.length})
                </h4>
                <div className="space-y-3">
                  {w.replies.map((reply) => (
                    <div key={reply.id} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {reply.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-blue-600">
                          <Heart className="w-3 h-3 mr-1" />
                          Reply
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
