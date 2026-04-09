function PriceTicker({ prices }) {
    if (!prices || prices.length === 0) {
        return (
            <div className="price-ticker">
                <p className="loading">Loading prices...</p>
            </div>
        )
    }

    return (
        <div className="price-ticker">
            {prices.map(price => (
                <div key={price.symbol} className="price-card">
                    <span className="price-symbol">{price.symbol}</span>
                    <span className="price-value">
            ${price.currentPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
          </span>
                    <span className={price.percentChange >= 0
                        ? "price-change positive"
                        : "price-change negative"
                    }>
            {price.percentChange >= 0 ? "▲" : "▼"} {Math.abs(price.percentChange)}%
          </span>
                </div>
            ))}
        </div>
    )
}

export default PriceTicker