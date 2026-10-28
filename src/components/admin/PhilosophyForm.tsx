"use client";

import { parsePhilosophy, type PhilosophyContent } from "@/data/siteSchema";
import { Area, BindFieldErrors, Field, ImageField, LineList, SaveBar, SectionBlock, useContentForm } from "./ui";

export function PhilosophyForm({
  initial,
  sha,
}: {
  initial: PhilosophyContent;
  sha: string;
}) {
  const form = useContentForm({
    initial,
    sha,
    path: "content/site/philosophy.json",
    message: "Cập nhật tôn chỉ",
    parse: parsePhilosophy,
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
      <SectionBlock title="Hai yếu tố">
        <Field label="Số" value={data.philosophy.number} onChange={(number) => setData({ ...data, philosophy: { ...data.philosophy, number } })} />
        <Field label="Tiêu đề" value={data.philosophy.title} onChange={(title) => setData({ ...data, philosophy: { ...data.philosophy, title } })} />
        {data.philosophy.factors.map((factor, index) => (
          <div key={index} className="adm-repeat">
            <Field
              field={`philosophy.philosophy.factors[${index}].label`}
              required
              label="Nhãn"
              value={factor.label}
              onChange={(label) => {
                const factors = data.philosophy.factors.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, label } : row
                );
                setData({ ...data, philosophy: { ...data.philosophy, factors } });
              }}
            />
            <Area
              field={`philosophy.philosophy.factors[${index}].body`}
              required
              label="Nội dung"
              value={factor.body}
              onChange={(body) => {
                const factors = data.philosophy.factors.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, body } : row
                );
                setData({ ...data, philosophy: { ...data.philosophy, factors } });
              }}
            />
          </div>
        ))}
      </SectionBlock>
      <SectionBlock title="Phương châm">
        <Field label="Số" value={data.phuongCham.number} onChange={(number) => setData({ ...data, phuongCham: { ...data.phuongCham, number } })} />
        <Field label="Tiêu đề" value={data.phuongCham.title} onChange={(title) => setData({ ...data, phuongCham: { ...data.phuongCham, title } })} />
        <LineList field="philosophy.phuongCham.body" required label="Các đoạn" value={data.phuongCham.body} onChange={(body) => setData({ ...data, phuongCham: { ...data.phuongCham, body } })} />
      </SectionBlock>
      <SectionBlock title="Sáu lời thề">
        <Field label="Tiêu đề trang chủ" value={data.sixOathsSection.homeHeading} onChange={(homeHeading) => setData({ ...data, sixOathsSection: { ...data.sixOathsSection, homeHeading } })} />
        <Field label="Tiêu đề trang trong" value={data.sixOathsSection.sectionTitle} onChange={(sectionTitle) => setData({ ...data, sixOathsSection: { ...data.sixOathsSection, sectionTitle } })} />
        <LineList field="philosophy.sixOaths" required label="Lời thề" value={data.sixOaths} onChange={(sixOaths) => setData({ ...data, sixOaths })} />
      </SectionBlock>
      <SectionBlock title="Tinh thần võ đạo">
        <ImageField field="philosophy.martialSpirit.image" required label="Ảnh" folder="site" frame="wide" value={data.martialSpirit.image} onChange={(image) => setData({ ...data, martialSpirit: { ...data.martialSpirit, image } })} />
        <LineList field="philosophy.martialSpirit.paragraphs" required label="Đoạn văn" value={data.martialSpirit.paragraphs} onChange={(paragraphs) => setData({ ...data, martialSpirit: { ...data.martialSpirit, paragraphs } })} />
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
