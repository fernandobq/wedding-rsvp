"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Lang = "es" | "en";

export const DEFAULT_LANG: Lang = "es";
export const LANG_STORAGE_KEY = "rsvp-lang";

function isLang(value: unknown): value is Lang {
  return value === "es" || value === "en";
}

type Dict = {
  langToggle: { es: string; en: string };
  invited: string;
  seeYouThere: string;
  missYou: string;
  greeting: (name: string) => string;
  joinUs: string;
  onlyOnce: string;
  howMany: string;
  guestOption: (n: number) => string;
  yesButton: string;
  noButton: string;
  saving: string;
  thankYou: (name: string) => string;
  savedYes: (maxGuests: number, partySize: number) => string;
  savedNo: string;
  doneNote: string;
  allSet: (name: string) => string;
  lockedYes: (maxGuests: number, partySize: number | null) => string;
  lockedNo: string;
  lockedAlready: string;
  lockedNote: string;
  errorTitle: string;
  errorBody: string;
};

export const translations: Record<Lang, Dict> = {
  es: {
    langToggle: { es: "ES", en: "EN" },
    invited: "Estás invitado",
    seeYouThere: "Nos vemos allá",
    missYou: "Te vamos a extrañar",
    greeting: (name) => `¡Hola, ${name}!`,
    joinUs: "Nos encantaría celebrar contigo. ¿Nos acompañas?",
    onlyOnce:
      "Nota: solo puedes responder una vez, así que elige la opción correcta para ti.",
    howMany: "¿Cuántos vienen?",
    guestOption: (n) => `${n} ${n === 1 ? "invitado" : "invitados"}`,
    yesButton: "Sí, ahí estaré",
    noButton: "Lo siento, no podré asistir",
    saving: "Guardando…",
    thankYou: (name) => `¡Gracias, ${name}!`,
    savedYes: (maxGuests, partySize) =>
      maxGuests > 1
        ? `Tu confirmación se guardó para ${partySize} ${
            partySize === 1 ? "invitado" : "invitados"
          }.`
        : "Tu confirmación se guardó.",
    savedNo: "Tu respuesta se guardó. Gracias por avisarnos.",
    doneNote:
      "Tu respuesta quedó registrada. ¿Necesitas cambiar algo? Contáctanos directamente y reabriremos tu invitación.",
    allSet: (name) => `¡Todo listo, ${name}!`,
    lockedYes: (maxGuests, partySize) =>
      maxGuests > 1 && partySize
        ? `Nos confirmaste que asistirás con ${partySize} ${
            partySize === 1 ? "invitado" : "invitados"
          }.`
        : "Nos confirmaste que asistirás.",
    lockedNo: "Nos avisaste que no podrás asistir.",
    lockedAlready: "Tu respuesta ya fue registrada.",
    lockedNote:
      "Tu respuesta quedó registrada. ¿Necesitas cambiarla? Contáctanos directamente y reabriremos tu invitación.",
    errorTitle: "Algo salió mal",
    errorBody:
      "Revisa el enlace de tu invitación o contáctanos directamente.",
  },
  en: {
    langToggle: { es: "ES", en: "EN" },
    invited: "You're invited",
    seeYouThere: "See you there",
    missYou: "We'll miss you",
    greeting: (name) => `Hi ${name}!`,
    joinUs: "We would be so happy to celebrate with you. Will you join us?",
    onlyOnce:
      "Heads up: you can only answer once, so pick the option that's right for you.",
    howMany: "How many of you are coming?",
    guestOption: (n) => `${n} ${n === 1 ? "guest" : "guests"}`,
    yesButton: "Yes, I'll be there",
    noButton: "Sorry, can't make it",
    saving: "Saving…",
    thankYou: (name) => `Thank you, ${name}!`,
    savedYes: (maxGuests, partySize) =>
      maxGuests > 1
        ? `Your RSVP is saved for ${partySize} ${
            partySize === 1 ? "guest" : "guests"
          }.`
        : "Your RSVP is saved.",
    savedNo: "Your response is saved. Thank you for letting us know.",
    doneNote:
      "This is locked in now. Need to change something? Just reach out to us directly and we'll reopen your invitation.",
    allSet: (name) => `You're all set, ${name}!`,
    lockedYes: (maxGuests, partySize) =>
      maxGuests > 1 && partySize
        ? `You let us know you'll be joining with ${partySize} ${
            partySize === 1 ? "guest" : "guests"
          }.`
        : "You let us know you'll be joining.",
    lockedNo: "You let us know you won't be able to make it.",
    lockedAlready: "Your RSVP has already been recorded.",
    lockedNote:
      "Your answer is locked in. Need to change it? Please reach out to us directly and we'll reopen your invitation.",
    errorTitle: "Hmm, something went wrong",
    errorBody:
      "Please double-check the link from your invitation, or reach out to us directly.",
  },
};

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Lang {
  const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
  return isLang(saved) ? saved : DEFAULT_LANG;
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG;
}

// Tracks the guest's chosen language via localStorage. The server snapshot is
// always Spanish so SSR and the first client render match (no hydration
// mismatch); React swaps in any saved preference after hydration.
export function useLanguage() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = useCallback((next: Lang) => {
    window.localStorage.setItem(LANG_STORAGE_KEY, next);
    listeners.forEach((listener) => listener());
  }, []);

  return { lang, setLang };
}
