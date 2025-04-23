"use client"

import { useRef, useState, useEffect } from "react"
import "../styles/VideoPlayer.css"

const VideoPlayer = ({ src, initialTime = 0, onWatchedInterval, onTimeUpdate, onDurationChange }) => {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialTime)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [trackingInterval, setTrackingInterval] = useState(null)
  const [lastTrackedTime, setLastTrackedTime] = useState(null)

  // Set initial time when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = initialTime
    }
  }, [initialTime])

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    const videoDuration = videoRef.current.duration
    setDuration(videoDuration)
    if (onDurationChange) {
      onDurationChange(videoDuration)
    }
  }

  // Handle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Start tracking when video plays
  const handlePlay = () => {
    setIsPlaying(true)
    const currentTime = videoRef.current.currentTime
    setLastTrackedTime(currentTime)

    // Set up interval to track watched segments
    const interval = setInterval(() => {
      if (videoRef.current && lastTrackedTime !== null) {
        const start = lastTrackedTime
        const end = videoRef.current.currentTime

        if (end > start) {
          onWatchedInterval(start, end)
          setLastTrackedTime(end)
        }
      }
    }, 1000) // Check every second

    setTrackingInterval(interval)
  }

  // Stop tracking when video pauses
  const handlePause = () => {
    setIsPlaying(false)

    // Clear the tracking interval
    if (trackingInterval) {
      clearInterval(trackingInterval)
      setTrackingInterval(null)
    }

    // Record the final segment since the last check
    if (lastTrackedTime !== null) {
      const start = lastTrackedTime
      const end = videoRef.current.currentTime

      if (end > start) {
        onWatchedInterval(start, end)
      }

      setLastTrackedTime(null)
    }

    // Update the last position
    onTimeUpdate(videoRef.current.currentTime)
  }

  // Handle seeking (when user jumps to a different part)
  const handleSeek = () => {
    if (isPlaying && lastTrackedTime !== null) {
      // Record the segment watched before seeking
      const start = lastTrackedTime
      const end = videoRef.current.currentTime

      // Only record if it's a valid interval (not seeking backward)
      if (end > start) {
        onWatchedInterval(start, end)
      }

      // Update the last tracked time to the new position
      setLastTrackedTime(videoRef.current.currentTime)
    }
  }

  // Handle time updates
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime)
  }

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    videoRef.current.volume = newVolume
  }

  // Format time display (mm:ss)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle seeking with progress bar
  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    const newTime = clickPosition * duration

    // Record the segment watched before seeking
    if (isPlaying && lastTrackedTime !== null) {
      const start = lastTrackedTime
      const end = videoRef.current.currentTime

      if (end > start) {
        onWatchedInterval(start, end)
      }
    }

    // Update video time
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)

    // Update tracking
    if (isPlaying) {
      setLastTrackedTime(newTime)
    }

    // Update last position
    onTimeUpdate(newTime)
  }

  // Clean up on unmount
  useEffect(() => {
    // Capture the current video element reference to use in cleanup
    const videoElement = videoRef.current
    const currentLastTrackedTime = lastTrackedTime

    return () => {
      if (trackingInterval) {
        clearInterval(trackingInterval)
      }

      // Record final segment and update position on unmount
      if (currentLastTrackedTime !== null && videoElement) {
        const start = currentLastTrackedTime
        const end = videoElement.currentTime

        if (end > start) {
          onWatchedInterval(start, end)
        }

        onTimeUpdate(videoElement.currentTime)
      }
    }
  }, [trackingInterval, lastTrackedTime, onWatchedInterval, onTimeUpdate])

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={src}
        className="video-element"
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeking={handleSeek}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handlePause}
        onClick={togglePlay}
      />

      <div className="video-controls">
        <button className="control-button" onClick={togglePlay}>
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <div className="progress-bar-container" onClick={handleProgressBarClick}>
          <div className="progress-bar-background"></div>
          <div className="progress-bar-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
        </div>

        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="volume-control">
          <span className="volume-icon">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
