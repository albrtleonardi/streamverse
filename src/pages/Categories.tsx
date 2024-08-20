import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@/components/ui/showmore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Place1 from "@/assets/place1.webp";
import Place2 from "@/assets/place2.jpg";
import Place3 from "@/assets/place3.jpg";
import Place4 from "@/assets/place4.jpg";
import MainLayout from "@/layouts/MainLayout";

const videos = [
  {
    title: "Video Title 1",
    thumbnail: Place1,
    author: "Author 1",
    views: "1M views",
    time: "1 week ago",
    category: "Category 1",
  },
  {
    title: "Video Title 2",
    thumbnail: Place2,
    author: "Author 2",
    views: "500K views",
    time: "2 days ago",
    category: "Category 1",
  },
  {
    title: "Video Title 3",
    thumbnail: Place3,
    author: "Author 3",
    views: "800K views",
    time: "3 days ago",
    category: "Category 1",
  },
  {
    title: "Video Title 4",
    thumbnail: Place4,
    author: "Author 4",
    views: "900K views",
    time: "5 days ago",
    category: "Category 1",
  },
  {
    title: "Video Title 5",
    thumbnail: Place1,
    author: "Author 5",
    views: "1.2M views",
    time: "1 day ago",
    category: "Category 2",
  },
  {
    title: "Video Title 6",
    thumbnail: Place2,
    author: "Author 6",
    views: "300K views",
    time: "6 days ago",
    category: "Category 2",
  },
  {
    title: "Video Title 7",
    thumbnail: Place3,
    author: "Author 7",
    views: "900K views",
    time: "1 week ago",
    category: "Category 2",
  },
  {
    title: "Video Title 8",
    thumbnail: Place4,
    author: "Author 8",
    views: "700K views",
    time: "2 days ago",
    category: "Category 2",
  },
  {
    title: "Video Title 5",
    thumbnail: Place1,
    author: "Author 5",
    views: "1.2M views",
    time: "1 day ago",
    category: "Category 2",
  },
  {
    title: "Video Title 6",
    thumbnail: Place2,
    author: "Author 6",
    views: "300K views",
    time: "6 days ago",
    category: "Category 2",
  },
  {
    title: "Video Title 7",
    thumbnail: Place3,
    author: "Author 7",
    views: "900K views",
    time: "1 week ago",
    category: "Category 2",
  },
  {
    title: "Video Title 8",
    thumbnail: Place4,
    author: "Author 8",
    views: "700K views",
    time: "2 days ago",
    category: "Category 2",
  },
  {
    title: "Video Title 5",
    thumbnail: Place1,
    author: "Author 5",
    views: "1.2M views",
    time: "1 day ago",
    category: "Category 2",
  },
  {
    title: "Video Title 6",
    thumbnail: Place2,
    author: "Author 6",
    views: "300K views",
    time: "6 days ago",
    category: "Category 2",
  },
  {
    title: "Video Title 7",
    thumbnail: Place3,
    author: "Author 7",
    views: "900K views",
    time: "1 week ago",
    category: "Category 2",
  },
  {
    title: "Video Title 8",
    thumbnail: Place4,
    author: "Author 8",
    views: "700K views",
    time: "2 days ago",
    category: "Category 2",
  },
  {
    title: "Video Title 9",
    thumbnail: Place1,
    author: "Author 9",
    views: "1M views",
    time: "1 week ago",
    category: "Category 1",
  },
  {
    title: "Video Title 10",
    thumbnail: Place2,
    author: "Author 10",
    views: "500K views",
    time: "2 days ago",
    category: "Category 1",
  },
  {
    title: "Video Title 11",
    thumbnail: Place3,
    author: "Author 11",
    views: "800K views",
    time: "3 days ago",
    category: "Category 1",
  },
  {
    title: "Video Title 12",
    thumbnail: Place4,
    author: "Author 12",
    views: "900K views",
    time: "5 days ago",
    category: "Category 1",
  },
  {
    title: "Video Title 9",
    thumbnail: Place1,
    author: "Author 9",
    views: "1M views",
    time: "1 week ago",
    category: "Category 3",
  },
  {
    title: "Video Title 10",
    thumbnail: Place2,
    author: "Author 10",
    views: "500K views",
    time: "2 days ago",
    category: "Category 3",
  },
  {
    title: "Video Title 11",
    thumbnail: Place3,
    author: "Author 11",
    views: "800K views",
    time: "3 days ago",
    category: "Category 3",
  },
  {
    title: "Video Title 12",
    thumbnail: Place4,
    author: "Author 12",
    views: "900K views",
    time: "5 days ago",
    category: "Category 3",
  },
  {
    title: "Video Title 10",
    thumbnail: Place2,
    author: "Author 10",
    views: "500K views",
    time: "2 days ago",
    category: "Category 3",
  },
  {
    title: "Video Title 11",
    thumbnail: Place3,
    author: "Author 11",
    views: "800K views",
    time: "3 days ago",
    category: "Category 3",
  },
  {
    title: "Video Title 12",
    thumbnail: Place4,
    author: "Author 12",
    views: "900K views",
    time: "5 days ago",
    category: "Category 3",
  },
  {
    title: "Video Title 9",
    thumbnail: Place1,
    author: "Author 9",
    views: "1M views",
    time: "1 week ago",
    category: "Category 4",
  },
  {
    title: "Video Title 10",
    thumbnail: Place2,
    author: "Author 10",
    views: "500K views",
    time: "2 days ago",
    category: "Category 4",
  },
  {
    title: "Video Title 11",
    thumbnail: Place3,
    author: "Author 11",
    views: "800K views",
    time: "3 days ago",
    category: "Category 4",
  },
  {
    title: "Video Title 12",
    thumbnail: Place4,
    author: "Author 12",
    views: "900K views",
    time: "5 days ago",
    category: "Category 4",
  },
];

const Categories: React.FC = () => {
  const initialVisibleCount = 4;
  const [visibleCounts, setVisibleCounts] = useState<{ [key: string]: number }>(
    {
      "Category 1": initialVisibleCount,
      "Category 2": initialVisibleCount,
      "Category 3": initialVisibleCount,
      "Category 4": initialVisibleCount,
    }
  );

  const handleShowMore = (category: string) => {
    setVisibleCounts((prevCounts) => ({
      ...prevCounts,
      [category]: prevCounts[category] + initialVisibleCount,
    }));
  };

  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"];

  return (
    <MainLayout>
      <div className="p-4">
        {categories.map((category) => {
          const filteredVideos = videos.filter(
            (video) => video.category === category
          );
          const visibleVideos = filteredVideos.slice(
            0,
            visibleCounts[category]
          );
          const isOpen = visibleCounts[category] > initialVisibleCount; // Determines if content is open

          return (
            <div key={category} className="relative">
              <h2 className="mt-4 text-2xl font-bold mb-4">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleVideos.map((video, index) => (
                  <div key={index} className="bg-transparent overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-2">
                      <h2 className="text-lg font-semibold">{video.title}</h2>
                      <div className="flex items-center mt-1">
                        <Avatar>
                          <AvatarImage
                            src="https://via.placeholder.com/50"
                            alt={video.author}
                          />
                          <AvatarFallback>{video.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="text-gray-600">{video.author}</p>
                          <p className="text-gray-500 text-sm">
                            {video.views} • {video.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredVideos.length > visibleCounts[category] && (
                <div className="mt-6 flex items-center">
                  <div className="flex-1">
                    <hr className="border-gray-300" />
                  </div>
                  <div className="relative mx-4">
                    <Button
                      onClick={() => handleShowMore(category)}
                      className="relative z-10 bg-transparent text-gray-800 font-medium py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
                    >
                      {isOpen ? (
                        <ChevronUpIcon className="mr-2" />
                      ) : (
                        <ChevronDownIcon className="mr-2" />
                      )}
                      Show More
                    </Button>
                  </div>
                  <div className="flex-1">
                    <hr className="border-gray-300" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
};

export default Categories;
