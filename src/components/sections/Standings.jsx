import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SectionHeader, FilterBar, Card, Avatar, EmptyState, Button, Select } from '../ui'
import Modal from '../ui/Modal'
import { sortDuos, duoDisplayName } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './Standings.css'

const POS = [
  { bg:'rgba(255,215,0,0.12)',  color:'#FFD700', border:'rgba(255,215,0,0.3)'    },
  { bg:'rgba(192,192,192,0.1)', color:'#C0C0C0', border:'rgba(192,192,192,0.25)' },
  { bg:'rgba(205,127,50,0.1)',  color:'#CD7F32', border:'rgba(205,127,50,0.25)'  },
]

export default function Standings() {
  const { state, isReady, addDuo, deleteDuo } = useApp()
  const [filter, setFilter] = useState('Todos')
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({ player1_id:'', player2_id:'', modality:'' })

  const filtered = sortDuos(
    filter === 'Todos' ? state.duos : state.duos.filter(d => d.modality === filter)
  )

  const playerOpts = state.players.map(p => ({ value: p.id, label: `${p.nick||p.name} — ${p.modality}` }))

  const handleAdd = async () => {
    if (!form.player1_id || !form.player2_id || form.player1_id === form.player2_id) {
      toast.error('Selecione jogadores diferentes')
      return
    }
    setSaving(true)
    const { success } = await addDuo({ ...form, modality: form.modality || state.modalities[0] || 'Geral' })
    setSaving(false)
    if (success !== false) {
      toast.success('Dupla criada! 👥')
      setShowAdd(false)
      setForm({ player1_id:'', player2_id:'', modality:'' })
    }
  }

  return (
    <section className="page-section">
      <SectionHeader title="Classificação" accent="Duplas" icon="📊">
        <Button variant="coral" size="sm" onClick={() => setShowAdd(true)}>+ Dupla</Button>
      </SectionHeader>

      <FilterBar options={state.modalities} current={filter} onChange={setFilter} />

      {filtered.length === 0 && isReady
        ? <EmptyState icon="👥" title="Nenhuma dupla cadastrada"
            text="Crie duplas para montar a classificação."
            action={<Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>Criar Dupla</Button>}
          />
        : (
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div className="standings-scroll">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th style={{ textAlign:'left' }}>Dupla</th>
                    <th title="Jogos">J</th>
                    <th title="Vitórias" className="th-green">V</th>
                    <th title="Derrotas" className="th-red">D</th>
                    <th title="Saldo de Sets">SS</th>
                    <th title="Pontos" className="th-pts">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((duo, i) => {
                    const p1  = duo.player1 || state.players.find(p => p.id === duo.player1_id)
                    const p2  = duo.player2 || state.players.find(p => p.id === duo.player2_id)
                    const j   = (duo.wins||0) + (duo.losses||0)
                    const sg  = (duo.sets_won||0) - (duo.sets_lost||0)
                    const pts = (duo.wins||0) * 3
                    const pos = POS[i]

                    return (
                      <tr key={duo.id} className={i < 3 ? 'top-row' : ''}>
                        <td>
                          <div
                            className="pos-badge"
                            style={pos ? { background:pos.bg, color:pos.color, border:`1px solid ${pos.border}` } : {}}
                          >
                            {i+1}
                          </div>
                        </td>
                        <td>
                          <div className="duo-cell">
                            <div className="duo-avatars">
                              <Avatar name={p1?.name||'?'} size={32} />
                              <Avatar name={p2?.name||'?'} size={32} style={{ marginLeft:-10, border:'2px solid var(--dark-3)' }} />
                            </div>
                            <div>
                              <div className="duo-name">
                                {p1?.nick||p1?.name||'?'} / {p2?.nick||p2?.name||'?'}
                              </div>
                              <div className="duo-meta">{duo.modality}</div>
                            </div>
                          </div>
                        </td>
                        <td className="td-num">{j}</td>
                        <td className="td-num td-win">{duo.wins||0}</td>
                        <td className="td-num td-loss">{duo.losses||0}</td>
                        <td className="td-num">{sg>0?`+${sg}`:sg}</td>
                        <td className="td-num td-pts">{pts}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )
      }

      {/* Add Duo Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Nova Dupla" width={440}>
        <div className="fv-grid-2" style={{ marginBottom:14 }}>
          <Select label="Jogador 1 *" value={form.player1_id} onChange={e => setForm(f => ({ ...f, player1_id: e.target.value }))}>
            <option value="">Selecionar...</option>
            {playerOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
          <Select label="Jogador 2 *" value={form.player2_id} onChange={e => setForm(f => ({ ...f, player2_id: e.target.value }))}>
            <option value="">Selecionar...</option>
            {playerOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </div>
        <Select label="Modalidade" value={form.modality || state.modalities[0]} onChange={e => setForm(f => ({ ...f, modality: e.target.value }))}>
          {state.modalities.map(m => <option key={m} value={m}>{m}</option>)}
        </Select>
        <div className="fv-modal-actions">
          <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleAdd} disabled={saving}>
            {saving ? '⏳...' : 'CRIAR DUPLA'}
          </Button>
        </div>
      </Modal>
    </section>
  )
}
