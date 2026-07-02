import { LeafFlower } from "./Decorations";

const LIVERPOOL_URL =
  "https://mesaderegalos.liverpool.com.mx/milistaderegalos/60009900";
const AMAZON_URL = "https://www.amazon.com.mx/wedding/share/lety-y-fer";

export default function GiftRegistry() {
  return (
    <section
      aria-label="Mesa de regalos"
      className="border-t border-hairline bg-sand px-8 py-14 text-center sm:px-16"
    >
      <p className="font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.3em] text-taupe">
        Mesa de regalos
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-[40px] font-medium text-cocoa">
        Un detalle con cariño
      </h2>
      <div className="mt-4 mb-1 flex justify-center">
        <LeafFlower />
      </div>
      <p className="mx-auto mt-2 max-w-[470px] font-[family-name:var(--font-ebgaramond)] text-[18px] italic leading-[1.75] text-mocha text-pretty">
        Tu compañía en este día es nuestro mejor regalo. Si además quieres tener
        un detalle con nosotros, aquí puedes encontrar nuestras mesas de
        regalos.
      </p>
      <div className="mx-auto mt-8 flex max-w-[420px] flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={LIVERPOOL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-sm border border-rosegold px-6 py-3 font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.13em] text-cocoa transition hover:opacity-80 sm:flex-1"
        >
          Liverpool
        </a>
        <a
          href={AMAZON_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-sm border border-rosegold px-6 py-3 font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.13em] text-cocoa transition hover:opacity-80 sm:flex-1"
        >
          Amazon
        </a>
      </div>
    </section>
  );
}
