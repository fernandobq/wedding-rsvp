import { FloralSprig, LeafDivider } from "./Decorations";

export default function Hero() {
  return (
    <section
      aria-label="Invitación"
      className="px-8 pt-16 pb-12 text-center sm:px-16 sm:pt-[74px]"
    >
      <p className="font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.4em] text-taupe">
        Nuestra boda
      </p>
      <div className="mt-6 mb-1 flex justify-center">
        <FloralSprig />
      </div>
      <h1 className="leading-[0.9]">
        <span className="block font-[family-name:var(--font-pinyon)] text-[76px] text-cocoa sm:text-[104px]">
          Leticia
        </span>
        <span className="block font-[family-name:var(--font-pinyon)] text-[44px] text-rosegold sm:text-[58px]">
          &amp;
        </span>
        <span className="block font-[family-name:var(--font-pinyon)] text-[76px] text-cocoa sm:text-[104px]">
          Fernando
        </span>
      </h1>
      <LeafDivider />
      <p className="font-[family-name:var(--font-cormorant)] text-lg uppercase tracking-[0.18em] text-[#7A6B57] sm:text-[21px]">
        Sábado 5 de Diciembre · 2026
      </p>
      <p className="mx-auto mt-6 max-w-[470px] font-[family-name:var(--font-ebgaramond)] text-[19px] italic leading-[1.75] text-mocha text-pretty">
        Con la bendición de Dios y de nuestras familias, queremos compartir
        contigo el día en que uniremos nuestras vidas. Tu presencia hará este
        momento aún más especial.
      </p>
    </section>
  );
}
