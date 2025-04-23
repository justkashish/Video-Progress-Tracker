"use client"

import { useState } from "react"
import VideoCard from "./VideoCard"
import "../styles/VideoLibrary.css"

const VideoLibrary = ({ videos, onVideoSelect }) => {
  const [activeCategory, setActiveCategory] = useState("All")

  // Get unique categories
  const categories = ["All", ...new Set(videos.map((video) => video.category))]

  // Filter videos by category
  const filteredVideos = activeCategory === "All" ? videos : videos.filter((video) => video.category === activeCategory)

  return (
    <div className="library-container">
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="videos-grid">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} video={video} onClick={() => onVideoSelect(video.id)} />
        ))}
      </div>
    </div>
  )
}

export default VideoLibrary
