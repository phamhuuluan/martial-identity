---
name: sync-facebook-fanpage
description: >-
  Đồng bộ Facebook Fanpage Tổ Đình Phật Quang Quyền vào website qua Facebook MCP
  và AI tích hợp của Codex (không dùng OpenAI/Gemini/Claude API). Dùng khi user
  nói đồng bộ Fanpage, cập nhật tin tức từ Facebook, sync fanpage, đọc Fanpage
  vào content/, hoặc cập nhật competitions/charity/ceremonies từ Facebook.
---

# Đồng bộ Fanpage → Website (Codex Agent)

## Kiến trúc bắt buộc

```
Facebook Fanpage → Facebook MCP (đọc thô) → Codex Agent (AI tích hợp) → content/**/*.md → Website
```

**CẤM:** gọi OpenAI, Gemini, Claude, hay bất kỳ LLM API bên ngoài / yêu cầu `OPENAI_API_KEY`.

**Facebook MCP** (`user-facebook-page`): chỉ đọc dữ liệu thô.

**Codex Agent:** phân tích, chuẩn hóa, phân loại, sinh Markdown, ghi file.

---

## Khi user yêu cầu đồng bộ

### 1. Đọc Fanpage qua MCP

Gọi MCP server `user-facebook-page`, tool `get_page_posts`:

- `lookbackMonths`: 6 (hoặc theo user, tối đa 24)
- `maxImages`: 100 (toàn bộ **ảnh thật** của bài; không lấy video thumbnail)

Nếu MCP lỗi: chạy `FACEBOOK_LOOKBACK_MONTHS=6 FACEBOOK_MAX_IMAGES=100 npm run fetch:facebook` (dump thô `data/facebook-raw.json`), rồi `cp data/facebook-raw.json data/facebook-sync-input.json` và `npm run generate:content`.

### 2. Lọc bài

Bỏ: check-in, livestream, story, sinh nhật, quá ngắn, **bài video/reel**, không có ảnh thật.

Ưu tiên **toàn bộ bài trong cửa sổ lookback** (không hard-code 30 bài).

### 3. Chuẩn hóa bằng AI Codex (không API ngoài)

Với mỗi bài giữ lại:

- Tiêu đề ngắn, không emoji/hashtag
- Summary 2–3 câu
- Body trang trọng; bỏ hashtag, emoji, kêu gọi like/share
- **Một** category theo `src/sync/classifyPost.ts` — các nhóm phát hiện từ dữ liệu thực tế (hiện gồm competitions, charity, ceremonies, beltexams, performances, training, activities)
- Tags (lowercase)
- Hiểu ngữ cảnh và mục đích sự kiện, không chỉ một từ khóa đơn lẻ

#### Quy tắc phân loại (bản chất trước; đa tín hiệu → ưu tiên)

1. **`beltexams` — Kỳ thi thăng đai**
2. **`competitions` — Các giải đấu đã tham gia**
3. **`charity` — Các hoạt động thiện nguyện**
4. **`ceremonies` — Kính mừng Đại lễ**
5. **`performances` — Biểu diễn**
6. **`training` — Huấn luyện**
7. **`activities` — Các hoạt động khác** (fallback)

Mỗi sự kiện chỉ một danh mục. Không chắc → `activities`.

Khi phân tích dữ liệu mới, nếu xuất hiện nhóm rõ ràng khác (không phải địa điểm/năm/tháng) thì bổ sung category tương ứng — không ép vào 4 nhóm cũ.

### 4. Media (ảnh / video)

Website **không** render `<video>` / Facebook iframe / video player.

**Chỉ đồng bộ bài có ≥ 1 ảnh thật.**

| Trường hợp | Xử lý |
|------------|--------|
| Chỉ ảnh | Đồng bộ **toàn bộ** ảnh; cover = ảnh đầu; gallery = phần còn lại |
| Chỉ video / reel (không ảnh) | **Bỏ qua** — không tạo Markdown, không tải thumbnail |
| Video + ảnh | Bỏ video; chỉ lấy ảnh thật |
| Chỉ text / không ảnh | **Bỏ qua** |

Không dùng thumbnail video làm cover/gallery.

Tải ảnh vào `public/images/news/{facebookPostId}/01.jpg` …

### 5. Ghi Markdown

```
content/{category}/YYYY-MM-DD-slug.md
```

`category`: theo `NEWS_CONTENT_CATEGORIES` hiện tại (có thể mở rộng khi phát hiện nhóm mới).

### 6. Chống trùng / không xóa bừa

- Trùng nếu cùng `facebookPostId` hoặc `facebookUrl` → **cập nhật** file hiện có
- Không đổi → bỏ qua
- Bài đã xóa trên Facebook → **không** tự xóa file website trừ khi user yêu cầu

### 7. UI mapping

| category | Hiển thị |
|----------|----------|
| competitions | Các giải đấu đã tham gia |
| charity | Các hoạt động thiện nguyện |
| ceremonies | Kính mừng Đại lễ |
| beltexams | Kỳ thi thăng đai |
| performances | Biểu diễn |
| training | Huấn luyện |
| activities | Các hoạt động khác |

`/hoat-dong` archive mặc định: **6 tháng gần nhất**, sort `publishedAt DESC`.

Website đọc `content/` lúc build — không gọi Facebook/AI runtime.

```bash
npx tsx scripts/generate-classification-report.ts
npm run reclassify:content
```

---

## Checklist trước khi kết thúc

- [ ] Không thêm/đòi OPENAI_API_KEY hay SDK LLM ngoài
- [ ] Chỉ dùng Facebook MCP (hoặc raw fetch) để đọc
- [ ] File Markdown đúng thư mục + frontmatter (đúng 4 category)
- [ ] Ảnh local đủ (không cắt gallery)
- [ ] Báo cáo: thêm / cập nhật / bỏ qua bao nhiêu bài
