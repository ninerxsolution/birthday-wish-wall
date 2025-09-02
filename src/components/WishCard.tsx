'use client';

import { useState } from 'react';
import { Wish, Reply } from '@prisma/client';
import { Heart, MessageCircle, Reply as ReplyIcon } from 'lucide-react';

type WishWithReplies = Wish & { replies: Reply[] };

interface WishCardProps {
  wish: WishWithReplies;
  onUpdate: () => void;
}

export default function WishCard({ wish, onUpdate }: WishCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wishId: wish.id,
          message: replyMessage,
        }),
      });

      if (response.ok) {
        setReplyMessage('');
        setShowReplyForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {wish.name ? wish.name.charAt(0).toUpperCase() : '🎂'}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {wish.name || 'Anonymous'}
              </h4>
              <p className="text-sm text-gray-500">
                {formatDate(wish.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-pink-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{wish.message}</p>
      </div>

      {/* Replies Section */}
      {wish.replies.length > 0 && (
        <div className="border-t pt-4 mb-4">
          <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            คำตอบ ({wish.replies.length})
          </h5>
          <div className="space-y-3">
            {wish.replies.map((reply) => (
              <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    👑
                  </div>
                  <span className="text-sm font-medium text-gray-700">คุณ</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(reply.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{reply.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply Form */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          <ReplyIcon className="w-4 h-4" />
          ตอบกลับ
        </button>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-3">
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="เขียนคำตอบของคุณ..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำตอบ'}
              </button>
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
