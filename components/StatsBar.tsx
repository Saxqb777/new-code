const stats = [
  { value: '250,000+', label: 'Active Members' },
  { value: '$1.2M+', label: 'Total Paid Out' },
  { value: '500+', label: 'Daily Offers' },
  { value: '4.8 ★', label: 'User Rating' },
]

export default function StatsBar() {
  return (
    <div className="bg-blue-50 border-y border-blue-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-extrabold text-blue-700">{stat.value}</div>
              <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
