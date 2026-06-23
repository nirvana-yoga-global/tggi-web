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
- Homepage (/) — full homepage with all sections
- Register (/register) — plant registration form with Supabase integration

## Pages To Build
- Gallery (/gallery) — masonry grid of all registered plants
- Person Profile (/person/:id) — individual person's garden
- Plant Profile (/plant/:id) — individual plant growth timeline

## Database
- Supabase project: jlfmrligwbxklijugeui (shared with NYG Connect and NYG CRM)
- Table: tggi_registrations (id, created_at, full_name, phone, email, plant_name, category, location, first_photo_url, status)
- Storage bucket: tggi-photos (public)

## Plant Categories
Tree, Medicinal Plant, Flowering Plant, Vegetable/Kitchen Garden Plant, Indoor/Ornamental Plant, Herb

## Recognition Tiers
- TGGI Green Guardian — Trees & Medicinal Plants (1 year nurture)
- Nurturer — Flowering & Indoor/Ornamental (3-6 months)
- Kitchen Garden Contributor — Vegetables & Herbs (harvest cycle)

## Key Rules
- Never use Supabase CLI or Docker — run SQL manually in Supabase SQL Editor
- One feature at a time in Claude Code prompts
- Mobile-first always — test at 375px width first
- Phone number is private backend key only — never display publicly
- Greeting: Jai Madhav ji
