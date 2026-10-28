"use client";

import { parseSite, type SiteContent } from "@/data/siteSchema";
import { BindFieldErrors, Field, ImageField, SaveBar, SectionBlock, useContentForm } from "./ui";

export function SiteForm({ initial, sha }: { initial: SiteContent; sha: string }) {
  const form = useContentForm({
    initial,
    sha,
    path: "content/site/site.json",
    message: "Cập nhật thông tin trang",
    parse: parseSite,
  });
  const { data, setData } = form;

  function patch(partial: Partial<SiteContent>) {
    setData((current) => ({ ...current, ...partial }));
  }

  return (
    <BindFieldErrors error={form.save.error}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.onSave();
        }}
      >
        <SectionBlock title="Tên và mô tả">
          <Field field="site.name" required label="Tên" value={data.name} onChange={(name) => patch({ name })} />
          <Field field="site.nameUpper" required label="Tên in hoa" value={data.nameUpper} onChange={(nameUpper) => patch({ nameUpper })} />
          <Field field="site.title" required label="Tiêu đề trang" value={data.title} onChange={(title) => patch({ title })} />
          <Field field="site.tagline" required label="Khẩu hiệu" value={data.tagline} onChange={(tagline) => patch({ tagline })} />
          <Field field="site.description" required label="Mô tả" value={data.description} onChange={(description) => patch({ description })} />
          <Field field="site.federationLine" optional label="Dòng liên đoàn" value={data.federationLine} onChange={(federationLine) => patch({ federationLine })} />
          <Field field="site.motto" optional label="Châm ngôn" value={data.motto} onChange={(motto) => patch({ motto })} />
        </SectionBlock>
        <SectionBlock title="Ảnh">
          <ImageField field="site.logo" required label="Logo" folder="uploads" frame="logo" value={data.logo} onChange={(logo) => patch({ logo })} />
          <ImageField field="site.heroImage" required label="Ảnh hero" folder="uploads" frame="banner" value={data.heroImage} onChange={(heroImage) => patch({ heroImage })} />
          <ImageField field="site.heroFallback" required label="Ảnh hero dự phòng" folder="uploads" frame="banner" value={data.heroFallback} onChange={(heroFallback) => patch({ heroFallback })} />
          <ImageField field="site.introImage" required label="Ảnh giới thiệu" folder="uploads" frame="wide" value={data.introImage} onChange={(introImage) => patch({ introImage })} />
        </SectionBlock>
        <SectionBlock title="Cách gọi võ sinh">
          <Field field="site.memberTerm.lower" required label="Chữ thường" value={data.memberTerm.lower} onChange={(lower) => patch({ memberTerm: { ...data.memberTerm, lower } })} />
          <Field field="site.memberTerm.title" required label="Chữ hoa đầu" value={data.memberTerm.title} onChange={(title) => patch({ memberTerm: { ...data.memberTerm, title } })} />
          <Field field="site.memberTerm.ofSchool" required label="Kèm tên môn phái" value={data.memberTerm.ofSchool} onChange={(ofSchool) => patch({ memberTerm: { ...data.memberTerm, ofSchool } })} />
          <Field field="site.memberTerm.ofSchoolTitle" required label="Kèm tên môn phái, chữ hoa" value={data.memberTerm.ofSchoolTitle} onChange={(ofSchoolTitle) => patch({ memberTerm: { ...data.memberTerm, ofSchoolTitle } })} />
        </SectionBlock>
        <SectionBlock title="Menu">
          <p className="adm-hint">Chỉ sửa nhãn. Đường dẫn giữ cố định.</p>
          {data.navItems.map((item, index) => (
            <Field
              key={item.href}
              field={`site.navItems[${index}].label`}
              required
              label={item.href}
              value={item.label}
              onChange={(label) => {
                const navItems = data.navItems.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, label } : row
                );
                patch({ navItems });
              }}
            />
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
