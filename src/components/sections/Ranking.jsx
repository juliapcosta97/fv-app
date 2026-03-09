import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SectionHeader, FilterBar, Card, Avatar, EmptyState, Button, Input, Select, Skeleton } from '../ui'
import Modal from '../ui/Modal'
import { rankMedal, fmtPts } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './Ranking.css'

export default function Ranking() {
  const { state, isReady, addPlayer, addModality } = useApp()
  const [filter, setFilter]           = useState('Todos')
  const [showAddPlayer, setShowPlayer] = useState(false)
  const [showAddMod, setShowMod]      = useState(false)
  const [saving, setSaving]           = useState(false)
  const [form, setForm]   = useState({ name:'', nick:'', city:'', modality:'', points:'' })
  const [modName, setMod] = useState('')

  const filtered = (filter === 'Todos'
    ? [...state.players]
    : state.players.filter(p => p.modality === filter)
  ).sort((a,b) => (b.points||0) - (a.points||0))

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleAddPlayer = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const { success } = await addPlayer({
      ...form,
      points: parseInt(form.points) || 0,
      modality: form.modality || state.modalities[0] || 'Geral',
    })
    setSaving(false)
    if (success !== false) {
      toast.success('Jogador adicionado! 🏐')
      setShowPlayer(false)
      setForm({ name:'', nick:'', city:'', modality:'', points:'' })
    }
  }

  const handleAddModality = async () => {
    if (!modName.trim()) return
    await addModality(modName.trim())
    toast.success(`Modalidade "${modName}" adicionada!`)
    setShowMod(false)
    setMod('')
  }

  return (
    <section className="page-section">
      <SectionHeader title="Ranking" accent="Jogadores" icon="🏆">
        <Button variant="ghost" size="sm" onClick={() => setShowMod(true)}>+ Modalidade</Button>
        <Button variant="coral" size="sm" onClick={() => setShowPlayer(true)}>+ Jogador</Button>
      </SectionHeader>

      <FilterBar options={state.modalities} current={filter} onChange={setFilter} />

      <Card>
        {!isReady
          ? <RankingSkeleton />
          : filtered.length === 0
          ? <EmptyState
              icon="🏐" title="Nenhum jogador cadastrado"
              text="Adicione jogadores para montar o ranking desta modalidade."
              action={<Button variant="primary" size="sm" onClick={() => setShowPlayer(true)}>Adicionar Jogador</Button>}
            />
          : (
            <ol className="ranking-list stagger">
              {filtered.map((player, i) => {
                const { color, emoji } = rankMedal(i)
                return (
                  <li key={player.id} className="ranking-item anim-fadeUp">
                    <span className="rank-pos" style={{ color }}>
                      {emoji || <span className="rank-num">{i + 1}</span>}
                    </span>
                    <Avatar name={player.name} size={46} ring />
                    <div className="rank-info">
                      <div className="rank-name">{player.nick || player.name}</div>
                      <div className="rank-meta">
                        {player.name !== (player.nick || player.name) && <span>{player.name}</span>}
                        {player.city && <span>📍 {player.city}</span>}
                        <span className="rank-modality">{player.modality}</span>
                      </div>
                    </div>
                    <div className="rank-right">
                      <div className="rank-points">{fmtPts(player.points)}</div>
                      <div className="rank-pts-label">pts</div>
                      <div className="rank-record">
                        <span className="txt-lime">{player.wins}V</span>
                        <span className="txt-coral">{player.losses}D</span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          )
        }
      </Card>

      {/* Add Player Modal */}
      <Modal open={showAddPlayer} onClose={() => setShowPlayer(false)} title="Novo Jogador">
        <div className="fv-grid-2">
          <Input label="Nome completo *" value={form.name} onChange={set('name')} placeholder="Nome" autoFocus />
          <Input label="Apelido" value={form.nick} onChange={set('nick')} placeholder="Apelido" />
          <Input label="Cidade" value={form.city} onChange={set('city')} placeholder="Cidade" />
          <Select label="Modalidade" value={form.modality || state.modalities[0]} onChange={set('modality')}>
            {state.modalities.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>
        <div style={{ marginTop: 14 }}>
          <Input label="Pontuação inicial" type="number" min="0" value={form.points} onChange={set('points')} placeholder="0" hint="Deixe 0 para começar do zero" />
        </div>
        <div className="fv-modal-actions">
          <Button variant="ghost" onClick={() => setShowPlayer(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAddPlayer} disabled={saving}>
            {saving ? '⏳ Salvando...' : 'ADICIONAR'}
          </Button>
        </div>
      </Modal>

      {/* Add Modality Modal */}
      <Modal open={showAddMod} onClose={() => setShowMod(false)} title="Nova Modalidade" width={400}>
        <Input label="Nome da modalidade" value={modName} onChange={e => setMod(e.target.value)} placeholder="Ex: Sub-21, Beach Tennis..." autoFocus />
        <div className="fv-modal-actions">
          <Button variant="ghost" onClick={() => setShowMod(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAddModality}>CRIAR</Button>
        </div>
      </Modal>
    </section>
  )
}

function RankingSkeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 0' }}>
          <Skeleton width={36} height={36} style={{ borderRadius:'50%' }} />
          <Skeleton width={46} height={46} style={{ borderRadius:'50%', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <Skeleton width="40%" height={16} style={{ marginBottom:6 }} />
            <Skeleton width="60%" height={12} />
          </div>
          <Skeleton width={60} height={24} />
        </div>
      ))}
    </div>
  )
}
