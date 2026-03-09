import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SectionHeader, Card, Avatar, Button, Input, Select, Badge, StatBox, Divider, EmptyState } from '../ui'
import Modal from '../ui/Modal'
import { ROLES, sortDuos, duoDisplayName } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './Profiles.css'

export default function Profiles() {
  const { state, isReady, addProfile, deleteProfile } = useApp()
  const [activeId, setActiveId] = useState(null)
  const [showAdd, setShowAdd]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [form, setForm] = useState({ name:'', nick:'', role:'player', city:'', bio:'' })

  const active = state.profiles.find(p => p.id === activeId) || state.profiles[0]

  const handleAdd = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const { success } = await addProfile(form)
    setSaving(false)
    if (success !== false) {
      toast.success('Perfil criado!')
      setShowAdd(false)
      setForm({ name:'', nick:'', role:'player', city:'', bio:'' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover este perfil?')) return
    await deleteProfile(id)
    toast.success('Perfil removido')
    setActiveId(null)
  }

  return (
    <section className="page-section">
      <SectionHeader title="Visualização" accent="Perfis" icon="👤">
        <Button variant="coral" size="sm" onClick={() => setShowAdd(true)}>+ Pessoa</Button>
      </SectionHeader>

      {/* Person chips */}
      {state.profiles.length > 0 && (
        <div className="profile-chips">
          {state.profiles.map(p => {
            const r = ROLES[p.role]
            const isActive = p.id === (active?.id)
            return (
              <button
                key={p.id}
                className={['profile-chip', isActive ? 'active' : ''].filter(Boolean).join(' ')}
                onClick={() => setActiveId(p.id)}
              >
                <Avatar name={p.name} size={28} />
                <span>{p.nick || p.name}</span>
                <span className="chip-emoji">{r?.emoji}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Profile card */}
      {!isReady ? null
        : !active
        ? <EmptyState icon="👤" title="Nenhum perfil cadastrado"
            text="Adicione perfis de jogadores, organizadores e torcedores."
            action={<Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>Criar Perfil</Button>}
          />
        : <ProfileCard key={active.id} person={active} state={state} onDelete={handleDelete} />
      }

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Novo Perfil">
        <div className="fv-grid-2">
          <Input label="Nome completo *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome" autoFocus />
          <Input label="Apelido" value={form.nick} onChange={e => setForm(f => ({ ...f, nick: e.target.value }))} placeholder="Apelido" />
          <Select label="Tipo de perfil" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
            <option value="player">🏐 Jogador</option>
            <option value="organizer">📋 Organizador</option>
            <option value="fan">📣 Torcedor</option>
          </Select>
          <Input label="Cidade" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Cidade" />
        </div>
        <div style={{ marginTop: 14 }}>
          <Input label="Bio (opcional)" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Uma frase sobre você..." />
        </div>
        <div className="fv-modal-actions">
          <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAdd} disabled={saving}>
            {saving ? '⏳...' : 'CRIAR PERFIL'}
          </Button>
        </div>
      </Modal>
    </section>
  )
}

function ProfileCard({ person, state, onDelete }) {
  const r = ROLES[person.role]
  const heroBg = person.role === 'player'
    ? 'rgba(13,110,154,0.3)'
    : person.role === 'organizer'
    ? 'rgba(90,140,20,0.25)'
    : 'rgba(160,50,30,0.25)'

  return (
    <div className="profile-card anim-scaleIn">
      {/* Hero */}
      <div className="prof-hero" style={{ background: `linear-gradient(145deg, ${heroBg}, transparent)` }}>
        <Avatar name={person.name} size={80} ring className="prof-avatar" />
        <h2 className="prof-name">{person.name}</h2>
        {person.nick && <p className="prof-nick">"{person.nick}"</p>}
        <div className="prof-meta-row">
          {person.city && <span>📍 {person.city}</span>}
        </div>
        {person.bio && <p className="prof-bio">"{person.bio}"</p>}
        <Badge color={person.role === 'player' ? 'ocean' : person.role === 'organizer' ? 'lime' : 'coral'}>
          {r?.emoji} {r?.label}
        </Badge>
      </div>

      {/* Body */}
      <div className="prof-body">
        {person.role === 'player'    && <PlayerStats  person={person} state={state} />}
        {person.role === 'organizer' && <OrgStats     state={state} />}
        {person.role === 'fan'       && <FanStats     state={state} />}

        <div style={{ marginTop: 20, display:'flex', justifyContent:'flex-end' }}>
          <Button variant="danger" size="sm" onClick={() => onDelete(person.id)}>Excluir perfil</Button>
        </div>
      </div>
    </div>
  )
}

function PlayerStats({ person, state }) {
  const player = state.players.find(p =>
    p.id === person.player_id ||
    p.name.toLowerCase() === person.name.toLowerCase()
  )
  const duos = player ? state.duos.filter(d => d.player1_id === player.id || d.player2_id === player.id) : []
  const rank = player
    ? [...state.players].sort((a,b)=>b.points-a.points).findIndex(p=>p.id===player.id)+1
    : null

  return (
    <>
      <div className="prof-stats-grid">
        <StatBox value={player?.points?.toLocaleString('pt-BR')||'—'} label="Pontos" color="lime" />
        <StatBox value={player?.wins??'—'} label="Vitórias" color="lime" />
        <StatBox value={player?.losses??'—'} label="Derrotas" color="coral" />
        <StatBox value={rank ? `#${rank}` : '—'} label="Ranking" color="ocean" />
      </div>
      {duos.length > 0 && (
        <>
          <Divider style={{ margin:'18px 0' }} />
          <div className="prof-section-label">Duplas</div>
          {duos.map(d => {
            const partner = state.players.find(p =>
              p.id === (d.player1_id === player.id ? d.player2_id : d.player1_id)
            )
            return (
              <div key={d.id} className="prof-duo-row">
                <Avatar name={partner?.name||'?'} size={36} />
                <div>
                  <div className="prof-duo-name">{partner?.nick||partner?.name||'?'}</div>
                  <div className="prof-duo-meta">{d.modality} · {d.wins||0}V {d.losses||0}D</div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </>
  )
}

function OrgStats({ state }) {
  const finished = state.games.filter(g => g.status === 'finished').length
  const pct = state.games.length ? Math.round((finished / state.games.length) * 100) : 0

  return (
    <>
      <div className="prof-stats-grid">
        <StatBox value={state.games.length}   label="Jogos" />
        <StatBox value={state.duos.length}    label="Duplas" />
        <StatBox value={state.players.length} label="Jogadores" />
        <StatBox value={state.modalities.length} label="Modalidades" />
      </div>
      <Divider style={{ margin:'18px 0' }} />
      <div className="prof-section-label">Campeonato</div>
      <div className="prof-champ-box">
        <div className="prof-champ-name">{state.championship?.name}</div>
        <div className="prof-champ-meta">
          {[state.championship?.edition, state.championship?.location].filter(Boolean).join(' · ')}
        </div>
        <div className="prof-progress">
          <div className="prof-progress-track">
            <div className="prof-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="prof-progress-label">{finished}/{state.games.length} jogos concluídos ({pct}%)</span>
        </div>
      </div>
    </>
  )
}

function FanStats({ state }) {
  const topDuos = sortDuos(state.duos).slice(0, 3)
  return (
    <>
      <div className="prof-stats-grid">
        <StatBox value={state.games.filter(g=>g.status==='finished').length} label="Jogos acompanhados" />
        <StatBox value={state.players.length} label="Ídolos" />
        <StatBox value="⭐" label="Fã fiel" />
        <StatBox value={state.modalities.length} label="Modalidades" />
      </div>
      {topDuos.length > 0 && (
        <>
          <Divider style={{ margin:'18px 0' }} />
          <div className="prof-section-label">Top Duplas 🏆</div>
          {topDuos.map((d, i) => (
            <div key={d.id} className="prof-duo-row">
              <span style={{ fontFamily:'var(--font-display)', fontSize:20, width:24 }}>{['🥇','🥈','🥉'][i]}</span>
              <div>
                <div className="prof-duo-name">{duoDisplayName(d)}</div>
                <div className="prof-duo-meta">{d.wins||0} vitórias · {d.modality}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}
