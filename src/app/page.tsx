import WishWall from '@/components/WishWall';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to My Birthday Wish Wall! 🎉
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Thank you for visiting! Here you can see all the wonderful birthday wishes 
          from friends and family. Feel free to leave your own wish too!
        </p>
      </div>
      
      <WishWall />
    </div>
  );
}
