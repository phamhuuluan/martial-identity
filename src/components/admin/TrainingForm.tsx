"use client";

import { parseTraining, type TrainingContent } from "@/data/siteSchema";
import { BindFieldErrors, Field, ImageField, ImageListField, SaveBar, SectionBlock, useContentForm } from "./ui";

export function TrainingForm({ initial, sha }: { initial: TrainingContent; sha: string }) {
  const form = useContentForm({
    initial,
    sha,
    path: "content/site/training.json",
    message: "Cập nhật chương trình tập luyện",
    parse: parseTraining,
  });
  const { data, setData } = form;

  return (
    <BindFieldErrors error={form.save.error}>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.onSave();
      }}
    >
      <SectionBlock title="Hệ đai">
        <Field label="Tiêu đề" value={data.beltSystem.sectionTitle} onChange={(sectionTitle) => setData({ ...data, beltSystem: { ...data.beltSystem, sectionTitle } })} />
        <Field label="Tiêu đề bảng" value={data.beltSystem.chartTitle} onChange={(chartTitle) => setData({ ...data, beltSystem: { ...data.beltSystem, chartTitle } })} />
        <Field label="Ghi chú" value={data.beltSystem.note} onChange={(note) => setData({ ...data, beltSystem: { ...data.beltSystem, note } })} />
        {data.beltSystem.charts.map((chart, index) => (
          <div key={index} className="adm-repeat">
            <Field
              label="Nhãn"
              value={chart.label}
              onChange={(label) => {
                const charts = data.beltSystem.charts.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, label } : row
                );
                setData({ ...data, beltSystem: { ...data.beltSystem, charts } });
              }}
            />
            <ImageField
              field={`training.beltSystem.charts[${index}].src`}
              required
              label="Ảnh bảng"
              folder="site"
              frame="wide"
              value={chart.src}
              onChange={(src) => {
                const charts = data.beltSystem.charts.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, src } : row
                );
                setData({ ...data, beltSystem: { ...data.beltSystem, charts } });
              }}
            />
          </div>
        ))}
      </SectionBlock>
      <SectionBlock title="Giáo trình">
        <Field label="Tiêu đề" value={data.curriculum.title} onChange={(title) => setData({ ...data, curriculum: { ...data.curriculum, title } })} />
        <Field label="Phụ đề" value={data.curriculum.subtitle} onChange={(subtitle) => setData({ ...data, curriculum: { ...data.curriculum, subtitle } })} />
        <Field label="File PDF" value={data.curriculum.pdf} hint="Đường dẫn bắt đầu bằng /, ví dụ /images/curriculum/giao-trinh.pdf" onChange={(pdf) => setData({ ...data, curriculum: { ...data.curriculum, pdf } })} />
        {data.curriculum.pages.map((page, index) => (
          <div key={index} className="adm-repeat">
            <Field
              label="Nhãn nhóm trang"
              value={page.label}
              onChange={(label) => {
                const pages = data.curriculum.pages.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, label } : row
                );
                setData({ ...data, curriculum: { ...data.curriculum, pages } });
              }}
            />
            <ImageListField
              field={`training.curriculum.pages[${index}].images`}
              label="Ảnh trang"
              folder="curriculum"
              value={page.images}
              onChange={(images) => {
                const pages = data.curriculum.pages.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, images } : row
                );
                setData({ ...data, curriculum: { ...data.curriculum, pages } });
              }}
            />
          </div>
        ))}
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
