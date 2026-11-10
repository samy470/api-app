import { useState, useEffect, useCallback } from 'react'

interface PortfolioItem {
    coinId: string
    amount: number
}

interface PortfolioResponse {
    portfolio: PortfolioItem[]
    balance: number
}

interface Coin {
    id: string
    current_price: number
}

const API = import.meta.env.VITE_API_URL

export default function Portfolio() {
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
    const [coins, setCoins] = useState<Coin[]>([])
    const [balance, setBalance] = useState<number>(0)
    const [amounts, setAmounts] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const loadPortfolio = useCallback(async () => {
        const res = await fetch(`${API}/portfolio`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        if (!res.ok) throw new Error('failed')
        const data: PortfolioResponse = await res.json()
        setPortfolio(data.portfolio)
        setBalance(data.balance)
    }, [])

    useEffect(() => {
        async function init() {
            try {
                await loadPortfolio()
                const res = await fetch(`${API}/get`)
                const data = await res.json()
                setCoins(Array.isArray(data) ? data : [])
            } catch {
                setError('Could not load your portfolio, try logging in again')
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [loadPortfolio])

    async function handleSell(item: PortfolioItem, sellAmount: number) {
        setMessage('')
        const coin = coins.find(c => c.id === item.coinId)

        if (!coin) {
            setMessage('Price not available right now, try again in a minute')
            return
        }
        if (!sellAmount || sellAmount <= 0) {
            setMessage('Enter a valid amount')
            return
        }
        if (sellAmount > item.amount) {
            setMessage(`You only own ${item.amount} ${item.coinId}`)
            return
        }

        try {
            const res = await fetch(`${API}/sell`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    coinId: item.coinId,
                    amount: sellAmount,
                    current_price: coin.current_price
                })
            })
            const data = await res.json()
            setMessage(data.message)
            setAmounts({ ...amounts, [item.coinId]: '' })
            await loadPortfolio()
        } catch {
            setMessage('Something went wrong, try again')
        }
    }

    const totalValue = portfolio.reduce((sum, item) => {
        const coin = coins.find(c => c.id === item.coinId)
        return sum + (coin ? coin.current_price * item.amount : 0)
    }, 0)

    if (loading) {
        return <p className="px-6 py-8 text-gray-400">Loading...</p>
    }

    if (error) {
        return <p className="px-6 py-8 text-red-400">{error}</p>
    }

    return (
        <div className="w-full overflow-x-auto bg-gray-900 min-h-screen">
            <div className="px-6 py-4 flex gap-8 text-white text-lg font-semibold">
                <span>Balance: ${balance.toLocaleString()}</span>
                <span>Portfolio value: ${totalValue.toLocaleString()}</span>
            </div>

            {message && (
                <p className="mx-6 mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                    {message}
                </p>
            )}

            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Value</th>
                        <th className="px-6 py-3">Sell</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                You don't own any coins yet. Go buy some!
                            </td>
                        </tr>
                    ) : (
                        portfolio.map(item => {
                            const coin = coins.find(c => c.id === item.coinId)
                            return (
                                <tr key={item.coinId} className="border-b border-gray-700 bg-gray-900 hover:bg-gray-950 transition">
                                    <td className="px-6 py-4 capitalize">{item.coinId}</td>
                                    <td className="px-6 py-4">{item.amount}</td>
                                    <td className="px-6 py-4">
                                        {coin ? `$${coin.current_price.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {coin ? `$${(coin.current_price * item.amount).toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder="Amount"
                                            className="bg-gray-800 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-red-500 w-32"
                                            value={amounts[item.coinId] || ''}
                                            onChange={e => setAmounts({ ...amounts, [item.coinId]: e.target.value })}
                                        />
                                        <button
                                            className="px-4 py-2 rounded-lg text-sm bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-semibold transition"
                                            onClick={() => handleSell(item, Number(amounts[item.coinId]))}
                                        >
                                            Sell
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded-lg text-sm bg-red-500 text-black hover:bg-red-400 font-semibold transition"
                                            onClick={() => handleSell(item, item.amount)}
                                        >
                                            Sell all
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
    )
}