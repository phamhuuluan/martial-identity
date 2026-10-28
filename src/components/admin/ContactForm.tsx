"use client";

import { parseContact, type ContactContent } from "@/data/siteSchema";
import { Area, BindFieldErrors, Field, LineList, SaveBar, SectionBlock, useContentForm } from "./ui";

export function ContactForm({ initial, sha }: { initial: ContactContent; sha: string }) {
  const form = useContentForm({
    initial,
    sha,
    path: "content/site/contact.json",
    message: "Cập nhật liên hệ",
    parse: parseContact,
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
      <SectionBlock title="Tổ Đình">
        <p className="adm-hint">
          Địa chỉ đầy đủ cũng hiện ở mục thành lập và câu lạc bộ tên TỔ ĐÌNH.
        </p>
        <Field field="contact.toDinh.templeName" required label="Tên chùa" value={data.toDinh.templeName} onChange={(templeName) => setData({ ...data, toDinh: { ...data.toDinh, templeName } })} />
        <Field field="contact.toDinh.address" required label="Địa chỉ ngắn" value={data.toDinh.address} onChange={(address) => setData({ ...data, toDinh: { ...data.toDinh, address } })} />
        <Area field="contact.toDinh.fullAddress" required label="Địa chỉ đầy đủ" value={data.toDinh.fullAddress} onChange={(fullAddress) => setData({ ...data, toDinh: { ...data.toDinh, fullAddress } })} rows={2} />
        <Field field="contact.toDinh.mapEmbed" required label="Link bản đồ nhúng" value={data.toDinh.mapEmbed} onChange={(mapEmbed) => setData({ ...data, toDinh: { ...data.toDinh, mapEmbed } })} />
        <Field field="contact.toDinh.mapLink" required label="Link mở bản đồ" value={data.toDinh.mapLink} onChange={(mapLink) => setData({ ...data, toDinh: { ...data.toDinh, mapLink } })} />
      </SectionBlock>
      <SectionBlock title="Mô tả liên hệ">
        <Area field="contact.contactDescription" required label="Đoạn giới thiệu" value={data.contactDescription} onChange={(contactDescription) => setData({ ...data, contactDescription })} rows={3} />
      </SectionBlock>
      <SectionBlock title="Điểm đại diện">
        {data.contactHighlights.map((item, index) => (
          <div key={index} className="adm-repeat">
            <Field
              field={`contact.contactHighlights[${index}].region`}
              required
              label="Tên"
              value={item.region}
              onChange={(region) => {
                const contactHighlights = data.contactHighlights.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, region } : row
                );
                setData({ ...data, contactHighlights });
              }}
            />
            <Field
              field={`contact.contactHighlights[${index}].address`}
              optional
              label="Địa chỉ"
              value={item.address ?? ""}
              hint={item.region.trim() === "Tổ Đình" ? "Trang công khai dùng địa chỉ đầy đủ của Tổ Đình." : undefined}
              onChange={(address) => {
                const contactHighlights = data.contactHighlights.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, address } : row
                );
                setData({ ...data, contactHighlights });
              }}
            />
            <button
              type="button"
              className="btn btn-outline justify-self-start"
              onClick={() =>
                setData({
                  ...data,
                  contactHighlights: data.contactHighlights.filter((_, rowIndex) => rowIndex !== index),
                })
              }
            >
              Xóa điểm này
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline justify-self-start"
          onClick={() =>
            setData({
              ...data,
              contactHighlights: [...data.contactHighlights, { region: "" }],
            })
          }
        >
          Thêm điểm
        </button>
      </SectionBlock>
      <SectionBlock title="Mạng xã hội">
        {data.officialSocialLinks.map((item, index) => (
          <div key={index} className="adm-repeat">
            <Field
              field={`contact.officialSocialLinks[${index}].name`}
              required
              label="Tên"
              value={item.name}
              hint="TikTok, YouTube, Facebook có biểu tượng riêng."
              onChange={(name) => {
                const officialSocialLinks = data.officialSocialLinks.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, name } : row
                );
                setData({ ...data, officialSocialLinks });
              }}
            />
            <Field
              field={`contact.officialSocialLinks[${index}].href`}
              required
              label="Đường dẫn"
              value={item.href}
              onChange={(href) => {
                const officialSocialLinks = data.officialSocialLinks.map((row, rowIndex) =>
                  rowIndex === index ? { ...row, href } : row
                );
                setData({ ...data, officialSocialLinks });
              }}
            />
            <button
              type="button"
              className="btn btn-outline justify-self-start"
              onClick={() =>
                setData({
                  ...data,
                  officialSocialLinks: data.officialSocialLinks.filter((_, rowIndex) => rowIndex !== index),
                })
              }
            >
              Xóa
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline justify-self-start"
          onClick={() =>
            setData({
              ...data,
              officialSocialLinks: [...data.officialSocialLinks, { name: "", href: "https://" }],
            })
          }
        >
          Thêm mạng xã hội
        </button>
      </SectionBlock>
      <SectionBlock title="Quốc gia đang có CLB">
        <LineList
          field="contact.operatingCountries"
          required
          label="Tên quốc gia tiếng Anh"
          value={data.operatingCountries}
          onChange={(operatingCountries) => setData({ ...data, operatingCountries })}
        />
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
