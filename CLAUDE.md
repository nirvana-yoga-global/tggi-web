# TGGI Web — Thapovanam Grow Green Initiative

## What This Is
Public website for the One Soul • One Tree Movement, run by Nirvana Yoga Global ashram, Trivandrum, Kerala. Plant registration, monthly photo uploads, community gallery.

## Tech Stack
- React + Vite + Tailwind CSS
- Supabase (shared project with NYG Connect and NYG CRM)
- Hosted on Vercel under nirvanayogaglobal account
- GitHub: github.com/nirvana-yoga-global/tggi-web

## Brand
- Palette: cream (#faf7f0), forest green (#1f3d2b), terracotta (#c4623d)
- Serif headings (Cormorant Garamond/Playfair Display), sans-serif body (Lato/Inter)
- Tone: calm, editorial, spiritual — never corporate or NGO-dashboard feel
- Mobile-first, 50+ age accessibility (16px minimum font, 48px tap targets, high contrast)

## Pages Built
- Homepage (/) — full design with all sections, gallery preview shows approved content only
- Register (/register) — plant registration form with Supabase integration, is_approved defaults to false
- Gallery (/gallery) — masonry grid showing approved tggi_registrations + tggi_featured_photos
- Person Profile (/person/:phone) — individual person's garden
- Plant Profile (/plant/:id) — growth timeline with monthly updates
- My Garden (/my-garden) — phone lookup, shows all user plants with pending/approved status, monthly update flow

## Database
- Supabase project: jlfmrligwbxklijugeui (shared with NYG Connect and NYG CRM)

### Tables
- tggi_registrations — id, created_at, full_name, phone, email, plant_name, category, location, first_photo_url, status, is_approved
- tggi_updates — id, created_at, registration_id, photo_url, note, month_number, is_approved
- tggi_featured_photos — id, created_at, photo_url, caption, location, category, is_approved (default true)

### Storage
- tggi-photos bucket (public)
- first-photos/ folder — registration photos
- updates/ folder — monthly update photos
- featured/ folder — NYG featured photos

## Approval Flow
- New registrations and updates default to is_approved = false
- Admin approves manually in Supabase Table Editor for now
- CRM TGGI admin approval UI to be built later
- Featured photos (tggi_featured_photos) default to is_approved = true — added directly by NYG via Supabase

## Plant Categories
Tree, Medicinal Plant, Flowering Plant, Vegetable/Kitchen Garden Plant, Indoor/Ornamental Plant, Herb

## Recognition Tiers
- TGGI Green Guardian — Trees & Medicinal Plants (1 year nurture)
- Nurturer — Flowering & Indoor/Ornamental (3-6 months)
- Kitchen Garden Contributor — Vegetables & Herbs (harvest cycle)

## Pending Features
- Brevo email notification to admin when new registration/update submitted
- CRM admin UI for approving registrations and uploads
- Email/WhatsApp monthly reminders to users
- PWA green XP integration via phone number
- Real photography replacing hero placeholder
- Custom domain (tggi.nirvanayogaglobal.com)

## Key Rules
- Never use Supabase CLI or Docker — run SQL manually in Supabase SQL Editor
- One feature at a time in Claude Code prompts
- Mobile-first always — test at 375px width first
- Phone number is private backend key only — never display publicly
- Greeting: Jai Madhav ji
