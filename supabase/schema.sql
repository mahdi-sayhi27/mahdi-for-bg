-- ============================================
-- Maths Pour BG — Supabase Database Schema
-- Run this once against a fresh Supabase project.
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'admin')),
  specialty text check (specialty in ('BG1', 'BG2')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles viewable" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- TESTIMONIALS — public photo gallery
-- ============================================
create table public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  student_name text not null,
  photo_url text,
  rating int not null default 5 check (rating >= 1 and rating <= 5),
  comment text not null,
  specialty text check (specialty in ('BG1', 'BG2')),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "Approved testimonials public" on public.testimonials for select using (approved = true);
create policy "Anyone can insert testimonials" on public.testimonials for insert with check (true);
create policy "Admins view testimonials" on public.testimonials for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins add testimonials" on public.testimonials for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins update testimonials" on public.testimonials for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
) with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins delete testimonials" on public.testimonials for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- RESULTS — home page "Témoignages" quote cards
-- (specialty/"Niveau" is free text, not restricted to BG1/BG2)
-- ============================================
create table public.results (
  id uuid default uuid_generate_v4() primary key,
  student_name text not null,
  specialty text,
  score text not null,
  screenshot_url text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.results enable row level security;

create policy "Results are public" on public.results for select using (true);
create policy "Admins manage results" on public.results for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- RESULTATS — home page "Résultats" stat cards
-- (name, note, rang, section, année universitaire)
-- ============================================
create table public.resultats (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  note text not null,
  rang text,
  section text,
  annee_universitaire text,
  created_at timestamptz not null default now()
);

alter table public.resultats enable row level security;

create policy "Resultats are public" on public.resultats for select using (true);
create policy "Admins manage resultats" on public.resultats for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- DETAILS — home page "Classement détaillé" cards
-- (nom, prénom, rang — managed independently from RESULTATS)
-- ============================================
create table public.details (
  id uuid default uuid_generate_v4() primary key,
  nom text not null,
  prenom text not null,
  rang text,
  created_at timestamptz not null default now()
);

alter table public.details enable row level security;

create policy "Details are public" on public.details for select using (true);
create policy "Admins manage details" on public.details for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- ANNOUNCEMENTS — News Center
-- ============================================
create table public.announcements (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  title text not null,
  description text not null default '',
  content text not null,
  category text not null default 'Announcement'
    check (category in ('News', 'Event', 'Internship', 'Exam', 'Schedule', 'Job', 'Announcement')),
  cover_image text,
  images jsonb not null default '[]'::jsonb,
  author text not null default 'Maths Pour BG',
  tags jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  pinned boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published')),
  publish_date timestamptz not null default now(),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

create policy "Published announcements public" on public.announcements for select using (
  status = 'published' and publish_date <= now()
);
create policy "Admins view all announcements" on public.announcements for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins manage announcements" on public.announcements for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- EMPLOI — timetables
-- ============================================
create table public.emploi (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  class_name text not null check (class_name in ('BG1', 'BG2')),
  department text not null default 'Mathématiques',
  semester text not null,
  pdf_url text not null,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.emploi enable row level security;

create policy "Emploi public" on public.emploi for select using (true);
create policy "Admins manage emploi" on public.emploi for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- RESOURCES
-- ============================================
create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  file_url text not null,
  type text not null default 'pdf' check (type in ('pdf', 'exercise', 'homework')),
  course text not null check (course in ('BG1', 'BG2')),
  created_at timestamptz not null default now()
);

alter table public.resources enable row level security;

create policy "Authenticated users view resources" on public.resources for select using (auth.uid() is not null);
create policy "Admins manage resources" on public.resources for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- REGISTRATIONS
-- ============================================
create table public.registrations (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade,
  course text not null check (course in ('BG1', 'BG2')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

create policy "Users view own registration" on public.registrations for select using (auth.uid() = student_id);
create policy "Users can register" on public.registrations for insert with check (auth.uid() = student_id);
create policy "Admins manage registrations" on public.registrations for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('results', 'results', true);
insert into storage.buckets (id, name, public) values ('resources', 'resources', false);
insert into storage.buckets (id, name, public) values ('news', 'news', true);
insert into storage.buckets (id, name, public) values ('emploi', 'emploi', true);

-- Storage policies
create policy "Avatar images public" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users upload avatars" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid() is not null);
create policy "Result images public" on storage.objects for select using (bucket_id = 'results');
create policy "Admins upload results" on storage.objects for insert with check (
  bucket_id = 'results' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Auth users download resources" on storage.objects for select using (bucket_id = 'resources' and auth.uid() is not null);
create policy "Admins upload resources" on storage.objects for insert with check (
  bucket_id = 'resources' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "News images public" on storage.objects for select using (bucket_id = 'news');
create policy "Admins upload news images" on storage.objects for insert with check (
  bucket_id = 'news' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Emploi PDFs public" on storage.objects for select using (bucket_id = 'emploi');
create policy "Admins upload emploi PDFs" on storage.objects for insert with check (
  bucket_id = 'emploi' and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
