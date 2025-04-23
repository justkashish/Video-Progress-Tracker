import "../styles/ProgressBar.css"

const ProgressBar = ({ progress, watchedIntervals, videoDuration }) => {
  // Calculate segments for the detailed progress bar
  const renderWatchedSegments = () => {
    if (!videoDuration || !watchedIntervals || watchedIntervals.length === 0) return null

    return watchedIntervals.map((interval, index) => {
      const startPercent = (interval.start / videoDuration) * 100
      const widthPercent = ((interval.end - interval.start) / videoDuration) * 100

      return (
        <div
          key={index}
          className="watched-segment"
          style={{
            left: `${startPercent}%`,
            width: `${widthPercent}%`,
          }}
          title={`${Math.floor(interval.start)}s - ${Math.floor(interval.end)}s`}
        ></div>
      )
    })
  }

  return (
    <div className="progress-tracker">
      <div className="overall-progress">
        <div className="progress-label">Overall Progress</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress || 0}%` }}></div>
          <span className="progress-text">{progress || 0}%</span>
        </div>
      </div>

      <div className="detailed-progress">
        <div className="progress-label">Watched Segments</div>
        <div className="segments-bar">{renderWatchedSegments()}</div>
      </div>
    </div>
  )
}

export default ProgressBar
