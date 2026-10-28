"use client";

import { parseIntro, type IntroContent } from "@/data/siteSchema";
import { Area, BindFieldErrors, Field, ImageField, LineList, SaveBar, SectionBlock, useContentForm } from "./ui";

export function IntroForm({ initial, sha }: { initial: IntroContent; sha: string }) {
  const form = useContentForm({
    initial,
    sha,
    path: "content/site/intro.json",
    message: "Cập nhật giới thiệu",
    parse: parseIntro,
  });
  const { data, setData } = form;
  const formation = data.formation;

  return (
    <BindFieldErrors error={form.save.error}>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.onSave();
      }}
    >
      <SectionBlock title="Thái Tổ Sư">
        <Field label="Số" value={data.thaiToSu.number} onChange={(number) => setData({ ...data, thaiToSu: { ...data.thaiToSu, number } })} />
        <Field label="Tiêu đề" value={data.thaiToSu.title} onChange={(title) => setData({ ...data, thaiToSu: { ...data.thaiToSu, title } })} />
        <Area label="Nội dung" value={data.thaiToSu.body} onChange={(body) => setData({ ...data, thaiToSu: { ...data.thaiToSu, body } })} />
        <ImageField field="intro.thaiToSu.image" required label="Ảnh" folder="site" frame="portrait" value={data.thaiToSu.image} onChange={(image) => setData({ ...data, thaiToSu: { ...data.thaiToSu, image } })} />
        <Field label="Nhãn đường dẫn tiểu sử" value={data.thaiToSu.lifeLabel} onChange={(lifeLabel) => setData({ ...data, thaiToSu: { ...data.thaiToSu, lifeLabel } })} />
        <p className="adm-hint">Đường dẫn tiểu sử giữ cố định: {data.thaiToSu.lifeHref}</p>
      </SectionBlock>
      <SectionBlock title="Sáng Tổ Sư">
        <Field label="Số" value={data.sangToSu.number} onChange={(number) => setData({ ...data, sangToSu: { ...data.sangToSu, number } })} />
        <Field label="Tiêu đề" value={data.sangToSu.title} onChange={(title) => setData({ ...data, sangToSu: { ...data.sangToSu, title } })} />
        <ImageField field="intro.sangToSu.image" required label="Ảnh" folder="site" frame="portrait" value={data.sangToSu.image} onChange={(image) => setData({ ...data, sangToSu: { ...data.sangToSu, image } })} />
        {data.sangToSu.fields.map((field, index) => (
          <div key={index} className="adm-repeat">
            <Field
              label="Nhãn"
              value={field.label}
              onChange={(label) => {
                const fields = data.sangToSu.fields.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, label } : row
                );
                setData({ ...data, sangToSu: { ...data.sangToSu, fields } });
              }}
            />
            <Field
              label="Giá trị"
              value={field.value}
              onChange={(value) => {
                const fields = data.sangToSu.fields.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, value } : row
                );
                setData({ ...data, sangToSu: { ...data.sangToSu, fields } });
              }}
            />
          </div>
        ))}
        <LineList
          label="Chức vụ"
          value={data.sangToSu.positions}
          onChange={(positions) => setData({ ...data, sangToSu: { ...data.sangToSu, positions } })}
        />
      </SectionBlock>
      <SectionBlock title="Thành lập">
        <Field label="Tiêu đề năm" value={formation.yearTitle} onChange={(yearTitle) => setData({ ...data, formation: { ...formation, yearTitle } })} />
        <Field label="Số" value={formation.yearNumber} onChange={(yearNumber) => setData({ ...data, formation: { ...formation, yearNumber } })} />
        <Area label="Nội dung năm thành lập" value={formation.yearBody} onChange={(yearBody) => setData({ ...data, formation: { ...formation, yearBody } })} />
        <Field label="Số mục Tổ Đình" value={formation.toDinh.number} onChange={(number) => setData({ ...data, formation: { ...formation, toDinh: { ...formation.toDinh, number } } })} />
        <Field label="Tiêu đề Tổ Đình" value={formation.toDinh.title} onChange={(title) => setData({ ...data, formation: { ...formation, toDinh: { ...formation.toDinh, title } } })} />
        <p className="adm-hint">Địa chỉ Tổ Đình trên web lấy từ trang Liên hệ.</p>
        <Field label="Số nhân duyên" value={formation.nhanDuyen.number} onChange={(number) => setData({ ...data, formation: { ...formation, nhanDuyen: { ...formation.nhanDuyen, number } } })} />
        <Field label="Tiêu đề nhân duyên" value={formation.nhanDuyen.title} onChange={(title) => setData({ ...data, formation: { ...formation, nhanDuyen: { ...formation.nhanDuyen, title } } })} />
        <LineList label="Các ý nhân duyên" value={formation.nhanDuyen.bullets} onChange={(bullets) => setData({ ...data, formation: { ...formation, nhanDuyen: { ...formation.nhanDuyen, bullets } } })} />
        <Field label="Số chưởng môn" value={formation.chuongMon.number} onChange={(number) => setData({ ...data, formation: { ...formation, chuongMon: { ...formation.chuongMon, number } } })} />
        <Field label="Tiêu đề chưởng môn" value={formation.chuongMon.title} onChange={(title) => setData({ ...data, formation: { ...formation, chuongMon: { ...formation.chuongMon, title } } })} />
        <Area label="Chưởng môn" value={formation.chuongMon.body} onChange={(body) => setData({ ...data, formation: { ...formation, chuongMon: { ...formation.chuongMon, body } } })} rows={3} />
        <Field label="Số trưởng ban" value={formation.truongBan.number} onChange={(number) => setData({ ...data, formation: { ...formation, truongBan: { ...formation.truongBan, number } } })} />
        <Field label="Tiêu đề trưởng ban" value={formation.truongBan.title} onChange={(title) => setData({ ...data, formation: { ...formation, truongBan: { ...formation.truongBan, title } } })} />
        <Area label="Trưởng ban" value={formation.truongBan.body} onChange={(body) => setData({ ...data, formation: { ...formation, truongBan: { ...formation.truongBan, body } } })} rows={2} />
      </SectionBlock>
      <SectionBlock title="Mục lịch sử và biểu tượng">
        <Field label="Tiêu đề lịch sử" value={data.organization.sectionTitle} onChange={(sectionTitle) => setData({ ...data, organization: { sectionTitle } })} />
        <Field label="Tiêu đề tôn chỉ" value={data.logoMeaning.sectionTitle} onChange={(sectionTitle) => setData({ ...data, logoMeaning: { ...data.logoMeaning, sectionTitle } })} />
        <Field label="Số" value={data.logoMeaning.number} onChange={(number) => setData({ ...data, logoMeaning: { ...data.logoMeaning, number } })} />
        <Field label="Tiêu đề biểu tượng" value={data.logoMeaning.title} onChange={(title) => setData({ ...data, logoMeaning: { ...data.logoMeaning, title } })} />
        <ImageField field="intro.logoMeaning.logo" required label="Logo" folder="uploads" frame="logo" value={data.logoMeaning.logo} onChange={(logo) => setData({ ...data, logoMeaning: { ...data.logoMeaning, logo } })} />
        <LineList label="Đoạn văn" value={data.logoMeaning.paragraphs} onChange={(paragraphs) => setData({ ...data, logoMeaning: { ...data.logoMeaning, paragraphs } })} />
        <LineList label="Phẩm chất" value={data.logoMeaning.qualities} onChange={(qualities) => setData({ ...data, logoMeaning: { ...data.logoMeaning, qualities } })} />
        <Area label="Câu kết" value={data.logoMeaning.closing} onChange={(closing) => setData({ ...data, logoMeaning: { ...data.logoMeaning, closing } })} />
        {data.logoMeaning.colors.map((color, index) => (
          <div key={index} className="adm-repeat">
            <Field
              label="Tên màu"
              value={color.name}
              onChange={(name) => {
                const colors = data.logoMeaning.colors.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, name } : row
                );
                setData({ ...data, logoMeaning: { ...data.logoMeaning, colors } });
              }}
            />
            <Field
              label="Mã màu"
              value={color.hex}
              onChange={(hex) => {
                const colors = data.logoMeaning.colors.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, hex } : row
                );
                setData({ ...data, logoMeaning: { ...data.logoMeaning, colors } });
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
