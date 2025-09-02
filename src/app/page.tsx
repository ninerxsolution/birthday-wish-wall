import WishWall from '@/components/WishWall';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          กระดานคำอวยพรวันเกิด! 🎉
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          ขอบคุณที่แวะมานะครับ!
        </p>
      </div>
      
      <WishWall />
    </div>
  );
}
