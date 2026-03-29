'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
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

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in-up"
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
    </>
  )
}

export default Modal
