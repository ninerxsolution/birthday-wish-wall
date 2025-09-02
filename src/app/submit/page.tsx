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
          Wish Submitted!
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your birthday wish! It will appear on the wall shortly.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>Tip:</strong> Your wish will be hidden until the birthday person replies to it.
          </p>
        </div>
        <p className="text-sm text-gray-500">
          Redirecting to the wish wall in 3 seconds...
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-sm text-purple-600 hover:text-purple-700 underline"
        >
          Go now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎂</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Leave a Birthday Wish
        </h1>
        <p className="text-lg text-gray-600">
          Share your warm wishes and make this birthday extra special!
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose an avatar</label>
            <div className="space-y-4">
              {/* Custom Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Custom Image</label>
                <ImageUploader
                  onImageSelect={setCustomImage}
                  currentImage={customImage}
                  className="max-w-xs"
                />
              </div>
              
              {/* Emoji Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Or choose an emoji</label>
                <div className="grid grid-cols-8 gap-2">
                  {['🎉','🎂','🎈','🎁','✨','💖','🌟','🥳','😊','😄','😎','🤗','🌈','🍰','🍩','🍓','🍬','🍀','🦄','🐶','🐱','🐼','🦊','🦋'].map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        setEmoji(e);
                        setCustomImage(null); // Clear custom image when emoji is selected
                      }}
                      className={`h-10 w-10 rounded-md flex items-center justify-center text-xl border transition-all ${
                        (emoji === e && !customImage) ? 'border-purple-600 ring-2 ring-purple-200 scale-110' : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                      }`}
                      aria-label={`Select ${e}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                                 <p className="text-xs text-gray-500 mt-2">
                   Your avatar appears on the wall; your name stays hidden. 
                   Images are automatically compressed for optimal performance.
                 </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              placeholder="Enter your name or leave anonymous"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.name.length}/100 characters
            </p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Birthday Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors"
              placeholder="Write your birthday wish here..."
              rows={6}
              required
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-gray-500">
                  Share your heartfelt wishes, memories, or just a simple &ldquo;Happy Birthday!&rdquo;
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
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Wish
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2 inline" />
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Your wish will be displayed publicly on the birthday wall</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            <p>• One wish per person (enforced)</p>
            <p>• Messages are hidden until the birthday person replies</p>
            <p>• Your name is optional and won&apos;t be displayed publicly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
