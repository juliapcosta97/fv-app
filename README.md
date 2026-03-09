# ⚡ Futevôlei Manager

App completo de gestão de campeonatos de futevôlei.
**React + Vite · Supabase (PostgreSQL) · GitHub Pages · PWA**

---

## 🚀 Início rápido (modo demo)

```bash
# Clone ou extraia o projeto
cd futevolei-manager

# Instale as dependências
npm install

# Rode localmente (modo demo — sem banco de dados)
npm run dev
```

Abra http://localhost:5173 — o app funciona completamente em modo demo (dados na memória).

---

## 🗄️ Configurar Supabase (dados persistentes + tempo real)

### 1. Criar projeto gratuito

Acesse **https://supabase.com** → New Project.
O plano gratuito inclui:
- ✅ PostgreSQL 500 MB
- ✅ 2 GB de banda
- ✅ Realtime (WebSocket)
- ✅ Auth (opcional)
- ✅ 50.000 requests/mês

### 2. Criar o banco de dados

No painel do Supabase → **SQL Editor** → cole e execute o arquivo:
```
supabase/schema.sql
```

Isso cria todas as tabelas, índices, triggers e políticas de segurança.

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha o `.env.local`:
```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA
```

As chaves estão em: **Supabase → Project Settings → API**

### 4. Reiniciar

```bash
npm run dev
```

O app detecta automaticamente o Supabase e sai do modo demo.

---

## 🌐 Deploy no GitHub Pages (gratuito)

### 1. Ajustar o nome do repositório no vite.config.js

```js
// vite.config.js — linha ~14
base: mode === 'production' ? '/SEU_REPO/' : '/',
```

Substitua `SEU_REPO` pelo nome exato do seu repositório no GitHub.

### 2. Criar repositório e fazer push

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

### 3. Adicionar secrets no GitHub

**GitHub → Repo → Settings → Secrets and variables → Actions → New repository secret**

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon/pública do Supabase |

### 4. Ativar GitHub Pages

**GitHub → Repo → Settings → Pages → Source:** `GitHub Actions`

### 5. Fazer deploy

O deploy acontece automaticamente a cada `git push` na branch `main`.
Também pode ser acionado manualmente em: **Actions → Deploy to GitHub Pages → Run workflow**

**URL final:** `https://SEU_USUARIO.github.io/SEU_REPO/`

---

## 🧪 Testar localmente simulando produção

```bash
# Build de produção
npm run build

# Servir localmente (simula GitHub Pages)
npm run preview
```

Acesse http://localhost:4173 — idêntico ao ambiente de produção.

---

## 📱 PWA — Instalar no celular

O app já inclui suporte a PWA. Após acessar via HTTPS (GitHub Pages):
- **iOS:** Safari → Compartilhar → Adicionar à Tela de Início
- **Android:** Chrome → Menu → Adicionar à tela inicial

---

## 🗂️ Estrutura do projeto

```
futevolei-manager/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD automático
├── public/                     # Assets estáticos
├── src/
│   ├── components/
│   │   ├── ui/                 # Button, Card, Modal, Avatar...
│   │   ├── layout/             # Header + Nav
│   │   └── sections/           # Setup, Ranking, Games, Standings, Draw, Profiles, Settings
│   ├── context/
│   │   └── AppContext.jsx      # Estado global + integração Supabase
│   ├── lib/
│   │   └── supabase.js         # Cliente Supabase + helpers de banco
│   ├── utils/
│   │   └── helpers.js          # Utilitários + dados de demo
│   └── styles/
│       ├── globals.css         # Design tokens, reset, animações
│       └── components.css      # Classes do design system
├── supabase/
│   └── schema.sql              # Schema completo do banco
├── .env.example                # Template de variáveis de ambiente
├── vite.config.js              # Vite + PWA + build config
└── package.json
```

---

## 💡 Funcionalidades

| Funcionalidade | Demo | Com Supabase |
|---|:---:|:---:|
| Ranking de jogadores | ✅ | ✅ |
| Tabela de jogos + resultados | ✅ | ✅ |
| Classificação de duplas | ✅ | ✅ |
| Sorteio de confrontos | ✅ | ✅ |
| Múltiplas modalidades | ✅ | ✅ |
| Perfis (jogador/org/torcedor) | ✅ | ✅ |
| Dados persistentes | ❌ | ✅ |
| Placares em tempo real | ❌ | ✅ |
| Multi-dispositivo | ❌ | ✅ |
| Instalável (PWA) | ✅ | ✅ |

---

## ⚡ Tempo real

Com Supabase configurado, placares e resultados atualizam automaticamente em todos os dispositivos via WebSocket — sem precisar recarregar a página.

---

## 🔒 Segurança

O schema inclui Row Level Security (RLS) com políticas públicas — qualquer pessoa pode ler e escrever. Para adicionar autenticação:

1. Ative o Supabase Auth
2. Troque as policies para `auth.uid() is not null`
3. Adicione login no frontend

---

## 📦 Dependências principais

| Pacote | Versão | Uso |
|---|---|---|
| react | 18 | UI |
| react-router-dom | 6 | Roteamento |
| @supabase/supabase-js | 2 | Banco de dados + realtime |
| react-hot-toast | 2 | Notificações |
| lucide-react | latest | Ícones |
| vite-plugin-pwa | latest | PWA |
