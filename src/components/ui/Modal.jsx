import { useEffect } from 'react'
import './Modal.css'

export default function Modal({ open, onClose, title, children, width = 480, noPadding }) {
  useEffect(() => {
    if (!open) return
    const fn = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', fn)
    // Lock scroll
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', fn)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div
        className="modal-box"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className={['modal-body', noPadding ? 'no-pad' : ''].filter(Boolean).join(' ')}>
          {children}
        </div>
      </div>
    </div>
  )
}
