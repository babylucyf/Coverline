# Coverline

A planning dashboard concept for FMCG teams: freshness review, materials cover and QA release in one place.
Designed and built by Ugonwa Ohagwasi. All data is sample data.

## Run locally

```
npm install
npm run dev
```

## Deploy on Vercel

1. Go to vercel.com and sign in.
2. Add New > Project.
3. Import this folder from GitHub, or drag the folder onto the Vercel upload screen.
4. Vercel detects Vite. Build command `npm run build`, output folder `dist`. Click Deploy.

## What works

- Sidebar: switch team, collapse to an icon rail, New transfer, Settings, Support, Kano sync request
- Overview: daily review KPIs, production chart, risks (click to jump), DOR summary CSV export, notifications
- Stock: By product (search, Warehouse, Category, Days of cover and Status filters, sort, List or Grid), By batch, By location
- Freshness review: Next 120 days (filters, sort, List or Grid, route drawer), Damaged (filters, damage route drawer), Tasks (confirm a pull, flag a short), Routed, Missed; Report damage
- QA release: On hold (filter, sort, chase QA), Released, Rejected
- Materials: Cover (flag malt extract), Inbound shipments, Repackaging (add cartons to a flag), New SKUs (send quantity, nudge), Flags sent (nudge)
- Settings: Materials lead times (add a material), Products, Rules, Locations, Users and roles
