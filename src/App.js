"use client"

import { useState, useEffect } from "react"
import VideoPlayer from "./components/VideoPlayer"
import ProgressBar from "./components/ProgressBar"
import VideoLibrary from "./components/VideoLibrary"
import { videoData } from "./data/videoData"
import "./styles/App.css"
import { mergeIntervals, calculateUniqueWatchedTime } from "./utils/progressUtils"

function App() {
  const [currentView, setCurrentView] = useState("library")
  const [selectedVideoId, setSelectedVideoId] = useState(null)
  const [videoStates, setVideoStates] = useState({})

  // Initialize video states on component mount
  useEffect(() => {
    const savedVideoStates = localStorage.getItem("videoStates")
    if (savedVideoStates) {
      setVideoStates(JSON.parse(savedVideoStates))
    } else {
      // Initialize with empty states for each video
      const initialStates = {}
      videoData.forEach((video) => {
        initialStates[video.id] = {
          watchedIntervals: [],
          lastPosition: 0,
          progress: 0,
        }
      })
      setVideoStates(initialStates)
    }
  }, [])

  // Save video states when they change
  useEffect(() => {
    if (Object.keys(videoStates).length > 0) {
      localStorage.setItem("videoStates", JSON.stringify(videoStates))
    }
  }, [videoStates])

  // Function to handle video selection
  const handleVideoSelect = (videoId) => {
    setSelectedVideoId(videoId)
    setCurrentView("video")
  }

  // Function to go back to library
  const handleBackToLibrary = () => {
    setCurrentView("library")
  }

  // Function to add a new watched interval for the current video
  const addWatchedInterval = (start, end) => {
    if (!selectedVideoId) return

    // Round to nearest second for better precision
    start = Math.floor(start)
    end = Math.ceil(end)

    if (start >= end) return

    setVideoStates((prevStates) => {
      const videoState = prevStates[selectedVideoId] || {
        watchedIntervals: [],
        lastPosition: 0,
        progress: 0,
      }

      // Add the new interval
      const newIntervals = [...videoState.watchedIntervals, { start, end }]

      // Merge overlapping intervals
      const mergedIntervals = mergeIntervals(newIntervals)

      // Calculate progress
      const selectedVideo = videoData.find((v) => v.id === selectedVideoId)
      if (!selectedVideo) return prevStates

      const uniqueSeconds = calculateUniqueWatchedTime(mergedIntervals)
      const newProgress = Math.min(100, Math.round((uniqueSeconds / selectedVideo.duration) * 100))

      // Create updated state
      const updatedState = {
        ...prevStates,
        [selectedVideoId]: {
          ...videoState,
          watchedIntervals: mergedIntervals,
          progress: newProgress,
        },
      }

      // Log for debugging
      console.log(`Added interval: ${start}-${end}, Progress: ${newProgress}%, Total watched: ${uniqueSeconds}s`)

      return updatedState
    })
  }

  // Function to update the last position for the current video
  const updateLastPosition = (currentTime) => {
    if (!selectedVideoId) return

    setVideoStates((prevStates) => {
      const videoState = prevStates[selectedVideoId] || {
        watchedIntervals: [],
        lastPosition: 0,
        progress: 0,
      }

      return {
        ...prevStates,
        [selectedVideoId]: {
          ...videoState,
          lastPosition: currentTime,
        },
      }
    })
  }

  // Set video duration once it's loaded
  const handleVideoDuration = (duration) => {
    // This is handled within the component now
  }

  // Get the selected video
  const selectedVideo = selectedVideoId ? videoData.find((video) => video.id === selectedVideoId) : null

  // Get the current video state
  const currentVideoState =
    selectedVideoId && videoStates[selectedVideoId]
      ? videoStates[selectedVideoId]
      : { watchedIntervals: [], lastPosition: 0, progress: 0 }

  // Debug: Log video states when they change
  useEffect(() => {
    if (selectedVideoId && videoStates[selectedVideoId]) {
      const state = videoStates[selectedVideoId]
      console.log(`Video ${selectedVideoId} state:`, {
        intervals: state.watchedIntervals,
        progress: state.progress,
        lastPosition: state.lastPosition,
      })
    }
  }, [videoStates, selectedVideoId])

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 onClick={handleBackToLibrary} style={{ cursor: "pointer" }}>
            Video Learning Platform
          </h1>
          {currentView === "video" && (
            <button className="back-button" onClick={handleBackToLibrary}>
              Back to Library
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {currentView === "library" ? (
          <VideoLibrary
            videos={videoData.map((video) => ({
              ...video,
              progress: videoStates[video.id]?.progress || 0,
            }))}
            onVideoSelect={handleVideoSelect}
          />
        ) : (
          selectedVideo && (
            <>
              <div className="video-container">
                <div className="video-header">
                  <h2 className="video-title">{selectedVideo.title}</h2>
                  <p className="video-author">{selectedVideo.author}</p>
                </div>

                <VideoPlayer
                  src={selectedVideo.videoUrl}
                  initialTime={currentVideoState.lastPosition}
                  onWatchedInterval={addWatchedInterval}
                  onTimeUpdate={updateLastPosition}
                  onDurationChange={handleVideoDuration}
                />
              </div>

              <div className="progress-container">
                <ProgressBar
                  progress={currentVideoState.progress}
                  watchedIntervals={currentVideoState.watchedIntervals}
                  videoDuration={selectedVideo.duration}
                />
                <div className="progress-stats">
                  <div className="stat-item">
                    <span className="stat-label">Progress:</span>
                    <span className="stat-value">{currentVideoState.progress}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Unique Time Watched:</span>
                    <span className="stat-value">
                      {Math.floor(calculateUniqueWatchedTime(currentVideoState.watchedIntervals) / 60)}:
                      {(calculateUniqueWatchedTime(currentVideoState.watchedIntervals) % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="video-description">
                <h3>Description</h3>
                <p>{selectedVideo.description}</p>
              </div>
            </>
          )
        )}
      </main>

      <footer className="app-footer">
        <p>Video Progress Tracker - Tracks only unique parts watched</p>
      </footer>
    </div>
  )
}

export default App
