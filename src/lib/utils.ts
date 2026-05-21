import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPartOfSpeech(pos: string): string {
  const map: Record<string, string> = {
    Noun: "n.", Verb: "v.", Adjective: "adj.", Adverb: "adv.",
    Pronoun: "pron.", Preposition: "prep.", Conjunction: "conj.",
    Interjection: "interj.", Other: "other",
  };
  return map[pos] ?? pos;
}

export function languageFlag(code: string): string {
  const flags: Record<string, string> = {
    kpe: "🌿", bss: "🌊", grb: "🌄", vai: "📜",
    mnd: "🏔️", gio: "🦅", kra: "🌳", lom: "🌾",
  };
  return flags[code] ?? "🗣️";
}
