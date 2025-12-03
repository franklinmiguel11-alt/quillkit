-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  plan_type text check (plan_type in ('free', 'starter', 'pro', 'enterprise')) default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  api_key text unique,
  documents_used_this_month integer default 0,
  api_calls_this_month integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TEMPLATES TABLE
create table public.templates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  pdf_url text not null,
  fields jsonb default '[]'::jsonb,
  is_public boolean default false,
  times_used integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DOCUMENTS TABLE
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  original_pdf_url text not null,
  status text check (status in ('draft', 'sent', 'viewed', 'signed', 'expired')) default 'draft',
  template_id uuid references public.templates(id) on delete set null,
  recipients jsonb default '[]'::jsonb,
  fields jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sent_at timestamp with time zone,
  expires_at timestamp with time zone,
  signed_pdf_url text,
  audit_log jsonb default '[]'::jsonb,
  signing_token text unique,
  custom_branding jsonb
);

-- SIGNATURES TABLE
create table public.signatures (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  signer_email text not null,
  signer_name text,
  ip_address text,
  user_agent text,
  signature_data text,
  signed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  verification_token text,
  onboarding_completed boolean default false
);

-- SAVED SIGNATURES TABLE
create table public.saved_signatures (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  type text check (type in ('drawn', 'typed')) not null,
  signature_data text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TEMPLATES TABLE
create table public.templates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  original_pdf_url text not null,
  fields jsonb default '[]'::jsonb,
  recipient_roles jsonb default '[]'::jsonb,
  category text default 'my_templates',
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USAGE TRACKING TABLE
create table public.usage_tracking (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete set null,
  month text not null,
  document_count integer default 0,
  api_calls_count integer default 0,
  overage_charged decimal
);

-- API KEYS TABLE
create table public.api_keys (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  key_hash text unique not null,
  key_prefix text not null,
  name text not null,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  revoked_at timestamp with time zone
);

-- RLS POLICIES

-- Enable RLS
alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.templates enable row level security;
alter table public.signatures enable row level security;
alter table public.api_keys enable row level security;

-- Users policies
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Documents policies
create policy "Users can view own documents" on public.documents
  for select using (auth.uid() = user_id);
create policy "Public can view documents via token" on public.documents
  for select using (signing_token = current_setting('request.headers', true)::json->>'signing_token'); -- This might need adjustment based on how token is passed
-- Simplified public access for now, usually handled via edge function or specific query
create policy "Users can insert own documents" on public.documents
  for insert with check (auth.uid() = user_id);
create policy "Users can update own documents" on public.documents
  for update using (auth.uid() = user_id);
create policy "Users can delete own documents" on public.documents
  for delete using (auth.uid() = user_id);

-- Templates policies
create policy "Users can view own templates" on public.templates
  for select using (auth.uid() = user_id);
create policy "Public templates are viewable" on public.templates
  for select using (is_public = true);
create policy "Users can insert own templates" on public.templates
  for insert with check (auth.uid() = user_id);
create policy "Users can update own templates" on public.templates
  for update using (auth.uid() = user_id);
create policy "Users can delete own templates" on public.templates
  for delete using (auth.uid() = user_id);

-- Signatures policies
create policy "Users can view signatures for their documents" on public.signatures
  for select using (
    exists (
      select 1 from public.documents
      where documents.id = signatures.document_id
      and documents.user_id = auth.uid()
    )
  );
create policy "Public can insert signatures" on public.signatures
  for insert with check (true); -- Needs better security in production, e.g. token validation

-- API Keys policies
create policy "Users can view own api keys" on public.api_keys
  for select using (auth.uid() = user_id);
create policy "Users can insert own api keys" on public.api_keys
  for insert with check (auth.uid() = user_id);
create policy "Users can update own api keys" on public.api_keys
  for update using (auth.uid() = user_id);
create policy "Users can delete own api keys" on public.api_keys
  for delete using (auth.uid() = user_id);

-- STORAGE BUCKETS (to be created in dashboard, but policies here)
-- bucket: documents
-- bucket: signatures

-- DOCUMENT SHARES TABLE
create table public.document_shares (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  recipient_email text not null,
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('sent', 'opened', 'clicked')) default 'sent'
);

-- Document Shares policies
alter table public.document_shares enable row level security;

create policy "Users can view shares for their documents" on public.document_shares
  for select using (
    exists (
      select 1 from public.documents
      where documents.id = document_shares.document_id
      and documents.user_id = auth.uid()
    )
  );

create policy "Users can insert shares for their documents" on public.document_shares
  for insert with check (
    exists (
      select 1 from public.documents
      where documents.id = document_shares.document_id
      and documents.user_id = auth.uid()
    )
  );

