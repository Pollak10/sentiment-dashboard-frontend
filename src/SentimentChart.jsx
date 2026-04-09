import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    Area
} from "recharts"

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        const score = data.score
        const sentiment = score >= 0.6
            ? "Positive"
            : score <= 0.4
                ? "Negative"
                : "Neutral"
        const color = score >= 0.6
            ? "#00ff88"
            : score <= 0.4
                ? "#ff4444"
                : "#ffaa00"

        return (
            <div style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "10px 14px",
            }}>
                <p style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>
                    {data.time}
                </p>
                <p style={{ color: "#fff", fontSize: "13px", marginBottom: "4px" }}>
                    {data.symbol}
                </p>
                <p style={{ color, fontSize: "16px", fontWeight: "600" }}>
                    {sentiment} — {score}
                </p>
            </div>
        )
    }
    return null
}

function SentimentChart({ data }) {
    const chartData = data
        .slice(0, 30)
        .reverse()
        .map(item => ({
            time: new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
            score: parseFloat(item.sentimentScore.toFixed(2)),
            symbol: item.symbol
        }))

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h2>Sentiment Score Over Time</h2>
                <div className="chart-legend">
                    <span className="legend-item positive">● Positive</span>
                    <span className="legend-item neutral">● Neutral</span>
                    <span className="legend-item negative">● Negative</span>
                </div>
            </div>
            <div className="chart-scale-hint">
                <span>1.0 = very positive &nbsp;|&nbsp; 0.5 = neutral &nbsp;|&nbsp; 0.0 = very negative</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff88" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="0"
                        stroke="#1e1e1e"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="time"
                        tick={{ fill: "#555", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={[0, 1]}
                        ticks={[0, 0.25, 0.5, 0.75, 1]}
                        tick={{ fill: "#555", fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                        y={0.5}
                        stroke="#444"
                        strokeDasharray="4 4"
                        label={{
                            value: "neutral",
                            position: "insideTopRight",
                            fill: "#555",
                            fontSize: 11
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        fill="url(#scoreGradient)"
                        stroke="none"
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#00ff88"
                        strokeWidth={2}
                        dot={(props) => {
                            const { cx, cy, payload } = props
                            const color = payload.score >= 0.6
                                ? "#00ff88"
                                : payload.score <= 0.4
                                    ? "#ff4444"
                                    : "#ffaa00"
                            return (
                                <circle
                                    key={`dot-${cx}-${cy}`}
                                    cx={cx}
                                    cy={cy}
                                    r={3}
                                    fill={color}
                                    stroke="none"
                                />
                            )
                        }}
                        activeDot={{ r: 5, fill: "#fff" }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

export default SentimentChart