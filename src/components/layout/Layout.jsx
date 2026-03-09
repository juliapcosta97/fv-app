import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Badge } from '../ui'
import './Layout.css'

const NAV = [
  { to: '/ranking',        emoji: '🏆', label: 'Ranking'        },
  { to: '/jogos',          emoji: '📋', label: 'Jogos'          },
  { to: '/classificacao',  emoji: '📊', label: 'Classificação'  },
  { to: '/sorteio',        emoji: '🎲', label: 'Sorteio'        },
  { to: '/perfis',         emoji: '👤', label: 'Perfis'         },
]

export function Header() {
  const { state, isDemo } = useApp()
  const navigate = useNavigate()
  const champ = state.championship

  return (
    <header className="hdr">
      <div className="hdr-inner">
        {/* Logo */}
        <button className="hdr-logo" onClick={() => navigate('/ranking')} aria-label="Início">
          <span className="hdr-logo-icon">⚡</span>
          <span className="hdr-logo-text">FV</span>
        </button>

        {/* Championship info */}
        <div className="hdr-champ">
          <div className="hdr-champ-name truncate">{champ?.name || '—'}</div>
          <div className="hdr-champ-meta truncate">
            {[champ?.edition, champ?.location].filter(Boolean).join(' · ')}
          </div>
        </div>

        {/* Right side */}
        <div className="hdr-right">
          {isDemo && <Badge color="demo">DEMO</Badge>}
          <button
            className="hdr-action-btn"
            onClick={() => navigate('/configuracoes')}
            title="Configurações"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export function Nav() {
  return (
    <nav className="nav" role="navigation" aria-label="Menu principal">
      <div className="nav-inner">
        {NAV.map(({ to, emoji, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => ['nav-btn', isActive ? 'active' : ''].filter(Boolean).join(' ')}
          >
            <span className="nav-emoji" aria-hidden="true">{emoji}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
