/**
 * ZIP → state lookup from USPS ZIP code prefix ranges.
 *
 * Uses the first three digits (ZIP3 / sectional-center facility). A handful
 * of prefixes that would otherwise land in a neighboring jurisdiction are
 * listed as exact overrides (e.g. 201xx is Northern Virginia, not DC).
 *
 * Puerto Rico, territories, and military ZIPs are intentionally unmapped —
 * our calculators only model the 50 states + DC.
 */

const ZIP3_RANGES: Array<[number, number, string]> = [
  [5, 5, 'NY'],
  [10, 27, 'MA'],
  [28, 29, 'RI'],
  [30, 38, 'NH'],
  [39, 49, 'ME'],
  [50, 59, 'VT'],
  [60, 69, 'CT'],
  [70, 89, 'NJ'],
  [100, 149, 'NY'],
  [150, 196, 'PA'],
  [197, 199, 'DE'],
  [200, 200, 'DC'],
  [201, 201, 'VA'],
  [202, 205, 'DC'],
  [206, 219, 'MD'],
  [220, 246, 'VA'],
  [247, 268, 'WV'],
  [270, 289, 'NC'],
  [290, 299, 'SC'],
  [300, 319, 'GA'],
  [320, 349, 'FL'],
  [350, 369, 'AL'],
  [370, 385, 'TN'],
  [386, 397, 'MS'],
  [398, 399, 'GA'],
  [400, 427, 'KY'],
  [430, 459, 'OH'],
  [460, 479, 'IN'],
  [480, 499, 'MI'],
  [500, 528, 'IA'],
  [530, 549, 'WI'],
  [550, 567, 'MN'],
  [570, 577, 'SD'],
  [580, 588, 'ND'],
  [590, 599, 'MT'],
  [600, 629, 'IL'],
  [630, 658, 'MO'],
  [660, 679, 'KS'],
  [680, 693, 'NE'],
  [700, 714, 'LA'],
  [716, 729, 'AR'],
  [730, 749, 'OK'],
  [750, 799, 'TX'],
  [800, 816, 'CO'],
  [820, 831, 'WY'],
  [832, 838, 'ID'],
  [840, 847, 'UT'],
  [850, 865, 'AZ'],
  [870, 884, 'NM'],
  [889, 898, 'NV'],
  [900, 961, 'CA'],
  [967, 968, 'HI'],
  [970, 979, 'OR'],
  [980, 994, 'WA'],
  [995, 999, 'AK'],
];

/** Prefixes that sit outside the contiguous ranges above. */
const ZIP3_SPECIAL: Record<number, string> = {
  55: 'MA', // IRS Andover
  733: 'TX', // Austin unique ZIP
  885: 'TX', // El Paso PO boxes
};

const ZIP3_TO_STATE: Record<number, string> = (() => {
  const map: Record<number, string> = {};
  for (const [start, end, state] of ZIP3_RANGES) {
    for (let n = start; n <= end; n++) {
      map[n] = state;
    }
  }
  return { ...map, ...ZIP3_SPECIAL };
})();

/** Strip to digits and pad/trim toward a 5-digit ZIP. */
export function normalizeZip(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 5);
}

export function isCompleteZip(zip: string): boolean {
  return /^\d{5}$/.test(zip);
}

/**
 * Map a 5-digit ZIP to a two-letter state code.
 * Returns null when the ZIP is incomplete, a territory, or unknown.
 */
export function zipToState(zip: string): string | null {
  const digits = normalizeZip(zip);
  if (digits.length < 5) return null;
  const prefix = parseInt(digits.slice(0, 3), 10);
  if (Number.isNaN(prefix)) return null;
  return ZIP3_TO_STATE[prefix] ?? null;
}
