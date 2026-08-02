create extension if not exists pgcrypto;

create type member_role as enum ('viewer','debater','admin','coach','platform_admin');
create type card_status as enum ('verified','duplicate','near_duplicate','invalid','suspicious','under_review','deleted');
create type anomaly_status as enum ('normal','monitor','requires_review','temporarily_excluded','approved','rejected');
create type card_event_type as enum ('CARD_CREATED','CARD_DELETED','CARD_REASSIGNED','CARD_DUPLICATED','CARD_INVALIDATED','CARD_RESTORED','CARD_APPROVED','CARD_REJECTED');

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);
create table team_members (
  team_id uuid not null references teams(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role member_role not null default 'debater',
  active boolean not null default true,
  primary key (team_id,user_id)
);
create table tag_aliases (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  alias text not null,
  approved boolean not null default false,
  unique(team_id,alias)
);
create table drive_connections (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  connected_by uuid not null references users(id),
  google_subject text not null,
  root_file_id text not null,
  root_name text not null,
  encrypted_refresh_token text not null,
  change_page_token text,
  status text not null default 'active',
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  unique(team_id,root_file_id)
);
comment on table drive_connections is 'Folder configuration is writable only by team admins; refresh tokens must be encrypted before insertion.';
create table watch_channels (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  connection_id uuid not null references drive_connections(id) on delete cascade,
  google_channel_id text not null unique,
  resource_id text not null,
  verification_token_hash text not null,
  expires_at timestamptz not null
);
create table documents (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  connection_id uuid not null references drive_connections(id) on delete cascade,
  drive_file_id text not null,
  name text not null,
  mime_type text not null,
  source_url text,
  drive_modified_at timestamptz not null,
  active_version_id uuid,
  deleted_at timestamptz,
  unique(team_id,drive_file_id)
);
create table document_versions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  document_id uuid not null references documents(id) on delete cascade,
  source_revision text not null,
  content_hash text not null,
  parse_status text not null,
  error_message text,
  observed_at timestamptz not null default now(),
  unique(document_id,source_revision)
);
alter table documents add constraint documents_active_version_fk foreign key(active_version_id) references document_versions(id);
create table cards (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  document_id uuid not null references documents(id) on delete cascade,
  version_id uuid not null references document_versions(id),
  cutter_user_id uuid references users(id),
  cutter_tag text not null,
  raw_text text,
  normalized_text text not null,
  exact_hash text not null,
  evidence_hash text,
  citation text,
  source_url text,
  start_position integer not null,
  end_position integer not null,
  first_observed_at timestamptz not null,
  last_observed_at timestamptz not null,
  status card_status not null,
  historical_import boolean not null default false
);
create index cards_team_user_status_idx on cards(team_id,cutter_user_id,status);
create index cards_team_exact_hash_idx on cards(team_id,exact_hash);
create index cards_document_idx on cards(document_id);
create table duplicate_groups (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  canonical_card_id uuid references cards(id),
  method text not null,
  similarity numeric(5,4),
  created_at timestamptz not null default now()
);
create table card_events (
  id bigint generated always as identity primary key,
  team_id uuid not null references teams(id) on delete cascade,
  card_id uuid not null references cards(id),
  user_id uuid references users(id),
  document_id uuid not null references documents(id),
  event_type card_event_type not null,
  points_delta integer not null default 0,
  source_revision text not null,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index card_events_leaderboard_idx on card_events(team_id,occurred_at,user_id);
create table anomaly_flags (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  card_id uuid references cards(id),
  user_id uuid references users(id),
  score numeric(5,2) not null,
  status anomaly_status not null,
  signals jsonb not null,
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now()
);
create table leaderboard_periods (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  name text not null,
  starts_at timestamptz,
  ends_at timestamptz
);
create table leaderboard_snapshots (
  id bigint generated always as identity primary key,
  team_id uuid not null references teams(id) on delete cascade,
  period_id uuid references leaderboard_periods(id),
  user_id uuid not null references users(id),
  raw_count integer not null,
  verified_count integer not null,
  captured_at timestamptz not null default now()
);
create table sync_jobs (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  connection_id uuid not null references drive_connections(id),
  idempotency_key text not null unique,
  status text not null,
  attempts integer not null default 0,
  error jsonb,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create table audit_logs (
  id bigint generated always as identity primary key,
  team_id uuid not null references teams(id) on delete cascade,
  actor_id uuid references users(id),
  action text not null,
  target_type text not null,
  target_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table teams enable row level security;
alter table cards enable row level security;
alter table card_events enable row level security;
alter table anomaly_flags enable row level security;
create policy team_read on teams for select using (exists(select 1 from team_members m where m.team_id=id and m.user_id=auth.uid()));
create policy card_team_read on cards for select using (exists(select 1 from team_members m where m.team_id=cards.team_id and m.user_id=auth.uid()));
create policy event_team_read on card_events for select using (exists(select 1 from team_members m where m.team_id=card_events.team_id and m.user_id=auth.uid()));
create policy anomaly_admin_all on anomaly_flags for all using (exists(select 1 from team_members m where m.team_id=anomaly_flags.team_id and m.user_id=auth.uid() and m.role in ('admin','coach','platform_admin')));
alter table drive_connections enable row level security;
create policy drive_admin_read on drive_connections for select using (exists(select 1 from team_members m where m.team_id=drive_connections.team_id and m.user_id=auth.uid() and m.role in ('admin','coach','platform_admin')));
