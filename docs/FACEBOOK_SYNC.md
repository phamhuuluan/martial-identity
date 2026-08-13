# Đồng bộ Fanpage — kiến trúc Cursor Agent

## Kiến trúc đúng

```
Facebook Fanpage
      ↓
Facebook MCP (user-facebook-page) — chỉ đọc thô
      ↓
Cursor Agent + AI tích hợp Cursor
      ↓  phân tích / phân loại / chuẩn hóa
content/{category}/*.md
      ↓
Website (Next.js đọc Markdown lúc build)
```

**Không** dùng OpenAI / Gemini / Claude API. **Không** cần `OPENAI_API_KEY`.

---

## Cách làm việc

Trong chat Cursor, nói:

> Đồng bộ Fanpage vào website

Agent sẽ:

1. Gọi Facebook MCP `get_page_posts` (≈ 4 tháng)
2. Tự phân tích bằng AI Cursor
3. Sinh / cập nhật file trong `content/`
4. Tải ảnh vào `public/images/news/` (nếu cần)

Skill hướng dẫn: `.agents/skills/sync-facebook-fanpage/SKILL.md`

---

## Thư mục nội dung (đúng 3 nhóm)

```
content/
  competitions/    # Các giải đấu đã tham gia
  charity/         # Các hoạt động thiện nguyện
  activities/      # Các hoạt động khác
```

Mỗi file:

```yaml
---
title: "..."
summary: "..."
date: "YYYY-MM-DD"
category: competitions
tags:
  - festival
facebookUrl: "..."
facebookPostId: "..."
engagementScore: 12
coverImage: "/images/news/.../01.jpg"
gallery:
  - "/images/news/.../02.jpg"
---

Nội dung...
```

Phân loại: `src/sync/classifyPost.ts` — ưu tiên thiện nguyện → giải đấu → hoạt động khác; dựa trên ngữ cảnh, không chỉ một keyword.

---

## Script (không AI)

| Lệnh | Việc |
|------|------|
| `npm run test:facebook-mcp` | Kiểm tra MCP |
| `npm run fetch:facebook` | Dump thô → `data/facebook-raw.json` (tuỳ chọn) |
| `npm run report:classification` | Dry-run report 3 nhóm |
| `npm run reclassify:content` | Áp dụng phân loại + chuyển thư mục |

## Media

Chỉ đồng bộ bài có ≥ 1 **ảnh thật**. Bài video/reel bị bỏ qua (không dùng thumbnail video). Gallery lấy toàn bộ ảnh thật của bài. Không hard-code URL ảnh.

Website **không** gọi Facebook / MCP / AI khi user truy cập.

---

## UI

| content category | Section |
|------------------|---------|
| competitions | Giải đấu (`#giai-dau`) |
| charity | Thiện nguyện (`#thien-nguyen`) |
| activities | Hoạt động khác (`#hoat-dong-khac`) |

Ảnh cover mỗi section: 1–2 bài mới nhất cùng nhóm (ưu tiên 2026 → có ảnh → `publishedAt`).

Section **Hoạt động khác** tự ẩn khi không có bài trong `content/activities/`.

---

## Facebook MCP

- Server: `mcp/facebook-page/server.ts`
- Cursor: `.cursor/mcp.json` + `~/.cursor/mcp.json` (`facebook-page`)
- Env: `FACEBOOK_PAGE_ID`, `FACEBOOK_ACCESS_TOKEN` trong `.env`

```bash
npm run fetch:facebook
cp data/facebook-raw.json data/facebook-sync-input.json
npm run generate:content
npm run reclassify:content
```
