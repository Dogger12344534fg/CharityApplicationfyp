'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-lg shadow-xl ${sizeClasses[size || 'md']} w-full animate-fade-in-up`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-setu-100">
            <h2 className="text-lg font-semibold text-setu-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-setu-400 hover:text-setu-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">{children}</div>

          {footer && (
            <div className="p-6 border-t border-setu-100 flex gap-3 justify-end">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}

export default Modal
