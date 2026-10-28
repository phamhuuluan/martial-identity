"use client";

import { parseThaiToSuLife, type LifeBlock, type ThaiToSuLifeContent } from "@/data/siteSchema";
import { Area, BindFieldErrors, Field, ImageField, LineList, SaveBar, SectionBlock, useContentForm } from "./ui";

function nextId(existing: string[]): string {
  let n = existing.length + 1;
  let id = `muc-${n}`;
  while (existing.includes(id)) {
    n += 1;
    id = `muc-${n}`;
  }
  return id;
}

export function LifeForm({ initial, sha }: { initial: ThaiToSuLifeContent; sha: string }) {
  const form = useContentForm({
    initial,
    sha,
    path: "content/site/thai-to-su-life.json",
    message: "Cập nhật tiểu sử Thái Tổ Sư",
    parse: parseThaiToSuLife,
  });
  const { data, setData } = form;

  function updateBlock(chapterIndex: number, blockIndex: number, block: LifeBlock) {
    const chapters = data.chapters.map((chapter, index) => {
      if (index !== chapterIndex) return chapter;
      const blocks = chapter.blocks.map((row, rowIndex) => (rowIndex === blockIndex ? block : row));
      return { ...chapter, blocks };
    });
    setData({ ...data, chapters });
  }

  return (
    <BindFieldErrors error={form.save.error}>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.onSave();
      }}
    >
      <SectionBlock title="Mở đầu">
        <Field field="life.meta.eyebrow" required label="Chân dung mục" value={data.meta.eyebrow} onChange={(eyebrow) => setData({ ...data, meta: { ...data.meta, eyebrow } })} />
        <Field field="life.meta.title" required label="Tên" value={data.meta.title} onChange={(title) => setData({ ...data, meta: { ...data.meta, title } })} />
        <Field field="life.meta.pali" required label="Pali" value={data.meta.pali} onChange={(pali) => setData({ ...data, meta: { ...data.meta, pali } })} />
        <Field field="life.meta.epithet" required label="Danh hiệu" value={data.meta.epithet} onChange={(epithet) => setData({ ...data, meta: { ...data.meta, epithet } })} />
        <Field field="life.meta.series" required label="Tùng thư" value={data.meta.series} onChange={(series) => setData({ ...data, meta: { ...data.meta, series } })} />
        <Field field="life.meta.editor" required label="Chủ biên" value={data.meta.editor} onChange={(editor) => setData({ ...data, meta: { ...data.meta, editor } })} />
        <Field field="life.meta.dedication" required label="Lời kính lễ" value={data.meta.dedication} onChange={(dedication) => setData({ ...data, meta: { ...data.meta, dedication } })} />
        <ImageField field="life.meta.image" required label="Ảnh" folder="site" frame="portrait" value={data.meta.image} onChange={(image) => setData({ ...data, meta: { ...data.meta, image } })} />
        <Field field="life.meta.imageAlt" required label="Mô tả ảnh" value={data.meta.imageAlt} onChange={(imageAlt) => setData({ ...data, meta: { ...data.meta, imageAlt } })} />
      </SectionBlock>
      {data.chapters.map((chapter, chapterIndex) => (
        <details key={chapter.id} className="adm-disclosure" open={chapterIndex === 0}>
          <summary>
            {chapter.number} {chapter.title}
          </summary>
          <div className="mt-4 grid gap-4">
            <Field label="Id" value={chapter.id} onChange={(id) => {
              const chapters = data.chapters.map((row, index) => index === chapterIndex ? { ...row, id } : row);
              setData({ ...data, chapters });
            }} />
            <Field label="Số" value={chapter.number} onChange={(number) => {
              const chapters = data.chapters.map((row, index) => index === chapterIndex ? { ...row, number } : row);
              setData({ ...data, chapters });
            }} />
            <Field label="Tiêu đề" value={chapter.title} onChange={(title) => {
              const chapters = data.chapters.map((row, index) => index === chapterIndex ? { ...row, title } : row);
              setData({ ...data, chapters });
            }} />
            {chapter.blocks.map((block, blockIndex) => (
              <div key={blockIndex} className="adm-repeat">
                <label className="adm-field">
                  <span className="adm-label">Loại đoạn</span>
                  <select
                    className="adm-input"
                    value={block.kind}
                    onChange={(event) => {
                      const kind = event.target.value;
                      if (kind === "list") updateBlock(chapterIndex, blockIndex, { kind: "list", items: [""] });
                      else updateBlock(chapterIndex, blockIndex, { kind: kind as "prose" | "speech", text: "" });
                    }}
                  >
                    <option value="prose">Văn xuôi</option>
                    <option value="speech">Lời thoại</option>
                    <option value="list">Danh sách</option>
                  </select>
                </label>
                {block.kind === "list" ? (
                  <LineList
                    label="Các ý"
                    value={block.items}
                    onChange={(items) => updateBlock(chapterIndex, blockIndex, { kind: "list", items })}
                  />
                ) : (
                  <Area
                    label={block.kind === "speech" ? "Lời thoại" : "Đoạn văn"}
                    value={block.text}
                    onChange={(text) => updateBlock(chapterIndex, blockIndex, { kind: block.kind, text })}
                  />
                )}
                <button
                  type="button"
                  className="btn btn-outline justify-self-start"
                  onClick={() => {
                    const chapters = data.chapters.map((row, index) =>
                      index === chapterIndex
                        ? { ...row, blocks: row.blocks.filter((_, i) => i !== blockIndex) }
                        : row
                    );
                    setData({ ...data, chapters });
                  }}
                >
                  Xóa đoạn
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline justify-self-start"
              onClick={() => {
                const chapters = data.chapters.map((row, index) =>
                  index === chapterIndex
                    ? { ...row, blocks: [...row.blocks, { kind: "prose" as const, text: "" }] }
                    : row
                );
                setData({ ...data, chapters });
              }}
            >
              Thêm đoạn
            </button>
            <button
              type="button"
              className="btn btn-outline justify-self-start"
              onClick={() => setData({ ...data, chapters: data.chapters.filter((_, index) => index !== chapterIndex) })}
            >
              Xóa chương
            </button>
          </div>
        </details>
      ))}
      <button
        type="button"
        className="btn btn-outline mt-4"
        onClick={() => {
          const id = nextId([
            ...data.chapters.map((chapter) => chapter.id),
            data.merits.id,
            data.verse.id,
          ]);
          setData({
            ...data,
            chapters: [
              ...data.chapters,
              {
                id,
                number: String(data.chapters.length + 1).padStart(2, "0"),
                title: "Chương mới",
                blocks: [{ kind: "prose", text: "" }],
              },
            ],
          });
        }}
      >
        Thêm chương
      </button>
      <SectionBlock title="Ý nghĩa độ mệnh">
        <Field label="Id" value={data.merits.id} onChange={(id) => setData({ ...data, merits: { ...data.merits, id } })} />
        <Field label="Số" value={data.merits.number} onChange={(number) => setData({ ...data, merits: { ...data.merits, number } })} />
        <Field label="Tiêu đề" value={data.merits.title} onChange={(title) => setData({ ...data, merits: { ...data.merits, title } })} />
        <Area label="Dẫn" value={data.merits.lead} onChange={(lead) => setData({ ...data, merits: { ...data.merits, lead } })} />
        <LineList label="Các ý" value={data.merits.items} onChange={(items) => setData({ ...data, merits: { ...data.merits, items } })} />
      </SectionBlock>
      <SectionBlock title="Thơ tụng">
        <Field label="Id" value={data.verse.id} onChange={(id) => setData({ ...data, verse: { ...data.verse, id } })} />
        <Field label="Số" value={data.verse.number} onChange={(number) => setData({ ...data, verse: { ...data.verse, number } })} />
        <Field label="Tiêu đề" value={data.verse.title} onChange={(title) => setData({ ...data, verse: { ...data.verse, title } })} />
        <LineList label="Các câu" value={data.verse.lines} onChange={(lines) => setData({ ...data, verse: { ...data.verse, lines } })} />
      </SectionBlock>
      <SaveBar
        pending={form.save.pending}
        message={form.save.message}
        tone={form.save.tone}
        error={form.save.error}
        dirty={form.dirty}
        onReset={form.reset}
        onSave={() => void form.onSave()}
      />
    </form>
    </BindFieldErrors>
  );
}
