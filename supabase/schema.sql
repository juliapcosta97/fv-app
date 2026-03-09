-- ═══════════════════════════════════════════════════════════════
-- FUTEVÔLEI MANAGER — Schema PostgreSQL para Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- ═══════════════════════════════════════════════════════════════

-- ── Extensões ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ══════════════════════════════════════════
-- TABELAS
-- ══════════════════════════════════════════

-- Campeonatos
create table if not exists championships (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  edition     text,
  location    text,
  description text,
  status      text default 'active' check (status in ('active','finished','cancelled')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Modalidades de cada campeonato
create table if not exists modalities (
  id                uuid primary key default uuid_generate_v4(),
  championship_id   uuid not null references championships(id) on delete cascade,
  name              text not null,
  created_at        timestamptz default now(),
  unique (championship_id, name)
);

-- Jogadores
create table if not exists players (
  id                uuid primary key default uuid_generate_v4(),
  championship_id   uuid not null references championships(id) on delete cascade,
  name              text not null,
  nick              text,
  city              text,
  state             text,
  modality          text,
  points            int default 0,
  wins              int default 0,
  losses            int default 0,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Duplas
create table if not exists duos (
  id                uuid primary key default uuid_generate_v4(),
  championship_id   uuid not null references championships(id) on delete cascade,
  player1_id        uuid not null references players(id) on delete cascade,
  player2_id        uuid not null references players(id) on delete cascade,
  modality          text not null,
  wins              int default 0,
  losses            int default 0,
  sets_won          int default 0,
  sets_lost         int default 0,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  check (player1_id <> player2_id)
);

-- Jogos
create table if not exists games (
  id                uuid primary key default uuid_generate_v4(),
  championship_id   uuid not null references championships(id) on delete cascade,
  duo_a_id          uuid not null references duos(id) on delete cascade,
  duo_b_id          uuid not null references duos(id) on delete cascade,
  modality          text,
  phase             text,
  scheduled_time    text,
  status            text default 'upcoming' check (status in ('upcoming','live','finished','cancelled')),
  score_a           int default 0,
  score_b           int default 0,
  court             text,
  notes             text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  check (duo_a_id <> duo_b_id)
);

-- Perfis de pessoas (jogador, organizador, torcedor)
create table if not exists profiles (
  id                uuid primary key default uuid_generate_v4(),
  championship_id   uuid not null references championships(id) on delete cascade,
  name              text not null,
  nick              text,
  role              text default 'fan' check (role in ('player','organizer','fan')),
  city              text,
  bio               text,
  player_id         uuid references players(id) on delete set null,
  created_at        timestamptz default now()
);

-- ══════════════════════════════════════════
-- ÍNDICES
-- ══════════════════════════════════════════

create index if not exists idx_modalities_champ   on modalities(championship_id);
create index if not exists idx_players_champ      on players(championship_id);
create index if not exists idx_players_points     on players(points desc);
create index if not exists idx_duos_champ         on duos(championship_id);
create index if not exists idx_games_champ        on games(championship_id);
create index if not exists idx_games_status       on games(status);
create index if not exists idx_profiles_champ     on profiles(championship_id);

-- ══════════════════════════════════════════
-- TRIGGERS — updated_at automático
-- ══════════════════════════════════════════

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_championships_updated
  before update on championships
  for each row execute function update_updated_at();

create trigger trg_players_updated
  before update on players
  for each row execute function update_updated_at();

create trigger trg_duos_updated
  before update on duos
  for each row execute function update_updated_at();

create trigger trg_games_updated
  before update on games
  for each row execute function update_updated_at();

-- ══════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════
-- Por padrão, deixamos tudo público (leitura e escrita livres)
-- para facilitar campeonatos sem login.
-- Para adicionar autenticação depois, altere estas policies.

alter table championships enable row level security;
alter table modalities    enable row level security;
alter table players       enable row level security;
alter table duos          enable row level security;
alter table games         enable row level security;
alter table profiles      enable row level security;

-- Políticas de acesso público (leitura + escrita para anon)
create policy "public_all_championships" on championships for all to anon using (true) with check (true);
create policy "public_all_modalities"    on modalities    for all to anon using (true) with check (true);
create policy "public_all_players"       on players       for all to anon using (true) with check (true);
create policy "public_all_duos"          on duos          for all to anon using (true) with check (true);
create policy "public_all_games"         on games         for all to anon using (true) with check (true);
create policy "public_all_profiles"      on profiles      for all to anon using (true) with check (true);

-- ══════════════════════════════════════════
-- DADOS DE EXEMPLO (opcional — rode separado)
-- ══════════════════════════════════════════

/*
-- Descomente para inserir dados de demonstração:

insert into championships (id, name, edition, location, status) values
  ('00000000-0000-0000-0000-000000000001', 'Copa Verão da Praia', '2025', 'Praia de Copacabana, RJ', 'active');

insert into modalities (championship_id, name) values
  ('00000000-0000-0000-0000-000000000001', 'Misto'),
  ('00000000-0000-0000-0000-000000000001', 'Masculino'),
  ('00000000-0000-0000-0000-000000000001', 'Feminino');
*/
