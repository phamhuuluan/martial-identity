"use client";

import { parseLocations, REGION_KEYS, type LocationsContent, type RegionBlock } from "@/data/siteSchema";
import { Area, BindFieldErrors, Field, ImageField, LineList, SaveBar, SectionBlock, useContentForm } from "./ui";

const REGION_LABELS: Record<(typeof REGION_KEYS)[number], string> = {
  south: "Miền Nam",
  central: "Miền Trung",
  north: "Miền Bắc",
  overseas: "Nước ngoài",
};

export function LocationsForm({
  initial,
  sha,
}: {
  initial: LocationsContent;
  sha: string;
}) {
  const form = useContentForm({
    initial,
    sha,
    path: "content/site/locations.json",
    message: "Cập nhật địa điểm",
    parse: parseLocations,
  });
  const { data, setData } = form;

  function updateRegion(key: (typeof REGION_KEYS)[number], region: RegionBlock) {
    setData({ ...data, locations: { ...data.locations, [key]: region } });
  }

  return (
    <BindFieldErrors error={form.save.error}>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.onSave();
      }}
    >
      <SectionBlock title="Mở đầu quy mô">
        <Field label="Tiêu đề" value={data.scaleIntro.sectionTitle} onChange={(sectionTitle) => setData({ ...data, scaleIntro: { ...data.scaleIntro, sectionTitle } })} />
        <ImageField field="locations.scaleIntro.image" required label="Ảnh" folder="site" frame="wide" value={data.scaleIntro.image} onChange={(image) => setData({ ...data, scaleIntro: { ...data.scaleIntro, image } })} />
        <Area label="Đoạn dẫn" value={data.scaleIntro.body} onChange={(body) => setData({ ...data, scaleIntro: { ...data.scaleIntro, body } })} />
        <p className="adm-hint">
          Số CLB trên trang chủ được đếm từ danh sách bên dưới. Câu lạc bộ tên TỔ ĐÌNH lấy địa chỉ đầy đủ ở trang Liên hệ.
        </p>
      </SectionBlock>
      {REGION_KEYS.map((key) => {
        const region = data.locations[key];
        return (
          <details key={key} className="adm-disclosure" open={key === "south"}>
            <summary>
              {REGION_LABELS[key]} ({region.dojos.length})
            </summary>
            <div className="mt-4 grid gap-4">
              <Field label="Nhãn miền" value={region.region} onChange={(label) => updateRegion(key, { ...region, region: label })} />
              {region.dojos.map((dojo, index) => (
                <div key={index} className="adm-repeat">
                  <Field
                    label="Tên CLB"
                    value={dojo.name}
                    onChange={(name) => {
                      const dojos = region.dojos.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, name } : row
                      );
                      updateRegion(key, { ...region, dojos });
                    }}
                  />
                  <LineList
                    label="Địa chỉ"
                    value={dojo.locations}
                    onChange={(locations) => {
                      const dojos = region.dojos.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, locations } : row
                      );
                      updateRegion(key, { ...region, dojos });
                    }}
                  />
                  <Field
                    label="Lịch tập"
                    optional
                    value={dojo.schedule ?? ""}
                    onChange={(schedule) => {
                      const dojos = region.dojos.map((row, rowIndex) =>
                        rowIndex === index ? { ...row, schedule } : row
                      );
                      updateRegion(key, { ...region, dojos });
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline justify-self-start"
                    onClick={() =>
                      updateRegion(key, {
                        ...region,
                        dojos: region.dojos.filter((_, rowIndex) => rowIndex !== index),
                      })
                    }
                  >
                    Xóa CLB
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline justify-self-start"
                onClick={() =>
                  updateRegion(key, {
                    ...region,
                    dojos: [...region.dojos, { name: "", locations: [""] }],
                  })
                }
              >
                Thêm CLB
              </button>
            </div>
          </details>
        );
      })}
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
