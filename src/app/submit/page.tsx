'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

export default function SubmitWish() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', // optional display name; will be phased out after avatars
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [friendId, setFriendId] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string>('🎉');
  const [customImage, setCustomImage] = useState<string | null>(null);

  // One-wish client guard: redirect if already submitted
  useEffect(() => {
    const existing = localStorage.getItem('wish-submitted');
    if (existing) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: ensure we have a friend profile (for now create lightweight profile with name only)
      let currentFriendId = friendId;
      if (!currentFriendId) {
        const friendRes = await fetch('/api/friends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name || 'Friend',
            avatarUrl: customImage || emoji
          })
        });
        if (!friendRes.ok) {
          const errorData = await friendRes.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to create friend profile');
        }
        const friendData = await friendRes.json();
        currentFriendId = friendData.friendId as string;
        setFriendId(currentFriendId);
      }

      // Step 2: create wish linked to friend
      const wishRes = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: formData.message, friendId: currentFriendId, name: formData.name })
      });
      if (!wishRes.ok) {
        const err = await wishRes.json().catch(() => ({}));
        if (wishRes.status === 409) {
          // already submitted; set flag and route
          localStorage.setItem('wish-submitted', String(currentFriendId));
          router.replace('/');
          return;
        }
        throw new Error(err.error || 'Failed to create wish');
      }

      // Step 3: thank you + local flag + redirect handled below
      localStorage.setItem('wish-submitted', String(currentFriendId));
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting wish:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit wish. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ส่งคำอวยพรสำเร็จแล้ว!
        </h2>
        <p className="text-gray-600 mb-4">
          ขอบคุณสำหรับคำอวยพรวันเกิดนะคะ! จะปรากฏบนกำแพงเร็ว ๆ นี้เลยค่ะ
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>เคล็ดลับ:</strong> คำอวยพรของคุณจะถูกซ่อนไว้จนกว่าคนวันเกิดจะตอบกลับค่ะ
          </p>
        </div>
        <p className="text-sm text-gray-500">
          กำลังพาไปที่กำแพงคำอวยพรใน 3 วินาที...
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-sm text-purple-600 hover:text-purple-700 underline"
        >
          ไปเลย
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎂</div>
        <img src="https://scontent.fbkk5-6.fna.fbcdn.net/v/t39.30808-6/490694023_2173736456396493_7439228124013840998_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=m5zpdc1tc6kQ7kNvwHD3i7J&_nc_oc=Adlzvd5elyN0rzPB11rBqzu8Bl8RUixc0ZtgplpYR_aDa3AHyaQBEjLxPwtJzvHa7Co&_nc_zt=23&_nc_ht=scontent.fbkk5-6.fna&_nc_gid=h20VwgrbGw0vJqfxrX3QBg&oh=00_AfW7xKP_fCzKlj1_U6p2YdJeNU79b1cHcDFZIEe5wnAxdw&oe=68BCF69E" alt="Boy" className="w-57 h-57 mx-auto mb-4 mt-4 rounded-xl" />
        <b className='text-lg text-gray-600'>เด็กชายมัทราวุธ เมียดมอ เกิดวันที่ 3 กันยายน</b> <br></br>
        <b className='text-lg text-gray-600'>อายุ 23 ปี บรีบูรณ์ ณ today</b>

      </div>

      <div className="bg-white rounded-4xl border-2 border-gray-600 shadow-md p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-4xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className='text-center'>
              <h1 className="text-cetner text-3xl font-bold text-gray-900 mb-2">
                ฝากคำอวยพรวันเกิดให้เด็กชายคนนี้
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                เขียนคำอวยพรสุดอบอุ่นและหล่อเท่ของคุณ ทำให้วันเกิดของผมนี้พิเศษขึ้นไปอีก!
              </p>
            </div>
            <div className="mb-6 mt-4 h-1 w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
            <label className="block text-sm font-bold text-gray-700 mb-2">เลือกรูปโปรไฟล์</label>
            <div className="space-y-4">
              {/* Custom Image Upload */}
              <div>
                <ImageUploader
                  onImageSelect={setCustomImage}
                  currentImage={customImage}
                  className={`max-w-xs mx-auto ${customImage ? 'flex justify-center' : ''}`}
                />
              </div>

              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">หรือเลือกอีโมจิแทนก็ได้นะ</label>
                <div className="flex flex-wrap align-center justify-center gap-2">
                  {['🎉', '🎂', '🎈', '🎁', '✨', '💖', '🌟', '🥳', '😊', '😄', '😎', '🤗', '🌈', '🍰', '🍩', '🍓', '🍬', '🍀', '🦄', '🐶', '🐱', '🐼', '🦊', '🦋'].map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        setEmoji(e);
                        setCustomImage(null); // Clear custom image when emoji is selected
                      }}
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-xl border transition-all ${(emoji === e && !customImage) ? 'border-purple-600 ring-2 ring-purple-200 scale-110' : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                        }`}
                      aria-label={`Select ${e}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  รูปหรืออีโมจิของเจ้าจะไปแสดงบนกระดานคำอวยพร เพราะงั้น แอ็คไว้นะ
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
              ชื่อ (ไม่บังคับ ใส่ก็ได้ ไม่ใส่ก็ ใส่หน่อยเถอะนะ ขอล่ะ)
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-black placeholder:text-gray-500"
              placeholder="ใส่มาสิ ใส่มาตรงนี้เลย ชื่อของแกน่ะ"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.name.length}/100 ตัวอักษร ถ้าเกินเดี๋ยวตีมือ
            </p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
              คำอวยพร <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors text-black placeholder:text-gray-500"
              placeholder="เขียนคำอวยพร..."
              rows={6}
              required
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-500">
                มอบคำอวยพรจากใจ ความทรงจำ หรือแค่คำง่าย ๆ ว่า &ldquo;สุขสันต์วันเกิด!&rdquo;
              </p>
              <p className="text-xs text-gray-400">
                {formData.message.length}/1000
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-4xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  ส่งคำอวยพรให้ฉันคนนี้
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>คำอวยพรจะแสดงสาธารณะบนกระดานคำอวยพร</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            <p>• หนึ่งคำอวยพรต่อคน (บังคับ)</p>
            <p>• ข้อความจะถูกซ่อนจนกว่าฉันจะตอบกลับ</p>
            <p>• ชื่อของคุณไม่บังคับและจะไม่แสดงสาธารณะ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
