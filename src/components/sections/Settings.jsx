import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button } from '../ui'
import './Settings.css'

export default function Settings() {
  const { state, isDemo, isConfigured } = useApp()
  const navigate = useNavigate()
  const champ = state.championship

  return (
    <section className="page-section">
      <div className="settings-header">
        <button className="settings-back" onClick={() => navigate(-1)}>← Voltar</button>
        <h2 className="settings-title">Configurações</h2>
      </div>

      {/* Status */}
      <Card className="settings-card">
        <div className="settings-card-title">Status do Sistema</div>
        <div className="settings-row">
          <span>Modo de operação</span>
          {isDemo
            ? <Badge color="lime">Demo (local)</Badge>
            : <Badge color="ocean">Supabase conectado</Badge>
          }
        </div>
        <div className="settings-row">
          <span>Banco de dados</span>
          <span className={isConfigured ? 'txt-ok' : 'txt-warn'}>
            {isConfigured ? '✅ PostgreSQL (Supabase)' : '⚠️ Não configurado'}
          </span>
        </div>
        <div className="settings-row">
          <span>Tempo real</span>
          <span className={isConfigured ? 'txt-ok' : 'txt-warn'}>
            {isConfigured ? '✅ Ativo (WebSocket)' : '❌ Indisponível'}
          </span>
        </div>
      </Card>

      {/* Campeonato */}
      <Card className="settings-card">
        <div className="settings-card-title">Campeonato atual</div>
        <div className="settings-row"><span>Nome</span><strong>{champ?.name||'—'}</strong></div>
        <div className="settings-row"><span>Modalidade</span><span>{champ?.modality||'—'}</span></div>
        <div className="settings-row"><span>Edição</span><span>{champ?.edition||'—'}</span></div>
        <div className="settings-row"><span>Local</span><span>{champ?.location||'—'}</span></div>
        <div className="settings-row"><span>Status</span><Badge color="lime">{champ?.status||'active'}</Badge></div>
      </Card>

      {/* Modalidades */}
      <Card className="settings-card">
        <div className="settings-card-title">Modalidades ({state.modalities.length})</div>
        <div className="settings-mod-list">
          {state.modalities.map(m => (
            <Badge key={m} color="muted" style={{ margin: 3 }}>{m}</Badge>
          ))}
        </div>
      </Card>

      {/* Supabase setup */}
      {!isConfigured && (
        <Card className="settings-card settings-setup-card">
          <div className="settings-card-title">⚡ Configurar Supabase</div>
          <p className="settings-setup-text">
            Para salvar dados permanentemente e ter placares em tempo real, conecte ao Supabase:
          </p>
          <ol className="settings-setup-steps">
            <li>Crie um projeto gratuito em <strong>supabase.com</strong></li>
            <li>Execute o arquivo <code>supabase/schema.sql</code> no SQL Editor</li>
            <li>Copie <code>.env.example</code> para <code>.env.local</code></li>
            <li>Preencha <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code></li>
            <li>Reinicie o servidor com <code>npm run dev</code></li>
          </ol>
        </Card>
      )}

      {/* Stats */}
      <Card className="settings-card">
        <div className="settings-card-title">Resumo dos dados</div>
        <div className="settings-row"><span>Jogadores</span><strong>{state.players.length}</strong></div>
        <div className="settings-row"><span>Duplas</span><strong>{state.duos.length}</strong></div>
        <div className="settings-row"><span>Jogos</span><strong>{state.games.length}</strong></div>
        <div className="settings-row">
          <span>Jogos ao vivo</span>
          <strong style={{ color:'var(--coral)' }}>{state.games.filter(g=>g.status==='live').length}</strong>
        </div>
        <div className="settings-row"><span>Perfis</span><strong>{state.profiles.length}</strong></div>
      </Card>
    </section>
  )
}
