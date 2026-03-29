'use client'

import { LucideIcon, Edit2, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react'

interface ActionButtonProps {
  icon?: LucideIcon
  label?: string
  variant: 'approve' | 'reject' | 'edit' | 'delete' | 'view'
  onClick?: () => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

const variantClasses = {
  approve: 'text-green-600 hover:bg-green-50 border-green-200',
  reject: 'text-red-600 hover:bg-red-50 border-red-200',
  edit: 'text-blue-600 hover:bg-blue-50 border-blue-200',
  delete: 'text-red-600 hover:bg-red-50 border-red-200',
  view: 'text-setu-600 hover:bg-setu-50 border-setu-200',
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-2 text-sm gap-2',
}

const defaultIcons = {
  approve: CheckCircle,
  reject: XCircle,
  edit: Edit2,
  delete: Trash2,
  view: Eye,
}

const defaultLabels = {
  approve: 'Approve',
  reject: 'Reject',
  edit: 'Edit',
  delete: 'Delete',
  view: 'View',
}

export function ActionButton({
  icon,
  label,
  variant,
  onClick,
  disabled = false,
  size = 'sm',
}: ActionButtonProps) {
  const Icon = icon || defaultIcons[variant]
  const displayLabel = label || defaultLabels[variant]
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center rounded border ${variantClasses[variant]} ${sizeClasses[size]} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon size={size === 'sm' ? 14 : 16} />
      <span>{displayLabel}</span>
    </button>
  )
}

export default ActionButton
