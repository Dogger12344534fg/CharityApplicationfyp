'use client'

import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon | string
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  color?: 'setu' | 'gold' | 'green' | 'blue' | 'red'
}

const colorClasses = {
  setu: 'bg-setu-50 text-setu-700 border-setu-200',
  gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  red: 'bg-red-50 text-red-700 border-red-200',
}

const iconBgClasses = {
  setu: 'bg-setu-100 text-setu-600',
  gold: 'bg-yellow-100 text-yellow-600',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  red: 'bg-red-100 text-red-600',
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'setu',
}: DashboardCardProps) {
  return (
    <div
      className={`card-lift p-6 rounded-lg border ${colorClasses[color]} shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-60 mt-2">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgClasses[color]} text-xl`}>
          {typeof icon === 'string' ? icon : <Icon size={24} />}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-xs mt-4">
          <span
            className={`font-medium ${
              trend.direction === 'up'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="opacity-60">from last month</span>
        </div>
      )}
    </div>
  )
}

export default DashboardCard
