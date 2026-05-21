import { cn } from "@/lib/utils";

interface MaskProps {
  className?: string;
  size?: number;
}

export function KpelleMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <ellipse cx="32" cy="38" rx="18" ry="26" fill="#8B4513" stroke="#5C2A00" strokeWidth="1.5"/>
      <ellipse cx="32" cy="28" rx="7" ry="5" fill="#3D1A00"/>
      <ellipse cx="24" cy="40" rx="4" ry="6" fill="#3D1A00"/>
      <ellipse cx="40" cy="40" rx="4" ry="6" fill="#3D1A00"/>
      <path d="M26 52 Q32 56 38 52" stroke="#3D1A00" strokeWidth="1.5" fill="none"/>
      <line x1="32" y1="12" x2="32" y2="4" stroke="#8B4513" strokeWidth="2"/>
      <line x1="28" y1="8" x2="24" y2="3" stroke="#8B4513" strokeWidth="1.5"/>
      <line x1="36" y1="8" x2="40" y2="3" stroke="#8B4513" strokeWidth="1.5"/>
      <ellipse cx="32" cy="14" rx="4" ry="3" fill="#C68642"/>
    </svg>
  );
}

export function BassaMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <path d="M32 8 Q50 12 52 38 Q52 60 32 70 Q12 60 12 38 Q12 12 32 8Z" fill="#6B3A2A" stroke="#3D1A00" strokeWidth="1.5"/>
      <rect x="24" y="26" width="16" height="3" rx="1.5" fill="#1A0A00"/>
      <path d="M20 38 Q32 34 44 38" stroke="#1A0A00" strokeWidth="1.5" fill="none"/>
      <path d="M24 48 Q32 52 40 48" stroke="#1A0A00" strokeWidth="1.5" fill="none"/>
      <path d="M18 20 Q12 10 18 6 Q24 8 22 16" fill="#8B5E3C" stroke="#3D1A00" strokeWidth="1"/>
      <path d="M46 20 Q52 10 46 6 Q40 8 42 16" fill="#8B5E3C" stroke="#3D1A00" strokeWidth="1"/>
      <circle cx="32" cy="8" r="3" fill="#C68642"/>
    </svg>
  );
}

export function GreboMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <path d="M32 6 L52 20 L52 55 L32 70 L12 55 L12 20 Z" fill="#7B4F2E" stroke="#4A2800" strokeWidth="1.5"/>
      <path d="M22 30 L32 26 L42 30" stroke="#2A1400" strokeWidth="2" fill="none"/>
      <rect x="27" y="36" width="10" height="14" rx="3" fill="#2A1400"/>
      <circle cx="22" cy="42" r="4" fill="#2A1400"/>
      <circle cx="42" cy="42" r="4" fill="#2A1400"/>
      <path d="M32 6 L32 2" stroke="#7B4F2E" strokeWidth="2"/>
      <path d="M26 4 L18 2" stroke="#7B4F2E" strokeWidth="1.5"/>
      <path d="M38 4 L46 2" stroke="#7B4F2E" strokeWidth="1.5"/>
    </svg>
  );
}

export function GioMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <ellipse cx="32" cy="40" rx="20" ry="28" fill="#5C3317" stroke="#2D1A00" strokeWidth="1.5"/>
      <path d="M14 32 Q32 22 50 32" fill="#3D2200" stroke="#2D1A00" strokeWidth="1"/>
      <ellipse cx="25" cy="42" rx="5" ry="7" fill="#2D1A00"/>
      <ellipse cx="39" cy="42" rx="5" ry="7" fill="#2D1A00"/>
      <rect x="28" y="52" width="8" height="5" rx="1" fill="#2D1A00"/>
      <path d="M22 28 Q32 18 42 28" stroke="#8B5E3C" strokeWidth="2" fill="none"/>
      <path d="M26 22 L20 12 M32 20 L32 10 M38 22 L44 12" stroke="#8B5E3C" strokeWidth="1.5"/>
    </svg>
  );
}

export function ManoMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <rect x="14" y="10" width="36" height="58" rx="10" fill="#6B3A1F" stroke="#3D1A00" strokeWidth="1.5"/>
      <rect x="22" y="22" width="20" height="6" rx="3" fill="#2A1000"/>
      <circle cx="24" cy="40" r="5" fill="#2A1000"/>
      <circle cx="40" cy="40" r="5" fill="#2A1000"/>
      <path d="M24 52 Q32 58 40 52" stroke="#2A1000" strokeWidth="1.5" fill="none"/>
      <line x1="32" y1="10" x2="32" y2="4" stroke="#6B3A1F" strokeWidth="2.5"/>
      <ellipse cx="32" cy="4" rx="5" ry="3" fill="#9B6B3F"/>
    </svg>
  );
}

export function KruMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <path d="M32 8 Q54 16 54 40 Q54 65 32 72 Q10 65 10 40 Q10 16 32 8Z" fill="#4A2800" stroke="#2D1400" strokeWidth="1.5"/>
      <path d="M10 36 Q20 28 32 32 Q44 28 54 36" fill="#2D1400" stroke="#1A0A00" strokeWidth="1"/>
      <ellipse cx="32" cy="44" rx="6" ry="4" fill="#1A0A00"/>
      <circle cx="23" cy="44" r="4.5" fill="#1A0A00"/>
      <circle cx="41" cy="44" r="4.5" fill="#1A0A00"/>
      <path d="M18 56 Q32 64 46 56" stroke="#8B5E3C" strokeWidth="2" fill="none"/>
      <path d="M26 8 Q24 2 20 2" stroke="#4A2800" strokeWidth="1.5" fill="none"/>
      <path d="M38 8 Q40 2 44 2" stroke="#4A2800" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

export function LormaMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <ellipse cx="32" cy="42" rx="16" ry="30" fill="#7B3F1A" stroke="#4A1A00" strokeWidth="1.5"/>
      <ellipse cx="32" cy="18" rx="16" ry="12" fill="#9B5A2A" stroke="#4A1A00" strokeWidth="1.5"/>
      <ellipse cx="32" cy="20" rx="10" ry="8" fill="#7B3F1A"/>
      <ellipse cx="26" cy="44" rx="4" ry="6" fill="#2A1000"/>
      <ellipse cx="38" cy="44" rx="4" ry="6" fill="#2A1000"/>
      <ellipse cx="32" cy="36" rx="5" ry="3" fill="#2A1000"/>
      <path d="M25 56 Q32 60 39 56" stroke="#2A1000" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

export function KissiMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <path d="M32 10 L48 24 L48 56 Q40 70 32 72 Q24 70 16 56 L16 24 Z" fill="#5C2E14" stroke="#2D1200" strokeWidth="1.5"/>
      <circle cx="32" cy="10" r="6" fill="#8B5E3C" stroke="#2D1200" strokeWidth="1"/>
      <path d="M18 36 Q25 30 32 34 Q39 30 46 36" fill="#2D1200" stroke="#1A0800" strokeWidth="1"/>
      <circle cx="25" cy="46" r="5" fill="#1A0800"/>
      <circle cx="39" cy="46" r="5" fill="#1A0800"/>
      <rect x="27" y="55" width="10" height="4" rx="2" fill="#1A0800"/>
      <line x1="26" y1="10" x2="18" y2="4" stroke="#5C2E14" strokeWidth="1.5"/>
      <line x1="38" y1="10" x2="46" y2="4" stroke="#5C2E14" strokeWidth="1.5"/>
    </svg>
  );
}

export function GolaMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <ellipse cx="32" cy="46" rx="18" ry="24" fill="#3D1F0A" stroke="#1A0800" strokeWidth="1.5"/>
      <ellipse cx="32" cy="22" rx="18" ry="16" fill="#5C3317" stroke="#1A0800" strokeWidth="1.5"/>
      <ellipse cx="32" cy="24" rx="12" ry="11" fill="#3D1F0A"/>
      <ellipse cx="32" cy="16" rx="12" ry="8" fill="#7B4F2E" stroke="#1A0800" strokeWidth="1"/>
      <ellipse cx="25" cy="48" rx="4" ry="6" fill="#1A0800"/>
      <ellipse cx="39" cy="48" rx="4" ry="6" fill="#1A0800"/>
      <path d="M25 58 Q32 63 39 58" stroke="#1A0800" strokeWidth="1.5" fill="none"/>
      <ellipse cx="32" cy="40" rx="5" ry="3" fill="#1A0800"/>
    </svg>
  );
}

export function MandingoMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <path d="M32 8 Q52 14 54 36 Q56 58 32 70 Q8 58 10 36 Q12 14 32 8Z" fill="#6B3A1F" stroke="#3D1A00" strokeWidth="1.5"/>
      <path d="M20 26 Q26 18 32 22 Q38 18 44 26" fill="none" stroke="#C68642" strokeWidth="2"/>
      <path d="M22 32 Q32 28 42 32" fill="none" stroke="#C68642" strokeWidth="1.5"/>
      <ellipse cx="25" cy="42" rx="4" ry="6" fill="#1A0A00"/>
      <ellipse cx="39" cy="42" rx="4" ry="6" fill="#1A0A00"/>
      <path d="M25 54 Q32 59 39 54" stroke="#C68642" strokeWidth="2" fill="none"/>
      <circle cx="32" cy="8" r="4" fill="#C68642"/>
      <line x1="32" y1="4" x2="32" y2="0" stroke="#C68642" strokeWidth="1.5"/>
    </svg>
  );
}

export function MendeMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <rect x="16" y="8" width="32" height="62" rx="12" fill="#5C2E14" stroke="#2D1200" strokeWidth="1.5"/>
      <rect x="22" y="18" width="20" height="8" rx="4" fill="#1A0800"/>
      <rect x="22" y="34" width="8" height="10" rx="3" fill="#1A0800"/>
      <rect x="34" y="34" width="8" height="10" rx="3" fill="#1A0800"/>
      <path d="M22 52 Q32 58 42 52" stroke="#1A0800" strokeWidth="2" fill="none"/>
      <line x1="16" y1="28" x2="8" y2="24" stroke="#5C2E14" strokeWidth="2"/>
      <line x1="48" y1="28" x2="56" y2="24" stroke="#5C2E14" strokeWidth="2"/>
    </svg>
  );
}

export function SapoMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <path d="M32 10 Q50 18 50 42 Q50 62 32 72 Q14 62 14 42 Q14 18 32 10Z" fill="#4A2800" stroke="#2D1400" strokeWidth="1.5"/>
      <path d="M20 30 L32 20 L44 30 L44 42 L32 50 L20 42 Z" fill="#2D1400" stroke="#1A0800" strokeWidth="1"/>
      <circle cx="26" cy="36" r="3.5" fill="#8B4513"/>
      <circle cx="38" cy="36" r="3.5" fill="#8B4513"/>
      <path d="M26 46 Q32 50 38 46" stroke="#8B4513" strokeWidth="1.5" fill="none"/>
      <path d="M32 10 L32 4 M28 11 L24 5 M36 11 L40 5" stroke="#6B3A1F" strokeWidth="1.5"/>
    </svg>
  );
}

export function BelleMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <ellipse cx="32" cy="40" rx="17" ry="28" fill="#7B3F1A" stroke="#4A1A00" strokeWidth="1.5"/>
      <path d="M15 32 Q32 24 49 32" fill="#4A1A00" stroke="#2D1000" strokeWidth="1"/>
      <ellipse cx="24" cy="42" rx="5" ry="7" fill="#2D1000"/>
      <ellipse cx="40" cy="42" rx="5" ry="7" fill="#2D1000"/>
      <ellipse cx="32" cy="34" rx="4" ry="2.5" fill="#2D1000"/>
      <path d="M24 56 Q32 62 40 56" stroke="#2D1000" strokeWidth="1.5" fill="none"/>
      <path d="M24 16 Q20 8 24 4 Q28 6 26 14" fill="#9B5A2A"/>
      <path d="M40 16 Q44 8 40 4 Q36 6 38 14" fill="#9B5A2A"/>
    </svg>
  );
}

export function DeyMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <path d="M20 12 Q32 6 44 12 L50 30 L50 54 Q42 68 32 70 Q22 68 14 54 L14 30 Z" fill="#6B3A1F" stroke="#3D1A00" strokeWidth="1.5"/>
      <rect x="24" y="24" width="16" height="5" rx="2.5" fill="#1A0800"/>
      <circle cx="24" cy="40" r="5" fill="#1A0800"/>
      <circle cx="40" cy="40" r="5" fill="#1A0800"/>
      <rect x="27" y="50" width="10" height="5" rx="2" fill="#1A0800"/>
      <path d="M20 12 L14 6 M44 12 L50 6" stroke="#6B3A1F" strokeWidth="2"/>
      <circle cx="14" cy="5" r="2.5" fill="#C68642"/>
      <circle cx="50" cy="5" r="2.5" fill="#C68642"/>
    </svg>
  );
}

export function VaiMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <ellipse cx="32" cy="40" rx="19" ry="28" fill="#2D1A0A" stroke="#1A0800" strokeWidth="1.5"/>
      <path d="M18 28 Q25 20 32 24 Q39 20 46 28" fill="none" stroke="#C68642" strokeWidth="2.5"/>
      <path d="M20 34 Q26 30 32 32 Q38 30 44 34" fill="none" stroke="#C68642" strokeWidth="1.5"/>
      <path d="M22 40 Q32 36 42 40" fill="none" stroke="#8B5E3C" strokeWidth="1"/>
      <ellipse cx="25" cy="48" rx="4" ry="6" fill="#1A0800"/>
      <ellipse cx="39" cy="48" rx="4" ry="6" fill="#1A0800"/>
      <path d="M25 58 Q32 63 39 58" stroke="#C68642" strokeWidth="2" fill="none"/>
      <circle cx="32" cy="12" r="4" fill="#C68642" stroke="#8B5E3C" strokeWidth="1"/>
    </svg>
  );
}

export function GbandiMask({ className, size = 64 }: MaskProps) {
  return (
    <svg viewBox="0 0 64 80" fill="none" width={size} height={size * 1.25} className={className}>
      <path d="M32 8 L50 22 L52 50 Q44 68 32 72 Q20 68 12 50 L14 22 Z" fill="#5C2E14" stroke="#2D1200" strokeWidth="1.5"/>
      <ellipse cx="32" cy="10" rx="8" ry="5" fill="#8B5E3C" stroke="#2D1200" strokeWidth="1"/>
      <path d="M18 34 Q25 28 32 32 Q39 28 46 34" fill="#2D1200" stroke="#1A0800" strokeWidth="1"/>
      <ellipse cx="25" cy="44" rx="4.5" ry="6.5" fill="#1A0800"/>
      <ellipse cx="39" cy="44" rx="4.5" ry="6.5" fill="#1A0800"/>
      <path d="M24 56 Q32 62 40 56" stroke="#1A0800" strokeWidth="1.5" fill="none"/>
      <line x1="22" y1="8" x2="16" y2="2" stroke="#5C2E14" strokeWidth="1.5"/>
      <line x1="42" y1="8" x2="48" y2="2" stroke="#5C2E14" strokeWidth="1.5"/>
      <line x1="32" y1="6" x2="32" y2="0" stroke="#5C2E14" strokeWidth="2"/>
    </svg>
  );
}

// Map from tribe code to mask component
export const TRIBE_MASKS: Record<string, React.ComponentType<MaskProps>> = {
  kpe: KpelleMask,
  bss: BassaMask,
  grb: GreboMask,
  gio: GioMask,
  mno: ManoMask,
  kru: KruMask,
  lor: LormaMask,
  kis: KissiMask,
  gol: GolaMask,
  man: MandingoMask,
  mnd: MendeMask,
  sap: SapoMask,
  bel: BelleMask,
  dey: DeyMask,
  vai: VaiMask,
  gbd: GbandiMask,
};

export function TribeMask({ code, size = 64, className }: { code: string; size?: number; className?: string }) {
  const Mask = TRIBE_MASKS[code];
  if (!Mask) return null;
  return <Mask size={size} className={className} />;
}
