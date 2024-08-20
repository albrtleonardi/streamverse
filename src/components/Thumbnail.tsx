import React, { useRef } from 'react';
import Place1 from '@/assets/place1.webp';
import Place2 from '@/assets/place2.jpg';
import Place3 from '@/assets/place3.jpg';
import Place4 from '@/assets/place4.jpg';

const ThumbnailCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <button
        className="absolute left-0 z-10 px-4 py-2 text-white bg-gray-800 hover:bg-gray-900"
        onClick={scrollLeft}
      >
        &lt;
      </button>

      <div
        ref={carouselRef}
        className="thumbnail flex gap-4 overflow-x-auto scroll-smooth whitespace-nowrap"
      >
        <div className={currentIndex === 0 ? 'item active' : 'item'} onClick={() => handleThumbnailClick(0)}>
          <img className="w-full h-full object-cover rounded-xl" src={Place1}></img>
          <div className="absolute text-white bottom-4 left-4 right-2">
            <div className="title font-bold">Taka</div>
          </div>
        </div>
        <div className={currentIndex === 1 ? 'item active' : 'item'} onClick={() => handleThumbnailClick(1)}>
          <img className="w-full h-full object-cover rounded-xl" src={Place2}></img>
          <div className="absolute text-white bottom-4 left-4 right-2">
            <div className="title font-bold">Komodo</div>
          </div>
        </div>
        <div className={currentIndex === 2 ? 'item active' : 'item'} onClick={() => handleThumbnailClick(2)}>
          <img className="w-full h-full object-cover rounded-xl" src={Place3}></img>
          <div className="absolute text-white bottom-4 left-4 right-2">
            <div className="title font-bold">Padar</div>
          </div>
        </div>
        <div className={currentIndex === 3 ? 'item active' : 'item'} onClick={() => handleThumbnailClick(3)}>
          <img className="w-full h-full object-cover rounded-xl" src={Place4}></img>
          <div className="absolute text-white bottom-4 left-4 right-2">
            <div className="title font-bold">Pink</div>
          </div>
        </div>
      </div>

      <button
        className="absolute right-0 z-10 px-4 py-2 text-white bg-gray-800 hover:bg-gray-900"
        onClick={scrollRight}
      >
        &gt;
      </button>
    </div>
  );
};

export default ThumbnailCarousel;
