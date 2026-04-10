import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import SentimentChart from "./SentimentChart.jsx"
import SentimentFeed from "./SentimentFeed.jsx"
import PriceTicker from "./PriceTicker.jsx"
import AnalyticsBar from "./AnalyticsBar.jsx"
import AddSymbolModal from "./AddSymbolModal.jsx"
import "./App.css"

const DEFAULT_SYMBOLS = ["ALL", "BTC", "ETH", "AAPL", "TSLA"]
const API_URL = "https://sentiment-dashboard-api-rqdb.onrender.com/api/sentiments"
const WS_URL = "https://sentiment-dashboard-api-rqdb.onrender.com/ws"

const generateSessionId = () => {
  return Math.random().toString(36).substring(2) +
      Date.now().toString(36)
}

function App() {
  const [sentiments, setSentiments] = useState([])
  const [selectedSymbol, setSelectedSymbol] = useState("ALL")
  const [connected, setConnected] = useState(false)
  const [prices, setPrices] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [symbols, setSymbols] = useState(DEFAULT_SYMBOLS)
  const [showModal, setShowModal] = useState(false)
  const sessionId = useRef(generateSessionId())

  useEffect(() => {
    fetchHistoricalData()
    fetchPrices()
    fetchAnalytics()
    fetchWatchlist()
    connectWebSocket()
    notifyJoin()

    const priceInterval = setInterval(fetchPrices, 60000)
    const heartbeatInterval = setInterval(sendHeartbeat, 10000)

    window.addEventListener("beforeunload", notifyLeave)

    return () => {
      clearInterval(priceInterval)
      clearInterval(heartbeatInterval)
      window.removeEventListener("beforeunload", notifyLeave)
      notifyLeave()
    }
  }, [])

  const fetchWatchlist = async () => {
    try {
      const response = await axios.get(API_URL + "/watchlist")
      const watchlistSymbols = response.data.map(item => item.symbol)
      const allSymbols = [...DEFAULT_SYMBOLS]
      watchlistSymbols.forEach(symbol => {
        if (!allSymbols.includes(symbol)) {
          allSymbols.push(symbol)
        }
      })
      setSymbols(allSymbols)
    } catch (error) {
      console.error("Error fetching watchlist:", error)
    }
  }

  const handleSymbolAdded = (symbol) => {
    if (!symbols.includes(symbol)) {
      setSymbols(prev => [...prev, symbol])
    }
    fetchPrices()
  }

  const notifyJoin = async () => {
    try {
      await axios.post(API_URL + "/analytics/join", {
        sessionId: sessionId.current
      })
    } catch (error) {
      console.error("Error notifying join:", error)
    }
  }

  const notifyLeave = async () => {
    try {
      await axios.post(API_URL + "/analytics/leave", {
        sessionId: sessionId.current
      })
    } catch (error) {
      console.error("Error notifying leave:", error)
    }
  }

  const sendHeartbeat = async () => {
    try {
      await axios.post(API_URL + "/analytics/heartbeat", {
        sessionId: sessionId.current
      })
    } catch (error) {
      console.error("Error sending heartbeat:", error)
    }
  }

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(API_URL)
      setSentiments(response.data)
    } catch (error) {
      console.error("Error fetching historical data:", error)
    }
  }

  const fetchPrices = async () => {
    try {
      const response = await axios.get(API_URL + "/prices")
      setPrices(response.data)
    } catch (error) {
      console.error("Error fetching prices:", error)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(API_URL + "/analytics")
      setAnalytics(response.data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const connectWebSocket = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      onConnect: () => {
        setConnected(true)
        client.subscribe("/topic/sentiment", (message) => {
          const newSentiment = JSON.parse(message.body)
          setSentiments(prev => [newSentiment, ...prev])
        })
        client.subscribe("/topic/analytics", (message) => {
          const newAnalytics = JSON.parse(message.body)
          setAnalytics(newAnalytics)
        })
      },
      onDisconnect: () => setConnected(false)
    })
    client.activate()
  }

  const filteredSentiments = selectedSymbol === "ALL"
      ? sentiments
      : sentiments.filter(s => s.symbol === selectedSymbol)

  return (
      <div className="app">
        <header className="header">
          <h1>Sentiment Dashboard</h1>
          <div className="connection-status">
          <span className={connected ? "dot green" : "dot red"}>
          </span>
            <span>{connected ? "Live" : "Disconnected"}</span>
          </div>
        </header>

        <AnalyticsBar analytics={analytics} />
        <div className="price-ticker-wrapper">
        <PriceTicker prices={prices} />
        </div>

        <div className="symbol-filter">
          {symbols.map(symbol => (
              <button
                  key={symbol}
                  className={selectedSymbol === symbol ? "active" : ""}
                  onClick={() => setSelectedSymbol(symbol)}
              >
                {symbol}
              </button>
          ))}
          <button
              className="add-symbol-btn"
              onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>

        <div className="dashboard">
          <SentimentChart data={filteredSentiments} />
          <SentimentFeed data={filteredSentiments} />
        </div>

        {showModal && (
            <AddSymbolModal
                onClose={() => setShowModal(false)}
                onSymbolAdded={handleSymbolAdded}
            />
        )}
      </div>
  )
}

export default App