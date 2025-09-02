'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Users, Edit3, Trash2, Save, X } from 'lucide-react';
import Toast, { ToastType, Toast as ToastInterface } from './Toast';
import ImageUploader from './ImageUploader';

type Friend = {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  wish?: {
    id: string;
    message: string;
    revealed: boolean;
  };
};

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', avatarUrl: '' });
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastInterface[]>([]);

  const addToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchFriends = async () => {
    try {
      setError(null);
      const res = await fetch('/api/admin/friends');
      if (!res.ok) {
        throw new Error('Failed to fetch friends');
      }
      const data = await res.json();
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('โหลดรายชื่อเพื่อนไม่สำเร็จ กรุณาลองใหม่อีกครั้งค่ะ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const startEdit = (friend: Friend) => {
    setEditing(friend.id);
    setEditForm({ name: friend.name, avatarUrl: friend.avatarUrl || '' });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({ name: '', avatarUrl: '' });
  };

  const saveEdit = async (friendId: string) => {
    if (!editForm.name.trim()) return;
    
    setSaving(friendId);
    try {
      const res = await fetch(`/api/admin/friends/${friendId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update friend');
      }
      
      setEditing(null);
      setEditForm({ name: '', avatarUrl: '' });
      addToast('success', 'อัปเดตเพื่อนสำเร็จแล้ว!');
      await fetchFriends();
    } catch (error) {
      console.error('Error updating friend:', error);
      addToast('error', error instanceof Error ? error.message : 'อัปเดตเพื่อนไม่สำเร็จ');
    } finally {
      setSaving(null);
    }
  };

  const deleteFriend = async (friendId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเพื่อนคนนี้? การกระทำนี้จะลบคำอวยพรของเขาด้วย')) {
      return;
    }
    
    setDeleting(friendId);
    try {
      const res = await fetch(`/api/admin/friends/${friendId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete friend');
      }
      
      addToast('success', 'ลบเพื่อนสำเร็จแล้ว!');
      await fetchFriends();
    } catch (error) {
      console.error('Error deleting friend:', error);
      addToast('error', 'ลบเพื่อนไม่สำเร็จ กรุณาลองใหม่อีกครั้งค่ะ');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-16 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        <p className="text-gray-600">กำลังโหลดรายชื่อเพื่อน...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          โหลดรายชื่อเพื่อนไม่สำเร็จ
        </h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={fetchFriends}
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
            <h2 className="text-xl font-semibold text-gray-900">เพื่อน</h2>
            <p className="text-sm text-gray-600 mt-1">
              {friends.length} เพื่อนทั้งหมด • {friends.filter(f => f.wish).length} มีคำอวยพร
            </p>
          </div>
          <button
            onClick={fetchFriends}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </button>
        </div>

        {friends.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">ยังไม่มีเพื่อนเลย</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  อวตาร
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะคำอวยพร
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สร้างเมื่อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {friends.map((friend) => (
                <tr key={friend.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editing === friend.id ? (
                      <ImageUploader
                        onImageSelect={(url) => setEditForm({ ...editForm, avatarUrl: url })}
                        currentImage={editForm.avatarUrl}
                        className="w-20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white shadow-md">
                        {friend.avatarUrl && (friend.avatarUrl.startsWith('http://') || friend.avatarUrl.startsWith('https://')) ? (
                          <img src={friend.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">{friend.avatarUrl || '🎂'}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editing === friend.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="border rounded px-2 py-1 w-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        maxLength={100}
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{friend.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {friend.wish ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        friend.wish.revealed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {friend.wish.revealed ? '✨ แสดงแล้ว' : '⏳ ซ่อนอยู่'}
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        ไม่มีคำอวยพร
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(friend.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editing === friend.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => saveEdit(friend.id)}
                          disabled={saving === friend.id || !editForm.name.trim()}
                          className="inline-flex items-center text-green-600 hover:text-green-900 disabled:opacity-50 transition-colors"
                        >
                          {saving === friend.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-1"></div>
                              กำลังบันทึก...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-1" />
                              บันทึก
                            </>
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          ยกเลิก
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(friend)}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          แก้ไข
                        </button>
                        <button
                          onClick={() => deleteFriend(friend.id)}
                          disabled={deleting === friend.id}
                          className="inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
                        >
                          {deleting === friend.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                              กำลังลบ...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" />
                              ลบ
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
