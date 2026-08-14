# Phật Quang Quyền

Premium responsive landing page for the Vietnamese martial arts school **Phật Quang Quyền**, built from the official sổ tay giới thiệu PDF (`so_tay_gioi_thieu_27_02_2023.pdf`).

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

## Content

- Nội dung môn phái (lịch sử, tôn chỉ, đai…): `src/data/content.ts`
- Tin Fanpage (Markdown): `content/{category}/*.md`

**Đồng bộ Fanpage:** nhờ Cursor Agent — *“Đồng bộ Fanpage vào website”*  
(Facebook MCP + AI Cursor → Markdown). **Không** cần `OPENAI_API_KEY`.

Optional raw dump (no AI): `npm run fetch:facebook`  
Docs: [docs/FACEBOOK_SYNC.md](./docs/FACEBOOK_SYNC.md)

## Assets

- `public/images/extracted/` — logo và hero
- `public/images/site/` — ảnh nhận diện (chân dung, bảng đai, cover)
- `public/images/curriculum/` — giáo trình
- `public/images/news/` — ảnh đồng bộ từ Fanpage
- `content/` — bài Markdown đã đồng bộ

File dump/audit (`data/facebook-raw.json`, `data/image-audit.json`, …) do script sinh ra và không commit.
