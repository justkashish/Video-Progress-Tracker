"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import VideoCard from "./VideoCard"
import { videoData as initialVideoData } from "../data/videoData"
import "../styles/HomePage.css"

const HomePage = () => {
  const navigate = useNavigate()
  const [videoData, setVideoData] = useState(initialVideoData)
  const [activeCategory, setActiveCategory] = useState("All")

  // Load saved progress data
  useEffect(() => {
    const savedProgressData = localStorage.getItem("videoProgressData")

    if (savedProgressData) {
      const parsedData = JSON.parse(savedProgressData)

      // Merge saved progress with video data
      const updatedVideoData = initialVideoData.map((video) => {
        const savedVideo = parsedData.find((v) => v.id === video.id)
        return savedVideo ? { ...video, progress: savedVideo.progress } : video
      })

      setVideoData(updatedVideoData)
    }
  }, [])

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`)
  }

  // Get unique categories
  const categories = ["All", ...new Set(videoData.map((video) => video.category))]

  // Filter videos by category
  const filteredVideos =
    activeCategory === "All" ? videoData : videoData.filter((video) => video.category === activeCategory)

  return (
    <div className="home-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Video Learning Platform</h1>
        </div>
      </header>

      <main className="home-main">
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
            <VideoCard key={video.id} video={video} onClick={() => handleVideoClick(video.id)} />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        <p>Video Progress Tracker - Tracks only unique parts watched</p>
      </footer>
    </div>
  )
}

export default HomePage
