'use client'

interface StatCardProps {
  label: string
  value: number
  max?: number
  format?: 'number' | 'currency' | 'percentage'
  icon?: React.ReactNode
}

export function StatCard({
  label,
  value,
  max,
  format = 'number',
  icon,
}: StatCardProps) {
  const percentage = max ? (value / max) * 100 : 0

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `₨${val.toLocaleString()}`
      case 'percentage':
        return `${val.toFixed(1)}%`
      default:
        return val.toLocaleString()
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-setu-100">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-setu-600">{label}</p>
        {icon && <div className="text-setu-500">{icon}</div>}
      </div>

      <p className="text-2xl font-bold text-setu-900 mb-3">{formatValue(value)}</p>

      {max && (
        <div className="bg-setu-50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-setu-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default StatCard
