"use client"
import "../styles/VideoCard.css"

const VideoCard = ({ video, onClick }) => {
  const { title, thumbnailUrl, author, duration, views, uploadDate, progress = 0 } = video

  // Format view count
  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`
    }
    return `${count} views`
  }

  // Format duration (seconds to MM:SS)
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="video-card" onClick={onClick}>
      <div className="thumbnail-container">
        <img src={thumbnailUrl || "/placeholder.svg"} alt={title} className="video-thumbnail" />
        <div className="video-duration">{formatDuration(duration)}</div>
        {progress > 0 && (
          <div className="progress-overlay">
            <div className="progress-bar-mini">
              <div className="progress-fill-mini" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}
      </div>
      <div className="video-info">
        <h3 className="video-card-title">{title}</h3>
        <p className="video-card-author">{author}</p>
        <p className="video-card-stats">
          {formatViews(views)} • {uploadDate}
        </p>
      </div>
    </div>
  )
}

export default VideoCard
