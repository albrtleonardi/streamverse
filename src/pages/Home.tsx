import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Place1 from "@/assets/place1.webp";
import Place2 from "@/assets/place2.jpg";
import Place3 from "@/assets/place3.jpg";
import Place4 from "@/assets/place4.jpg";
import MainLayout from "@/layouts/MainLayout";
import LiveVideoCard from "@/components/LiveVideoCard";
import { Wifi } from "react-feather";
import Thumbnail from "@/components/Thumbnail";
import "@/layouts/page.css";
import { BASE_URL } from "@/config/constants";
import { useEffect, useState } from "react";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import { Stream } from "@/types/StreamsType";

const Home: React.FC = () => {
  const [streams, setStreams] = useState<Stream[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStreams = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Stream[]>(`${BASE_URL}/stream`);
        console.log("Fetched streams:", response.data);
        setStreams(response.data);
      } catch (error) {
        console.error("Error fetching streams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStreams();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const nextRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };
  const navigate = useNavigate();

  const showSlider = (type: string) => {
    let newIndex;
    if (type === "next") {
      newIndex = currentIndex === 3 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? 3 : currentIndex - 1;
    }
    setCurrentIndex(newIndex);
  };

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -150, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  return (
    <MainLayout>
      <div className="grid-cols-12">
        <section className="m-0 p-0">
          <div className="flex flex-wrap mx-auto ">
            <div className="w-full">
              <div className="relative h-[60vh] sm:h[100vh] mt-0 p-0 carousel">
                <div className="list">
                  <div
                    className={
                      currentIndex === 0
                        ? "item active"
                        : "absoulte inset-0 w-full h-full"
                    }
                  >
                    <img
                      className="w-full h-full object-cover overflow-hidden"
                      src={Place1}
                    ></img>
                    <div
                      className="absolute w-[90%] max-w-full left-1/2 transform -translate-x-1/2 box-border text-white "
                      style={{
                        paddingRight: "50%",
                        paddingLeft: "1%",
                        top: "40%",
                      }}
                    >
                      <div style={{ fontWeight: "bold", letterSpacing: "2px" }}>
                        Game Category
                      </div>
                      <div
                        className="title"
                        style={{
                          fontSize: "3.5em",
                          fontWeight: "bold",
                          lineHeight: "1.3em",
                        }}
                      >
                        James Dillon{" "}
                      </div>
                      <div className="des" style={{ fontSize: 20 }}>
                        1 on 1 Death Match Valorant Tournament
                      </div>
                      <div>
                        <div className="flex pt-2 items-center">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className="p-4">James Dillon Gaming </div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button
                          className="w-1/3"
                          variant={"secondary"}
                          onClick={() => navigate("/stream/wongsodillon")}
                        >
                          Watch
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      currentIndex === 1
                        ? "item active"
                        : "absoulte inset-0 w-full h-full"
                    }
                  >
                    <img
                      className="w-full h-full object-cover overflow-hidden"
                      src={Place2}
                    ></img>
                    <div
                      className="content absolute w-[90%] max-w-full left-1/2 transform -translate-x-1/2 box-border text-white "
                      style={{
                        paddingRight: "50%",
                        paddingLeft: "1%",
                        top: "40%",
                      }}
                    >
                      <div style={{ fontWeight: "bold", letterSpacing: "2px" }}>
                        Game Category
                      </div>
                      <div
                        className="title"
                        style={{
                          fontSize: "3.5em",
                          fontWeight: "bold",
                          lineHeight: "1.3em",
                        }}
                      >
                        James Dillon{" "}
                      </div>
                      <div className="des" style={{ fontSize: 20 }}>
                        1 on 1 Death Match Valorant Tournament.
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      currentIndex === 2
                        ? "item active"
                        : "absoulte inset-0 w-full h-full"
                    }
                  >
                    <img
                      className="w-full h-full object-cover overflow-hidden"
                      src={Place3}
                    ></img>
                    <div
                      className="content absolute w-[90%] max-w-full left-1/2 transform -translate-x-1/2 box-border text-white "
                      style={{
                        paddingRight: "50%",
                        paddingLeft: "1%",
                        top: "40%",
                      }}
                    >
                      <div style={{ fontWeight: "bold", letterSpacing: "2px" }}>
                        Game Category
                      </div>
                      <div
                        className="title"
                        style={{
                          fontSize: "3.5em",
                          fontWeight: "bold",
                          lineHeight: "1.3em",
                        }}
                      >
                        James Dillon{" "}
                      </div>
                      <div className="des" style={{ fontSize: 20 }}>
                        1 on 1 Death Match Valorant Tournament
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      currentIndex === 3
                        ? "item active"
                        : "absoulte inset-0 w-full h-full"
                    }
                  >
                    <img
                      className="w-full h-full object-cover overflow-hidden"
                      src={Place4}
                    ></img>
                    <div
                      className="content absolute w-[90%] max-w-full left-1/2 transform -translate-x-1/2 box-border text-white  "
                      style={{
                        paddingRight: "50%",
                        paddingLeft: "1%",
                        top: "40%",
                      }}
                    >
                      <div style={{ fontWeight: "bold", letterSpacing: "2px" }}>
                        Game Category
                      </div>
                      <div
                        className="title"
                        style={{
                          fontSize: "3.5em",
                          fontWeight: "bold",
                          lineHeight: "1.3em",
                        }}
                      >
                        James Dillon{" "}
                      </div>
                      <div className="des" style={{ fontSize: 20 }}>
                        1 on 1 Death Match Valorant Tournament
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-10 w-1/2 left-[50%] px-4">
                  <Swiper
                    slidesPerView={3}
                    spaceBetween={10}
                    freeMode={true}
                    pagination={{ clickable: true }}
                    modules={[FreeMode, Pagination]}
                    className="swiper-container"
                  >
                    {[Place1, Place2, Place3, Place4, Place1].map(
                      (place, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className={`cursor-pointer ${
                              currentIndex === index
                                ? "opacity-100"
                                : "opacity-50"
                            }`}
                            onClick={() => handleThumbnailClick(index)}
                          >
                            <img
                              className="w-full h-full object-cover rounded-xl"
                              src={place}
                              alt={`Thumbnail ${index + 1}`}
                            />
                          </div>
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="p-8">
        <h2 className="text-2xl mb-4">
          <span className="text-darkPurple font-bold">Streams</span> you might
          like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : streams ? (
            streams.map((stream) => (
              <LiveVideoCard key={stream.user_id} stream={stream} />
            ))
          ) : (
            <p>No streams available</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
