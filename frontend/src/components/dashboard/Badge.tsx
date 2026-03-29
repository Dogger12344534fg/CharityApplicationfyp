'use client'

interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'pending'
  children: React.ReactNode
  size?: 'sm' | 'md'
  icon?: React.ReactNode
}

const variantClasses = {
  success: 'bg-green-100 text-green-700 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  error: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-blue-100 text-blue-700 border border-blue-200',
  pending: 'bg-setu-100 text-setu-700 border border-setu-200',
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
}

export function Badge({
  variant,
  children,
  size = 'md',
  icon,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}

export default Badge
