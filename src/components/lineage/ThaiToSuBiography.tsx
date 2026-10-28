import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  thaiToSuChapters,
  thaiToSuLifeMeta,
  thaiToSuMerits,
  thaiToSuNav,
  thaiToSuVerse,
  type LifeBlock,
} from "@/data/thaiToSuLife";

function LifeBlocks({ blocks }: { blocks: readonly LifeBlock[] }) {
  return (
    <div className="measure space-y-6">
      {blocks.map((block, index) => {
        if (block.kind === "speech") {
          return (
            <blockquote
              key={index}
              className="type-quote border-l border-gold/50 pl-5 text-[1.35rem] text-brown-deep/90 md:text-[1.5rem]"
            >
              {block.text}
            </blockquote>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={index} className="space-y-3">
              {block.items.map((item) => (
                <li
                  key={item.slice(0, 48)}
                  className="type-body text-[1.05rem] text-brown-deep/90 before:mr-2 before:text-gold/70 before:content-['–']"
                >
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={index}
            className="type-body text-[1.05rem] text-brown-deep/90"
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function ChapterNav() {
  return (
    <nav aria-label="Mục lục" className="lg:sticky lg:top-28">
      <ol className="border-t border-brown/12">
        {thaiToSuNav.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="group grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 border-b border-brown/10 py-3"
            >
              <span className="type-eyebrow pt-0.5 text-gold">{item.number}</span>
              <span className="text-sm text-brown-deep/75 transition group-hover:text-brown-deep">
                {item.title}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ThaiToSuBiography() {
  const meta = thaiToSuLifeMeta;

  return (
    <>
      <PageHeader
        eyebrow={meta.eyebrow}
        title={meta.title}
        tone="sand"
        layout="split"
        back={{ href: "/gioi-thieu#thai-to-su", label: "Giới thiệu" }}
        description={
          <>
            <p>{meta.epithet}</p>
            <p className="mt-3">{meta.pali}</p>
          </>
        }
        meta={
          <p className="type-eyebrow text-brown/45">
            {meta.series}
            <span className="mx-2 text-gold/70">·</span>
            Chủ biên {meta.editor}
          </p>
        }
      />

      <section className="relative overflow-hidden texture-paper">
        <div className="grain absolute inset-0" aria-hidden />
        <figure className="relative mx-auto max-w-xl px-5 py-14 md:py-20">
          <div className="relative aspect-[3/4] bg-beige">
            <Image
              src={meta.image}
              alt={meta.imageAlt}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 36rem"
            />
          </div>
          <figcaption className="mt-8 text-center">
            <p className="type-display text-[1.75rem] text-brown-deep md:text-[2rem]">
              {meta.dedication}
            </p>
          </figcaption>
        </figure>
      </section>

      <div className="relative texture-paper">
        <div className="grain absolute inset-0" aria-hidden />
        <div className="site-container site-section relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="hidden lg:col-span-3 lg:block">
            <ChapterNav />
          </div>
          <div className="space-y-20 lg:col-span-8 lg:col-start-5">
            {thaiToSuChapters.map((chapter) => (
              <article
                key={chapter.id}
                id={chapter.id}
                className="scroll-mt-28"
              >
                <header className="mb-8">
                  <p className="type-eyebrow text-gold">{chapter.number}</p>
                  <h2 className="h2-section mt-2 text-brown-deep">
                    {chapter.title}
                  </h2>
                  <div className="gold-rule mt-5" />
                </header>
                <LifeBlocks blocks={chapter.blocks} />
              </article>
            ))}

            <article id={thaiToSuMerits.id} className="scroll-mt-28">
              <header className="mb-8">
                <p className="type-eyebrow text-gold">{thaiToSuMerits.number}</p>
                <h2 className="h2-section mt-2 text-brown-deep">
                  {thaiToSuMerits.title}
                </h2>
                <div className="gold-rule mt-5" />
              </header>
              <div className="measure space-y-6">
                <p className="type-body text-[1.05rem] text-brown-deep/90">
                  {thaiToSuMerits.lead}
                </p>
                <ul className="space-y-4">
                  {thaiToSuMerits.items.map((item) => (
                    <li
                      key={item.slice(0, 40)}
                      className="type-body border-t border-brown/10 pt-4 text-[1.05rem] text-brown-deep/90"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>

      <section
        id={thaiToSuVerse.id}
        className="relative scroll-mt-28 overflow-hidden texture-ink text-ivory"
      >
        <div className="grain absolute inset-0" aria-hidden />
        <div className="site-container site-section relative">
          <p className="type-eyebrow text-gold-soft/80">{thaiToSuVerse.number}</p>
          <h2 className="h2-section mt-2">{thaiToSuVerse.title}</h2>
          <div className="gold-rule mt-6 bg-gold/50" />
          <div className="measure mt-10 space-y-8">
            {Array.from(
              { length: Math.ceil(thaiToSuVerse.lines.length / 4) },
              (_, stanza) => thaiToSuVerse.lines.slice(stanza * 4, stanza * 4 + 4)
            ).map((stanza) => (
              <div key={stanza[0]} className="space-y-1">
                {stanza.map((line) => (
                  <p
                    key={line}
                    className="type-quote text-[1.35rem] text-ivory/90 md:text-[1.5rem]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <p className="type-eyebrow mt-12 text-gold-soft/80">
            {meta.dedication}
            <span className="mx-2">·</span>3 lần
          </p>
        </div>
      </section>
    </>
  );
}
