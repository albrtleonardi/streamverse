import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Categories from "@/pages/Categories";
// import Trending from "@/pages/Trending";
import Streaming from "../pages/Streaming/Streaming";

const StreamVerse = () => {
  return (
    <Routes>
      <Route path="/" element={<Streaming />} />
      <Route path="/category" element={<Categories />} />
      {/* <Route path="/trending" element={< Trending />} /> */}
    </Routes>
  );
};

export default StreamVerse;
