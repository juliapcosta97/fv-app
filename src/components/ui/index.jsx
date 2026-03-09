import { forwardRef } from 'react'
import { initials, avatarGradient } from '../../utils/helpers'

/* ════════════════════════════════════════
   BUTTON
════════════════════════════════════════ */
const BTN_BASE = 'fv-btn'
const BTN_VARIANTS = {
  primary: 'fv-btn-primary',
  coral:   'fv-btn-coral',
  lime:    'fv-btn-lime',
  ghost:   'fv-btn-ghost',
  danger:  'fv-btn-danger',
  icon:    'fv-btn-icon',
}
const BTN_SIZES = { sm: 'fv-btn-sm', md: 'fv-btn-md', lg: 'fv-btn-lg', xl: 'fv-btn-xl' }

export function Button({ variant = 'primary', size = 'md', full, className = '', children, ...props }) {
  return (
    <button
      className={[
        BTN_BASE,
        BTN_VARIANTS[variant] || '',
        BTN_SIZES[size] || '',
        full ? 'fv-btn-full' : '',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

/* ════════════════════════════════════════
   CARD
════════════════════════════════════════ */
export function Card({ children, className = '', glow, interactive, style, ...props }) {
  return (
    <div
      className={[
        'fv-card',
        glow        ? `fv-card-glow-${glow}`  : '',
        interactive ? 'fv-card-interactive'    : '',
        className
      ].filter(Boolean).join(' ')}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

/* ════════════════════════════════════════
   BADGE
════════════════════════════════════════ */
export function Badge({ color = 'ocean', children, className = '' }) {
  return <span className={['fv-badge', `fv-badge-${color}`, className].filter(Boolean).join(' ')}>{children}</span>
}

/* ════════════════════════════════════════
   FORM ELEMENTS
════════════════════════════════════════ */
export const Input = forwardRef(({ label, error, hint, className = '', ...props }, ref) => (
  <div className="fv-field">
    {label && <label className="fv-label">{label}</label>}
    <input ref={ref} className={['fv-input', error ? 'fv-input-error' : '', className].filter(Boolean).join(' ')} {...props} />
    {error && <span className="fv-field-error">{error}</span>}
    {hint  && <span className="fv-field-hint">{hint}</span>}
  </div>
))
Input.displayName = 'Input'

export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className="fv-field">
    {label && <label className="fv-label">{label}</label>}
    <select ref={ref} className={['fv-input', 'fv-select', error ? 'fv-input-error' : '', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </select>
    {error && <span className="fv-field-error">{error}</span>}
  </div>
))
Select.displayName = 'Select'

export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="fv-field">
    {label && <label className="fv-label">{label}</label>}
    <textarea ref={ref} className={['fv-input', 'fv-textarea', error ? 'fv-input-error' : '', className].filter(Boolean).join(' ')} {...props} />
    {error && <span className="fv-field-error">{error}</span>}
  </div>
))
Textarea.displayName = 'Textarea'

/* ════════════════════════════════════════
   AVATAR
════════════════════════════════════════ */
export function Avatar({ name = '', size = 44, className = '', style = {}, ring }) {
  return (
    <div
      className={['fv-avatar', ring ? 'fv-avatar-ring' : '', className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, fontSize: size * 0.37, background: avatarGradient(name), ...style }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  )
}

/* ════════════════════════════════════════
   FILTER BAR
════════════════════════════════════════ */
export function FilterBar({ options = [], current, onChange, className = '' }) {
  const all = ['Todos', ...options]
  return (
    <div className={['fv-filter-bar', className].filter(Boolean).join(' ')}>
      {all.map(o => (
        <button
          key={o}
          className={['fv-filter-pill', current === o ? 'active' : ''].filter(Boolean).join(' ')}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════
   SECTION HEADER
════════════════════════════════════════ */
export function SectionHeader({ title, accent, icon, children }) {
  return (
    <div className="fv-section-header">
      <h2 className="fv-section-title">
        {icon && <span className="fv-section-icon">{icon}</span>}
        {title}
        {accent && <span className="fv-section-accent"> {accent}</span>}
      </h2>
      {children && <div className="fv-section-actions">{children}</div>}
    </div>
  )
}

/* ════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════ */
export function EmptyState({ icon = '🏐', title = 'Nada aqui ainda', text, action }) {
  return (
    <div className="fv-empty">
      <div className="fv-empty-icon">{icon}</div>
      <p className="fv-empty-title">{title}</p>
      {text && <p className="fv-empty-text">{text}</p>}
      {action && <div className="fv-empty-action">{action}</div>}
    </div>
  )
}

/* ════════════════════════════════════════
   LOADING SPINNER
════════════════════════════════════════ */
export function Spinner({ size = 24 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.75s linear infinite', display: 'block' }}
    >
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--ocean-light)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/* ════════════════════════════════════════
   LIVE DOT
════════════════════════════════════════ */
export function LiveDot() {
  return <span className="fv-live-dot" aria-hidden="true" />
}

/* ════════════════════════════════════════
   DIVIDER
════════════════════════════════════════ */
export function Divider({ className = '' }) {
  return <hr className={['fv-divider', className].filter(Boolean).join(' ')} />
}

/* ════════════════════════════════════════
   STAT BOX
════════════════════════════════════════ */
export function StatBox({ value, label, color }) {
  const colors = { lime: 'var(--lime)', coral: 'var(--coral)', ocean: 'var(--ocean-light)' }
  return (
    <div className="fv-stat-box">
      <span className="fv-stat-value" style={color ? { color: colors[color] || color } : {}}>{value}</span>
      <span className="fv-stat-label">{label}</span>
    </div>
  )
}

/* ════════════════════════════════════════
   SKELETON
════════════════════════════════════════ */
export function Skeleton({ width = '100%', height = 20, style = {} }) {
  return <div className="skeleton" style={{ width, height, ...style }} />
}
