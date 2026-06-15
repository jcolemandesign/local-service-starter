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

create table if not exists public.project_intakes (
  id uuid not null default gen_random_uuid (),
  business_name text not null,
  business_type text null,
  website text null,
  contact_name text null,
  contact_email text null,
  contact_phone text null,
  main_services text[] null default '{}'::text[],
  priority_services text null,
  service_area text null,
  preferred_cta text[] null default '{}'::text[],
  payload jsonb not null,
  source text null default 'Client Intake Wizard'::text,
  status text null default 'New'::text,
  created_at timestamp with time zone not null default now(),
  constraint project_intakes_pkey primary key (id)
) TABLESPACE pg_default;

alter table public.project_intakes enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.project_intakes to anon, authenticated;
grant select, update on table public.project_intakes to authenticated;

drop policy if exists "Allow public project intake submissions" on public.project_intakes;

create policy "Allow public project intake submissions"
on public.project_intakes
for insert
to anon, authenticated
with check (
  business_name is not null
  and payload is not null
  and (
    contact_email is not null
    or contact_phone is not null
  )
);

drop policy if exists "Allow authenticated project intake reads" on public.project_intakes;

create policy "Allow authenticated project intake reads"
on public.project_intakes
for select
to authenticated
using (true);

drop policy if exists "Allow authenticated project intake updates" on public.project_intakes;

create policy "Allow authenticated project intake updates"
on public.project_intakes
for update
to authenticated
using (true)
with check (true);
