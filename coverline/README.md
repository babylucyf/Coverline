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

- Overview: daily review KPIs, production chart, risks (click a risk to jump to its screen), CSV export
- Stock: search, warehouse filter, status filter, sort by cover
- Freshness review: search and filters, route a batch in the drawer (repackage is blocked unless damage was reported)
- QA release: filter by hold reason, sort, chase QA
- Materials: 10-week cover grid, filters, flag a shortage to factory planning, see it under Flags sent
