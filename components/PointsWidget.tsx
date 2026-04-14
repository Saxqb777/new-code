interface PointsWidgetProps {
  points: number
}

export default function PointsWidget({ points }: PointsWidgetProps) {
  const cashValue = (points / 1000).toFixed(2)

  return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <div className="w-9 h-9 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-lg leading-none">🪙</span>
      </div>
      <div>
        <p className="font-extrabold text-amber-700 text-lg leading-none">
          {points.toLocaleString()} pts
        </p>
        <p className="text-amber-600 text-xs mt-0.5">≈ ${cashValue} USD</p>
      </div>
    </div>
  )
}
