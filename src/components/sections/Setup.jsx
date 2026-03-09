import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Button, Input, Select } from '../ui'
import './Setup.css'

const MODALITIES = ['Misto','Masculino','Feminino','Sub-21','Masters','Beach Tennis','Duplas 60+']

export default function Setup() {
  const { createChampionship, isConfigured } = useApp()
  const [step, setStep]     = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm]     = useState({ name:'', modality:'Misto', edition: String(new Date().getFullYear()), location:'' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Obrigatório'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleStart = async () => {
    if (!validate()) return
    setLoading(true)
    await createChampionship(form)
    setLoading(false)
  }

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })) }

  return (
    <div className="setup-screen">
      <div className="setup-bg" aria-hidden="true" />

      <div className="setup-card anim-fadeUp">
        {/* Logo */}
        <div className="setup-logo-wrap">
          <div className="setup-wave">🏖️</div>
          <h1 className="setup-logo">FUTEVÔLEI</h1>
          <p className="setup-tagline">Championship Manager</p>
        </div>

        {/* Demo banner */}
        {!isConfigured && (
          <div className="setup-demo-notice">
            <span>⚡</span>
            <span>Rodando em <strong>modo demo</strong> — dados salvos localmente. Configure o Supabase para persistência real.</span>
          </div>
        )}

        {/* Form */}
        <div className="setup-form">
          <Input
            label="Nome do campeonato *"
            value={form.name}
            onChange={set('name')}
            placeholder="Ex: Copa Verão da Praia 2025"
            error={errors.name}
            autoFocus
          />

          <div className="fv-grid-2">
            <Select label="Modalidade principal" value={form.modality} onChange={set('modality')}>
              {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
            <Input label="Edição / Ano" value={form.edition} onChange={set('edition')} placeholder="2025" />
          </div>

          <Input label="Local (opcional)" value={form.location} onChange={set('location')} placeholder="Praia de Copacabana, Rio de Janeiro" />

          <Button variant="coral" size="xl" full onClick={handleStart} disabled={loading}>
            {loading ? '⏳ Criando...' : '🏐 INICIAR CAMPEONATO'}
          </Button>
        </div>

        <p className="setup-hint">Você poderá adicionar mais modalidades e dados depois.</p>
      </div>
    </div>
  )
}
