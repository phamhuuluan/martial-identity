---
name: sync-facebook-fanpage
description: >-
  Đồng bộ Facebook Fanpage Tổ Đình Phật Quang Quyền vào website qua Facebook MCP
  và AI tích hợp của Cursor (không dùng OpenAI/Gemini/Claude API). Dùng khi user
  nói đồng bộ Fanpage, cập nhật tin tức từ Facebook, sync fanpage, đọc Fanpage
  vào content/, hoặc cập nhật competitions/charity từ Facebook.
---

# Đồng bộ Fanpage → Website (Cursor Agent)

## Kiến trúc bắt buộc

```
Facebook Fanpage → Facebook MCP (đọc thô) → Cursor Agent (AI tích hợp) → content/**/*.md → Website
```

**CẤM:** gọi OpenAI, Gemini, Claude, hay bất kỳ LLM API bên ngoài / yêu cầu `OPENAI_API_KEY`.

**Facebook MCP** (`user-facebook-page`): chỉ đọc dữ liệu thô.

**Cursor Agent:** phân tích, chuẩn hóa, phân loại, sinh Markdown, ghi file.

---

## Khi user yêu cầu đồng bộ

Ví dụ: “Đồng bộ Fanpage vào website”, “Đọc Fanpage và cập nhật website”.

### 1. Đọc Fanpage qua MCP

Gọi MCP server `user-facebook-page`, tool `get_page_posts`:

- `lookbackMonths`: 4 (hoặc theo user, tối đa 24)
- `maxImages`: 5 (chỉ ảnh thật; không video thumbnail)

Nếu MCP lỗi: chạy `npm run fetch:facebook` (chỉ dump thô `data/facebook-raw.json`, không AI), rồi đọc file đó.

### 2. Lọc bài

Bỏ: check-in, livestream, story, sinh nhật, quá ngắn, không liên quan.

Ưu tiên bài tương tác cao (`engagementScore`). Không import hết nếu user muốn “chỉ bài nổi bật”.

### 3. Chuẩn hóa bằng AI Cursor (không API ngoài)

Với mỗi bài giữ lại:

- Tiêu đề ngắn, không emoji/hashtag
- Summary 2–3 câu
- Body trang trọng; bỏ hashtag, emoji, kêu gọi like/share
- **Một** category theo quy tắc bên dưới (logic tham chiếu: `src/sync/classifyPost.ts`): `activities` | `competitions` | `charity` | `announcements` | `achievements` | `ceremonies`
- Tags (lowercase)
- Hiểu ngữ cảnh và mục đích sự kiện, không chỉ một từ khóa đơn lẻ

#### Quy tắc phân loại (ưu tiên từ trên xuống)

1. **`ceremonies` — Đại lễ Phật giáo** (không đưa vào các danh mục hiển thị bên dưới): Đại lễ, Phật đản, Vu Lan, Thành đạo, An cư kiết hạ, Tự tứ, Đại giới đàn, lễ hội / nghi lễ tâm linh Phật giáo.
2. **`competitions` / `achievements` — Giải đấu** chỉ khi rõ là giải đấu / thi đấu võ thuật: Giải, giải đấu, vô địch, cúp, Championship, Tournament, liên hoan / festival / đại hội võ thuật, Hội khỏe Phù Đổng, SEA Games, ASIAD, thi đấu, tranh tài, huy chương… Thành tích tại giải → `achievements`.
3. **`charity` — Thiện nguyện**: thiện nguyện, từ thiện, trao/tặng/phát quà, cứu trợ, trồng cây, đắp đường, nhặt rác, hiến máu, học bổng, hoạt động cộng đồng / môi trường…
4. **`activities` — Hoạt động khác** (mặc định nếu không chắc): kỳ thi thăng cấp đai / nâng đai / sát hạch (luôn ở đây, không phải giải), tập huấn, biểu diễn, giao lưu, hội nghị, lễ kỷ niệm, thăm viếng nghĩa trang, dâng hương, tri ân liệt sĩ, sinh hoạt môn phái…
5. **`announcements`**: thông báo / lịch ngắn.

Mỗi sự kiện chỉ một danh mục. Không chắc → `activities`, không tự xếp `competitions`.

### 4. Media (ảnh / video)

**Chỉ đồng bộ bài có ≥ 1 ảnh thật.**

| Trường hợp | Xử lý |
|------------|--------|
| Chỉ video (không ảnh) | **Bỏ qua** — không tạo Markdown, không tải thumbnail |
| Video + ảnh | Bỏ video; chỉ lấy ảnh; cover = ảnh đầu; gallery ≤ 5 ảnh |
| Chỉ ảnh | Đồng bộ bình thường; tối đa 5 ảnh |
| Chỉ text / không ảnh | **Bỏ qua** |

Tải ảnh vào `public/images/news/{facebookPostId}/01.jpg` …

Không dùng thumbnail video làm cover/gallery. Không fallback ảnh mặc định cho bài mới.

MCP `get_page_posts`: `maxImages: 5` (chỉ photo attachments).

### 5. Ghi Markdown

```
content/{category}/YYYY-MM-DD-slug.md
```

Frontmatter bắt buộc:

```yaml
---
title: "..."
summary: "..."
date: "YYYY-MM-DD"
category: competitions
tags:
  - festival
  - hanoi
facebookUrl: "https://..."
facebookPostId: "2011..._...."
engagementScore: 42
coverImage: "/images/news/.../01.jpg"
gallery:
  - "/images/news/.../02.jpg"
---

Nội dung Markdown...
```

### 6. Chống trùng / không xóa bừa

- Trùng nếu cùng `facebookPostId` hoặc `facebookUrl` → **cập nhật** file hiện có
- Không đổi → bỏ qua
- Bài đã xóa trên Facebook → **không** tự xóa file website trừ khi user yêu cầu

### 7. UI mapping (phương án C)

| category | Hiển thị |
|----------|----------|
| competitions, achievements | `#giai-dau` — Các giải đấu đã tham gia |
| activities | `#hoat-dong-khac` — Hoạt động khác |
| charity | `#thien-nguyen` — Hoạt động thiện nguyện |
| announcements | lưu content/ (không hiển thị) |
| ceremonies | lưu content/ — **không** hiển thị trên website |

Website đọc `content/` lúc build — không gọi Facebook/AI runtime.

Sau khi sửa quy tắc phân loại hàng loạt: `npm run reclassify:content`.

---

## Checklist trước khi kết thúc

- [ ] Không thêm/đòi OPENAI_API_KEY hay SDK LLM ngoài
- [ ] Chỉ dùng Facebook MCP (hoặc raw fetch) để đọc
- [ ] File Markdown đúng thư mục + frontmatter
- [ ] Ảnh local (nếu có)
- [ ] Báo cáo: thêm / cập nhật / bỏ qua bao nhiêu bài
