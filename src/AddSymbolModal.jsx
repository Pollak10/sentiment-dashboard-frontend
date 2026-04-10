import { useState } from "react"
import axios from "axios"

const API_URL = "https://sentiment-dashboard-api-rqdb.onrender.com/api/sentiments"

function AddSymbolModal({ onClose, onSymbolAdded }) {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleAdd = async () => {
        if (!input.trim()) return
        setLoading(true)
        setMessage(null)

        try {
            const response = await axios.post(API_URL + "/watchlist/add", {
                symbol: input.toUpperCase()
            })

            setSuccess(response.data.success)
            setMessage(response.data.message)

            if (response.data.success) {
                setTimeout(() => {
                    onSymbolAdded(input.toUpperCase())
                    onClose()
                }, 1000)
            }
        } catch (error) {
            setSuccess(false)
            setMessage("Error adding symbol. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleAdd()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Symbol</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <p className="modal-subtitle">
                    Search for any stock or crypto symbol
                </p>
                <div className="modal-input-row">
                    <input
                        className="modal-input"
                        type="text"
                        placeholder="e.g. NVDA, SOL, MSFT"
                        value={input}
                        onChange={e => setInput(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        autoFocus
                    />
                    <button
                        className="modal-add-btn"
                        onClick={handleAdd}
                        disabled={loading}
                    >
                        {loading ? "..." : "Add"}
                    </button>
                </div>
                {message && (
                    <p className={`modal-message ${success ? "success" : "error"}`}>
                        {message}
                    </p>
                )}
                <div className="modal-examples">
                    <p>Popular symbols:</p>
                    <div className="modal-chips">
                        {["NVDA", "MSFT", "AMZN", "SOL", "DOGE", "META"].map(s => (
                            <button
                                key={s}
                                className="modal-chip"
                                onClick={() => setInput(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddSymbolModal