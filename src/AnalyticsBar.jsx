function AnalyticsBar({ analytics }) {
    const formatTime = (seconds) => {
        if (!seconds || seconds === 0) return "0s"
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        if (mins === 0) return `${secs}s`
        return `${mins}m ${secs}s`
    }

    return (
        <div className="analytics-bar">
            <div className="analytics-item">
        <span className="analytics-value">
          {analytics?.activeUsers ?? 0}
        </span>
                <span className="analytics-label">Active Users</span>
            </div>
            <div className="analytics-divider" />
            <div className="analytics-item">
        <span className="analytics-value">
          {analytics?.totalPageViews ?? 0}
        </span>
                <span className="analytics-label">Page Views Today</span>
            </div>
            <div className="analytics-divider" />
            <div className="analytics-item">
        <span className="analytics-value">
          {formatTime(analytics?.avgSessionSeconds)}
        </span>
                <span className="analytics-label">Avg Session Time</span>
            </div>
            <div className="analytics-divider" />
            <div className="analytics-item">
        <span className="analytics-value">
          {analytics?.peakUsers ?? 0}
        </span>
                <span className="analytics-label">Visitors Today</span>
            </div>
        </div>
    )
}

export default AnalyticsBar