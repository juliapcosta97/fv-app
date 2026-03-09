export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export const initials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase()

const GRADIENTS = [
  ['#1B9CC4','#0A4D6E'], ['#E85D3A','#8B2010'], ['#B5D922','#6B8A00'],
  ['#9B59B6','#5B2C8B'], ['#E67E22','#8B4A00'], ['#1ABC9C','#0A6B55'],
  ['#E91E93','#8B0050'], ['#3498DB','#1A5580'], ['#F39C12','#9B5E00'],
]
export const avatarGradient = (str = '') => {
  const h = [...str].reduce((a, c) => a + c.charCodeAt(0), 0)
  const [a, b] = GRADIENTS[Math.abs(h) % GRADIENTS.length]
  return `linear-gradient(135deg,${a},${b})`
}

export const formatTime = (t) => t || '--:--'

export const rankMedal = (i) =>
  i === 0 ? { color: '#FFD700', symbol: '🥇' } :
  i === 1 ? { color: '#C0C0C0', symbol: '🥈' } :
  i === 2 ? { color: '#CD7F32', symbol: '🥉' } :
  { color: 'var(--text-muted)', symbol: null }

export const statusCfg = {
  live:     { label: 'Ao Vivo',    color: 'var(--coral)',      dot: true  },
  finished: { label: 'Finalizado', color: 'var(--lime)',       dot: false },
  upcoming: { label: 'Agendado',   color: 'var(--text-muted)', dot: false },
}

export const PHASES = [
  'Fase de Grupos','Oitavas de Final','Quartas de Final','Semifinal','Final',
]

export const MODALITIES_DEFAULT = [
  'Misto','Masculino','Feminino','Sub-21','Masters',
]

export const roleCfg = {
  player:    { label: 'Jogador',     emoji: '🏐', color: 'var(--ocean-light)' },
  organizer: { label: 'Organizador', emoji: '📋', color: 'var(--lime)'        },
  fan:       { label: 'Torcedor',    emoji: '📣', color: 'var(--coral-light)' },
}

export const shuffle = arr => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const clsx = (...args) => args.filter(Boolean).join(' ')
