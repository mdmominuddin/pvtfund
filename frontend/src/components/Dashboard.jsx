import React, { useEffect, useState } from 'react'

function Dashboard() {
  const [tfunds, setTfunds] = useState([])

  useEffect(() => {
    fetch('/api/funds/')
      .then(res => res.json())
      .then(data => {
        setTfunds(data)
      })
      .catch(err => {
        console.error('Error fetching funds:', err)
      })
  }, []) // ✅ Added dependency array to avoid infinite fetch loop

  const totalTfund = tfunds.reduce(
    (sum, fund) => sum + parseFloat(fund.deposit_amount || 0),
    0
  )

  const cards = [
    {
      title: '💰 Total Funds',
      content: `৳ ${totalTfund.toLocaleString()}`,
      footer: 'Updated just now',
    },
    {
      title: '📦 Total Spent',
      content: '৳ 65,000',
      footer: 'Last checked: 10 mins ago',
    },
    {
      title: '📊 Monthly Summary',
      content: '৳ 45,000 added this month',
      footer: 'Includes all sources',
    },
    {
      title: '🧾 Recent Transactions',
      content: '12 new entries',
      footer: 'Sorted by date',
    },
    {
      title: '🔍 Audit Status',
      content: 'All records verified',
      footer: 'Next audit: Sept 2025',
    },
    {
      title: '🚨 Audit Objections',
      content: '2 pending clarifications',
      footer: 'Review by Sept 10',
    },
    {
      title: '📁 Archived Records',
      content: '340 entries stored',
      footer: 'Last backup: Aug 15',
    },
    {
      title: '📈 Fund Growth',
      content: 'Up 12% from last quarter',
      footer: 'Based on verified data',
    },
    {
      title: '🛠️ System Health',
      content: 'All services operational',
      footer: 'Checked 5 mins ago',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h2>
          <p className="text-gray-600 text-sm mb-4">{card.content}</p>
          <div className="text-xs text-gray-400">{card.footer}</div>
        </div>
      ))}
    </div>
  )
}

export default Dashboard
