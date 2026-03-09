import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SectionHeader, FilterBar, EmptyState, Button, Select, Input, LiveDot } from '../ui'
import Modal from '../ui/Modal'
import { STATUS, PHASES, duoDisplayName, fmtTime } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './Games.css'

export default function Games() {
  const { state, isReady, addGame, updateGame, deleteGame } = useApp()
  const [filter, setFilter]     = useState('Todos')
  const [showAdd, setShowAdd]   = useState(false)
  const [resultGame, setResult] = useState(null)
  const [saving, setSaving]     = useState(false)

  const [addForm, setAddForm] = useState({ duo_a_id:'', duo_b_id:'', modality:'', phase: PHASES[0], scheduled_time:'', court:'' })
  const [resForm, setResForm] = useState({ score_a:'', score_b:'', status:'finished' })

  const filtered = (filter === 'Todos' ? [...state.games] : state.games.filter(g => g.modality === filter))
    .sort((a, b) => {
      const o = { live:0, upcoming:1, finished:2, cancelled:3 }
      return (o[a.status]??2) - (o[b.status]??2)
    })

  const duoOpts = state.duos.map(d => ({ value: d.id, label: duoDisplayName(d) }))

  const handleAdd = async () => {
    if (!addForm.duo_a_id || !addForm.duo_b_id || addForm.duo_a_id === addForm.duo_b_id) {
      toast.error('Selecione duplas diferentes')
      return
    }
    setSaving(true)
    await addGame({ ...addForm, modality: addForm.modality || state.modalities[0] || 'Geral' })
    setSaving(false)
    toast.success('Jogo agendado! 📋')
    setShowAdd(false)
    setAddForm({ duo_a_id:'', duo_b_id:'', modality:'', phase: PHASES[0], scheduled_time:'', court:'' })
  }

  const openResult = (g) => {
    setResult(g)
    setResForm({ score_a: g.score_a||'', score_b: g.score_b||'', status: g.status === 'upcoming' ? 'live' : g.status })
  }

  const handleSaveResult = async () => {
    setSaving(true)
    await updateGame(resultGame.id, {
      score_a: parseInt(resForm.score_a)||0,
      score_b: parseInt(resForm.score_b)||0,
      status: resForm.status,
    })
    setSaving(false)
    toast.success('Resultado salvo! ✅')
    setResult(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover este jogo?')) return
    await deleteGame(id)
    toast.success('Jogo removido')
    setResult(null)
  }

  return (
    <section className="page-section">
      <SectionHeader title="Tabela de" accent="Jogos" icon="📋">
        <Button variant="coral" size="sm" onClick={() => setShowAdd(true)}>+ Jogo</Button>
      </SectionHeader>

      <FilterBar options={state.modalities} current={filter} onChange={setFilter} />

      {filtered.length === 0 && isReady
        ? <EmptyState icon="📋" title="Nenhum jogo cadastrado"
            text="Agende um jogo ou realize um sorteio para gerar confrontos."
            action={<Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>Agendar Jogo</Button>}
          />
        : (
          <div className="games-list stagger">
            {filtered.map(game => (
              <GameCard key={game.id} game={game} onClick={openResult} />
            ))}
          </div>
        )
      }

      {/* Add Game Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Novo Jogo">
        <div className="fv-grid-2">
          <Select label="Dupla A *" value={addForm.duo_a_id} onChange={e => setAddForm(f => ({ ...f, duo_a_id: e.target.value }))}>
            <option value="">Selecionar...</option>
            {duoOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
          <Select label="Dupla B *" value={addForm.duo_b_id} onChange={e => setAddForm(f => ({ ...f, duo_b_id: e.target.value }))}>
            <option value="">Selecionar...</option>
            {duoOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
          <Select label="Modalidade" value={addForm.modality || state.modalities[0]} onChange={e => setAddForm(f => ({ ...f, modality: e.target.value }))}>
            {state.modalities.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select label="Fase" value={addForm.phase} onChange={e => setAddForm(f => ({ ...f, phase: e.target.value }))}>
            {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
          <Input label="Horário" type="time" value={addForm.scheduled_time} onChange={e => setAddForm(f => ({ ...f, scheduled_time: e.target.value }))} />
          <Input label="Quadra / Local" value={addForm.court} onChange={e => setAddForm(f => ({ ...f, court: e.target.value }))} placeholder="Ex: Quadra 1" />
        </div>
        <div className="fv-modal-actions">
          <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAdd} disabled={saving}>
            {saving ? '⏳...' : 'AGENDAR'}
          </Button>
        </div>
      </Modal>

      {/* Result Modal */}
      <Modal open={!!resultGame} onClose={() => setResult(null)} title="Resultado do Jogo" width={440}>
        {resultGame && (
          <>
            <div className="result-teams">
              <div className="result-team">
                <div className="result-team-name">{duoDisplayName(resultGame.duo_a)}</div>
                <input
                  className="result-score-input"
                  type="number" min="0" max="99"
                  value={resForm.score_a}
                  onChange={e => setResForm(f => ({ ...f, score_a: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="result-vs">×</div>
              <div className="result-team">
                <div className="result-team-name">{duoDisplayName(resultGame.duo_b)}</div>
                <input
                  className="result-score-input"
                  type="number" min="0" max="99"
                  value={resForm.score_b}
                  onChange={e => setResForm(f => ({ ...f, score_b: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>
            <Select label="Status" value={resForm.status} onChange={e => setResForm(f => ({ ...f, status: e.target.value }))}>
              <option value="live">🔴 Ao Vivo</option>
              <option value="finished">✅ Finalizado</option>
              <option value="upcoming">⏳ Agendado</option>
              <option value="cancelled">❌ Cancelado</option>
            </Select>
            <div className="fv-modal-actions">
              <Button variant="danger" size="sm" onClick={() => handleDelete(resultGame.id)}>Excluir</Button>
              <Button variant="ghost" onClick={() => setResult(null)}>Cancelar</Button>
              <Button variant="lime" onClick={handleSaveResult} disabled={saving}>
                {saving ? '⏳...' : 'SALVAR'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}

function GameCard({ game, onClick }) {
  const cfg       = STATUS[game.status] || STATUS.upcoming
  const isDone    = game.status === 'finished'
  const isLive    = game.status === 'live'
  const showScore = isDone || isLive
  const la        = duoDisplayName(game.duo_a)
  const lb        = duoDisplayName(game.duo_b)
  const wA        = isDone && game.score_a > game.score_b
  const wB        = isDone && game.score_b > game.score_a

  return (
    <div
      className={['game-card', `game-${game.status}`, 'anim-fadeUp'].join(' ')}
      onClick={() => onClick(game)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(game)}
    >
      <div className="game-team">
        <div className={['game-team-name', wA ? 'winner' : ''].filter(Boolean).join(' ')}>
          {la.split('/')[0]}
        </div>
        <div className="game-team-partner">/{la.split('/')[1]?.trim()}</div>
      </div>

      <div className="game-center">
        {showScore
          ? <div className="game-score">
              <span style={{ color: wA ? 'var(--lime)' : 'inherit' }}>{game.score_a}</span>
              <span className="game-score-sep">·</span>
              <span style={{ color: wB ? 'var(--lime)' : 'inherit' }}>{game.score_b}</span>
            </div>
          : <div className="game-vs">vs</div>
        }
        <div className="game-status-row" style={{ color: cfg.color }}>
          {cfg.dot && <LiveDot />}
          <span>{cfg.label}</span>
        </div>
        <div className="game-meta">{game.phase} · {fmtTime(game.scheduled_time)}</div>
        {game.court && <div className="game-court">{game.court}</div>}
      </div>

      <div className="game-team game-team-right">
        <div className={['game-team-name', wB ? 'winner' : ''].filter(Boolean).join(' ')}>
          {lb.split('/')[0]}
        </div>
        <div className="game-team-partner">/{lb.split('/')[1]?.trim()}</div>
      </div>
    </div>
  )
}
