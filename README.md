# Phật Quang Quyền

Premium responsive landing page for the Vietnamese martial arts school **Phật Quang Quyền**, built from the official catalogue PDF (`catalogue_so tay gioi thieu_27_02_2023.pdf`).

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide Icons
- `next/image`

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Content integrity

All text, images, diagrams, belt tables, curriculum tables, addresses, oaths, competitions, and volunteer activities come from the catalogue only. See [CONTENT_COVERAGE_REPORT.md](./CONTENT_COVERAGE_REPORT.md) for the full page → section mapping and 100% coverage confirmation.

## Assets

- `public/images/pages/` — 40 high-resolution page renders
- `public/images/extracted/` — 72 embedded catalogue images
- `src/data/content.ts` — immutable Vietnamese copy
- `src/data/gallery.ts` — gallery inventory + filters
