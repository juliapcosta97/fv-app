import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { SectionHeader, Card, Button, Select } from '../ui'
import { PHASES, shuffle, duoDisplayName } from '../../utils/helpers'
import toast from 'react-hot-toast'
import './Draw.css'

export default function Draw() {
  const { state, addGame } = useApp()
  const [modality, setModality] = useState('Todos')
  const [phase, setPhase]       = useState(PHASES[0])
  const [pairs, setPairs]       = useState([])
  const [spinning, setSpinning] = useState(false)
  const [saved, setSaved]       = useState(false)

  const handleDraw = () => {
    const pool = modality === 'Todos'
      ? state.duos
      : state.duos.filter(d => d.modality === modality)

    if (pool.length < 2) { toast.error('Precisa de pelo menos 2 duplas'); return }

    setSpinning(true)
    setSaved(false)
    setPairs([])

    setTimeout(() => {
      const shuffled = shuffle(pool)
      const result   = []
      for (let i = 0; i < shuffled.length - 1; i += 2) result.push([shuffled[i], shuffled[i+1]])
      if (shuffled.length % 2 !== 0) result.push([shuffled[shuffled.length-1], null])
      setPairs(result)
      setSpinning(false)
      toast.success(`${result.filter(([,b])=>b).length} confronto(s) sorteado(s)! 🎲`)
    }, 800)
  }

  const handleSave = async () => {
    const real = pairs.filter(([,b]) => b !== null)
    for (const [a, b] of real) {
      await addGame({
        duo_a_id: a.id, duo_b_id: b.id,
        modality: a.modality || modality,
        phase,
        status: 'upcoming',
      })
    }
    setSaved(true)
    toast.success(`${real.length} jogo(s) adicionado(s) à tabela!`)
  }

  return (
    <section className="page-section">
      <SectionHeader title="Sorteio de" accent="Confrontos" icon="🎲" />

      <Card className="draw-config">
        <div className="fv-grid-2">
          <Select label="Modalidade" value={modality} onChange={e => { setModality(e.target.value); setPairs([]) }}>
            <option value="Todos">Todas</option>
            {state.modalities.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select label="Fase" value={phase} onChange={e => setPhase(e.target.value)}>
            {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
        </div>

        <div className="draw-info">
          <span className="draw-count">
            {(() => {
              const n = modality==='Todos' ? state.duos.length : state.duos.filter(d=>d.modality===modality).length
              return `${n} dupla${n!==1?'s':''} ${n!==1?'disponíveis':'disponível'}`
            })()}
          </span>
        </div>

        <Button
          variant="coral"
          size="xl"
          full
          onClick={handleDraw}
          disabled={spinning}
          className="draw-btn"
        >
          {spinning
            ? <><span className="draw-spinner" />Sorteando...</>
            : '🎲 REALIZAR SORTEIO'
          }
        </Button>
      </Card>

      {pairs.length > 0 && (
        <div className="draw-results">
          <div className="draw-results-header">
            <h3 className="draw-results-title">
              Confrontos — <span style={{ color:'var(--lime)' }}>{phase}</span>
            </h3>
            {!saved
              ? <Button variant="lime" size="sm" onClick={handleSave}>💾 Salvar na Tabela</Button>
              : <span className="draw-saved">✅ Salvo na tabela</span>
            }
          </div>

          <div className="draw-pairs stagger">
            {pairs.map(([a, b], i) => (
              <div key={i} className="draw-pair anim-fadeUp">
                <div className="draw-pair-num">Confronto {i+1}</div>
                <div className="draw-pair-team">{duoDisplayName(a)}</div>
                <div className="draw-pair-vs">VS</div>
                {b
                  ? <div className="draw-pair-team">{duoDisplayName(b)}</div>
                  : <div className="draw-pair-bye">BYE — passa direto</div>
                }
                <div className="draw-pair-mod">{a.modality}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
