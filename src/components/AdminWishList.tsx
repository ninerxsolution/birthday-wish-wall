'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, MessageCircle, Reply, Clock } from 'lucide-react';
import Toast, { ToastType, Toast as ToastInterface } from './Toast';

type AdminWish = {
  id: string;
  name: string | null;
  message: string;
  createdAt: string;
  replies?: Array<{
    id: string;
    message: string;
    createdAt: string;
  }>;
};

export default function AdminWishList() {
  const [wishes, setWishes] = useState<AdminWish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replying, setReplying] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastInterface[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchWishes = async () => {
    try {
      setError(null);
      const res = await fetch('/api/wishes');
      if (!res.ok) {
        throw new Error('Failed to fetch wishes');
      }
      const data = await res.json();
      setWishes(data);
    } catch (error) {
      console.error('Error fetching wishes:', error);
      setError('โหลดคำอวยพรไม่สำเร็จ กรุณาลองใหม่อีกครั้งค่ะ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const sendReply = async (wishId: string) => {
    if (!reply.trim()) return;
    
    setSubmittingReply(wishId);
    try {
      const res = await fetch('/api/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishId, message: reply })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send reply');
      }
      
      setReply('');
      setReplying(null);
      addToast('success', 'ส่งคำตอบสำเร็จแล้ว!');
      await fetchWishes(); // Refresh to show updated state
    } catch (error) {
      console.error('Error submitting reply:', error);
      addToast('error', error instanceof Error ? error.message : 'ส่งคำตอบไม่สำเร็จ');
    } finally {
      setSubmittingReply(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        <p className="text-gray-600">กำลังโหลดคำอวยพร...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          โหลดคำอวยพรไม่สำเร็จ
        </h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={fetchWishes}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          ลองใหม่
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">คำอวยพร</h2>
            <p className="text-sm text-gray-600 mt-1">
              {wishes.length} คำอวยพรทั้งหมด • {wishes.filter(w => w.replies && w.replies.length > 0).length} มีคำตอบ • {wishes.filter(w => !w.replies || w.replies.length === 0).length} ยังไม่มีคำตอบ
            </p>
            <p className="text-xs text-purple-600 mt-1">
              เรียงลำดับ: ยังไม่มีคำตอบขึ้นก่อน • ใหม่ล่าสุดขึ้นก่อน
            </p>
          </div>
          <button
            onClick={fetchWishes}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </button>
        </div>

        {wishes.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ยังไม่มีคำอวยพรเลย</p>
          </div>
        )}

        <ul className="divide-y divide-gray-200">
          {wishes.map(w => (
            <li key={w.id} className={`py-6 ${(!w.replies || w.replies.length === 0) ? 'bg-orange-50/50 px-4 -mx-4 rounded-lg' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {w.name || 'Anonymous'}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(w.createdAt)}
                    </span>
                    {(!w.replies || w.replies.length === 0) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <Clock className="w-3 h-3 mr-1" />
                        ยังไม่มีคำตอบ
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{w.message}</p>
                  
                  {/* Show existing replies */}
                  {w.replies && w.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-purple-200">
                      <p className="text-xs font-medium text-purple-600 mb-2 flex items-center gap-1">
                        <Reply className="w-3 h-3" />
                        คำตอบของคุณ ({w.replies.length})
                      </p>
                      {w.replies.map((reply) => (
                        <div key={reply.id} className="mb-2 p-2 bg-purple-50 rounded text-sm">
                          <p className="text-gray-700">{reply.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setReplying(replying === w.id ? null : w.id)}
                  disabled={submittingReply === w.id}
                  className="ml-4 inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50 transition-colors"
                >
                  {replying === w.id ? (
                    <>
                      <Reply className="w-4 h-4 mr-1" />
                      ยกเลิก
                    </>
                  ) : (
                    <>
                      <Reply className="w-4 h-4 mr-1" />
                      ตอบกลับ
                    </>
                  )}
                </button>
              </div>
              
              {replying === w.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="เขียนคำตอบของคุณ..."
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {reply.length}/1000 ตัวอักษร
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReplying(null)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        ยกเลิก
                      </button>
                      <button
                        onClick={() => sendReply(w.id)}
                        disabled={!reply.trim() || submittingReply === w.id}
                        className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      >
                        {submittingReply === w.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                            กำลังส่ง...
                          </>
                        ) : (
                          'ส่งคำตอบ'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </>
  );
}


