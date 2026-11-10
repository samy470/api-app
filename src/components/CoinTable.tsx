import { useState, useEffect } from 'react'

interface Coin {
    id: string
    name: string
    symbol: string
    current_price: number
    market_cap: number
    market_cap_rank: number
    price_change_percentage_24h: number
}

const API = import.meta.env.VITE_API_URL

export default function CoinTable({ search }: { search: string }) {
    const [coins, setCoins] = useState<Coin[]>([])
    const [amount, setAmount] = useState<{ [key: string]: string }>({})
    const [error, setError] = useState('')
    const filteredData = coins.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()))

    useEffect(() => {
        fetch(`${API}/get`)
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data)) throw new Error('bad data')
                setCoins(data)
            })
            .catch(() => setError('Could not load prices, try again in a minute'))
    }, [])

    async function trade(type: 'buy' | 'sell', coin: Coin) {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('Login first')
            return
        }

        const value = Number(amount[coin.id])
        if (!value || value <= 0) {
            alert('Enter a valid amount')
            return
        }

        try {
            const res = await fetch(`${API}/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ coinId: coin.id, amount: value, current_price: coin.current_price })
            })
            const data = await res.json()
            alert(data.message)
            setAmount({ ...amount, [coin.id]: '' })
        } catch {
            alert('Something went wrong, try again')
        }
    }

    if (error) {
        return <p className="px-6 py-8 text-red-400">{error}</p>
    }

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                    <tr>
                        <th className="px-6 py-3">Rank</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Symbol</th>
                        <th className="px-6 py-3">Price (USD)</th>
                        <th className="px-6 py-3">Market Cap</th>
                        <th className="px-6 py-3">24h %</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map(coin => (
                        <tr key={coin.id} className="border-b border-gray-700 bg-gray-900 hover:bg-gray-950 transition">
                            <td className="px-6 py-4">{coin.market_cap_rank}</td>
                            <td className="px-6 py-4 font-medium text-white">{coin.name}</td>
                            <td className="px-6 py-4 uppercase">{coin.symbol}</td>
                            <td className="px-6 py-4">${coin.current_price.toLocaleString()}</td>
                            <td className="px-6 py-4">${coin.market_cap.toLocaleString()}</td>
                            <td className={`px-6 py-4 ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {coin.price_change_percentage_24h?.toFixed(2)}%
                            </td>
                            <td className="px-6 py-4">
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder="Amount"
                                    className="bg-gray-800 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500 w-32"
                                    value={amount[coin.id] || ''}
                                    onChange={e => setAmount({ ...amount, [coin.id]: e.target.value })}
                                />
                            </td>
                            <td className="px-6 py-4 flex gap-2">
                                <button
                                    className="px-4 py-2 rounded-lg text-sm bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-black font-semibold transition"
                                    onClick={() => trade('buy', coin)}
                                >
                                    Buy
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg text-sm bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-semibold transition"
                                    onClick={() => trade('sell', coin)}
                                >
                                    Sell
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}