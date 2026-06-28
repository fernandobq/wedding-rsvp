export function FloralSprig() {
  return (
    <svg width="40" height="54" viewBox="0 0 40 54" fill="none" aria-hidden="true">
      <path d="M20 0 V54" stroke="#C2B196" strokeWidth="1.2" />
      <g fill="#CDBDA0">
        <ellipse cx="11" cy="14" rx="8" ry="4.5" transform="rotate(28 11 14)" />
        <ellipse cx="29" cy="14" rx="8" ry="4.5" transform="rotate(-28 29 14)" />
        <ellipse cx="12" cy="28" rx="7" ry="4" transform="rotate(28 12 28)" />
        <ellipse cx="28" cy="28" rx="7" ry="4" transform="rotate(-28 28 28)" />
        <ellipse cx="20" cy="48" rx="4.5" ry="6" />
      </g>
    </svg>
  );
}

export function LeafFlower() {
  return (
    <svg width="30" height="22" viewBox="0 0 30 22" fill="none" aria-hidden="true">
      <path d="M2 16 C 8 14 11 16 13 19 C 8 20 4 19 2 16Z" fill="#C8B99E" />
      <path d="M28 16 C 22 14 19 16 17 19 C 22 20 26 19 28 16Z" fill="#C8B99E" />
      <g fill="#D8B7A4">
        <ellipse cx="15" cy="6" rx="3" ry="4.5" />
        <ellipse cx="15" cy="14" rx="3" ry="4.5" />
        <ellipse cx="10.5" cy="10" rx="4.5" ry="3" />
        <ellipse cx="19.5" cy="10" rx="4.5" ry="3" />
      </g>
      <circle cx="15" cy="10" r="2.4" fill="#B07A5E" />
    </svg>
  );
}

export function LeafDivider() {
  return (
    <div className="my-6 flex items-center justify-center gap-4">
      <span className="h-px w-16 bg-linear-to-r from-transparent to-[#C2B196]" />
      <LeafFlower />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-[#C2B196]" />
    </div>
  );
}

export function VenueMap() {
  return (
    <svg viewBox="0 0 620 240" width="100%" className="block" aria-hidden="true">
      <rect width="620" height="240" fill="#E7DDC9" />
      <rect x="34" y="26" width="150" height="78" rx="5" fill="#E0D5BF" />
      <rect x="210" y="20" width="120" height="60" rx="5" fill="#DED2BB" />
      <rect x="450" y="34" width="140" height="74" rx="5" fill="#E0D5BF" />
      <rect x="40" y="150" width="120" height="70" rx="5" fill="#DED2BB" />
      <rect x="470" y="150" width="120" height="70" rx="5" fill="#E0D5BF" />
      <path d="M250 150 q 60 -16 120 6 q 20 50 -30 70 q -70 12 -90 -30 Z" fill="#CFD8BE" />
      <path d="M0 124 H620" stroke="#FBF8F2" strokeWidth="16" />
      <path d="M196 0 V240" stroke="#FBF8F2" strokeWidth="14" />
      <path d="M430 0 V240" stroke="#FBF8F2" strokeWidth="12" />
      <path d="M0 124 H620" stroke="#D8CBB4" strokeWidth="1.5" strokeDasharray="2 9" />
      <g transform="translate(310,128)">
        <ellipse cx="0" cy="6" rx="11" ry="3.5" fill="rgba(80,60,40,.18)" />
        <path d="M0 2 C -13 -16 -11 -36 0 -36 C 11 -36 13 -16 0 2 Z" fill="#B07A5E" />
        <circle cx="0" cy="-23" r="6" fill="#FBF8F2" />
      </g>
    </svg>
  );
}
