import WishWall from '@/components/WishWall';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          ยินดีต้อนรับสู่กำแพงคำอวยพรวันเกิดของเรา! 🎉
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          ขอบคุณที่แวะมาค่ะ! ที่นี่คุณจะได้เห็นคำอวยพรวันเกิดสุดน่ารัก 
          จากเพื่อน ๆ และครอบครัว และอย่าลืมฝากคำอวยพรของคุณเองด้วยนะคะ!
        </p>
      </div>
      
      <WishWall />
    </div>
  );
}
