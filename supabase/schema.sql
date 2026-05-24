create table public.leads (
  id uuid not null default gen_random_uuid (),
  name text null,
  phone text null,
  email text null,
  zip_code text null,
  service_needed text null,
  urgency text null,
  property_type text null,
  appointment_window text null,
  street_address text null,
  description text null,
  created_at timestamp with time zone not null default now(),
  contact_consent boolean null default false,
  status text null default 'New'::text,
  source text null default 'Website Contact Form'::text,
  notes text null,
  system_type text null,
  request_type text null,
  problem_type text null,
  preferred_contact_method text null,
  constraint leads_pkey primary key (id)
) TABLESPACE pg_default;

alter table public.leads enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.leads to anon, authenticated;
grant select, update on table public.leads to authenticated;

drop policy if exists "Allow public lead requests" on public.leads;

create policy "Allow public lead requests"
on public.leads
for insert
to anon, authenticated
with check (
  name is not null
  and phone is not null
  and contact_consent is true
);

drop policy if exists "Allow authenticated lead reads" on public.leads;

create policy "Allow authenticated lead reads"
on public.leads
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated lead updates" on public.leads;

create policy "Allow authenticated lead updates"
on public.leads
for update
to authenticated
using (true)
with check (true);
