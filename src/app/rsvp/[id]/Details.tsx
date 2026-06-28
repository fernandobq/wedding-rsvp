import { VenueMap } from "./Decorations";

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Terraza+Balcones+Culiacan+Sinaloa";

export default function Details() {
  return (
    <section aria-label="Detalles del evento" className="bg-sand px-8 py-14 sm:px-16">
      <p className="text-center font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.3em] text-taupe">
        Cuándo &amp; Dónde
      </p>
      <h2 className="mt-2 text-center font-[family-name:var(--font-cormorant)] text-[40px] font-medium text-cocoa">
        Los detalles
      </h2>
      <div className="mx-auto mt-9 flex max-w-[600px] items-stretch">
        <DetailCol label="Fecha" lines={["5 de Diciembre", "2026"]} />
        <span className="w-px bg-hairline" />
        <DetailCol label="Hora" lines={["2:00 PM", "de la tarde"]} />
        <span className="w-px bg-hairline" />
        <DetailCol label="Recepción" lines={["Terraza", "Balcones"]} />
      </div>
      <div className="mx-auto mt-9 max-w-[620px] overflow-hidden rounded border border-[#E0D4BF] bg-cream">
        <VenueMap />
        <div className="px-7 py-6 text-center">
          <p className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-cocoa">
            Terraza Balcones
          </p>
          <p className="mt-1 mb-4 font-[family-name:var(--font-ebgaramond)] text-[15px] leading-relaxed text-mocha">
            Boulevard Manuel J. Clouthier Ext. 5991
            <br />
            80199 Culiacán Rosales, Sinaloa
          </p>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-sm border border-rosegold px-6 py-3 font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.13em] text-cocoa transition hover:opacity-80"
          >
            Cómo llegar
          </a>
        </div>
      </div>
    </section>
  );
}

function DetailCol({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div className="flex-1 px-3 py-1.5 text-center sm:px-4">
      <p className="mb-2.5 font-[family-name:var(--font-tenor)] text-[11px] uppercase tracking-[0.25em] text-taupe">
        {label}
      </p>
      <p className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-tight text-cocoa sm:text-[25px]">
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
