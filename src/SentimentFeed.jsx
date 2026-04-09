function SentimentFeed({ data }) {
    return (
        <div className="feed-container">
            <h2>Live Feed</h2>
            <div className="feed-list">
                {data.slice(0, 50).map(item => (
                    <div
                        key={item.id}
                        className={`feed-item ${
                            item.sentiment === "positive" ? "positive" :
                                item.sentiment === "negative" ? "negative" :
                                    "neutral"
                        }`}
                    >
                        <div className="feed-header">
                            <span className="symbol-badge">{item.symbol}</span>
                            <span className={`sentiment-label ${
                                item.sentiment === "positive" ? "positive" :
                                    item.sentiment === "negative" ? "negative" :
                                        "neutral"
                            }`}>
                {item.sentiment?.toUpperCase()}
              </span>
                            <span className="confidence">
                {Math.round(item.sentimentScore * 100)}% confident
              </span>
                            <span className="timestamp">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
                        </div>
                        <p className="feed-content">{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SentimentFeed