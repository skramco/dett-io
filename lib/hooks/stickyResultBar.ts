/** Compact mobile result bar — shared placement rules (ENG-354). */

export const STICKY_RESULT_BREAKPOINT_PX = 768;
export const KEYBOARD_OPEN_THRESHOLD_PX = 150;
export const STICKY_BAR_HEIGHT_PX = 64;

export type StickyBarPlacement = 'top' | 'bottom';

export function isKeyboardOpen(
  windowInnerHeight: number,
  visualViewportHeight: number
): boolean {
  return windowInnerHeight - visualViewportHeight > KEYBOARD_OPEN_THRESHOLD_PX;
}

/**
 * Keep the compact bar visible only while the full headline result is still
 * below the fold. Hide once the user has scrolled to (or past) it.
 */
export function isHeadlineBelowViewport(
  isIntersecting: boolean,
  boundingClientTop: number
): boolean {
  return !isIntersecting && boundingClientTop > 0;
}

export function stickyBarPlacement(keyboardOpen: boolean): StickyBarPlacement {
  // When the software keyboard is open, pin to the top of the visual viewport
  // so the bar never sits on the keyboard or the field being edited.
  return keyboardOpen ? 'top' : 'bottom';
}

export function isEditableTarget(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (el.getAttribute('contenteditable') === 'true') return true;
  const role = el.getAttribute('role');
  return role === 'slider' || role === 'spinbutton' || role === 'combobox' || role === 'textbox';
}

export function rectsOverlap(
  a: { top: number; bottom: number },
  b: { top: number; bottom: number }
): boolean {
  return a.bottom > b.top && a.top < b.bottom;
}

export function estimateBarRect(args: {
  placement: StickyBarPlacement;
  viewportTop: number;
  viewportBottom: number;
  barHeight?: number;
}): { top: number; bottom: number } {
  const height = args.barHeight ?? STICKY_BAR_HEIGHT_PX;
  if (args.placement === 'top') {
    return { top: args.viewportTop, bottom: args.viewportTop + height };
  }
  return { top: args.viewportBottom - height, bottom: args.viewportBottom };
}

/** Hide the bar if it would cover the field the user is actively editing. */
export function shouldHideForEditedField(args: {
  activeElement: Element | null;
  barRect: { top: number; bottom: number };
}): boolean {
  if (!isEditableTarget(args.activeElement)) return false;
  const field = args.activeElement!.getBoundingClientRect();
  return rectsOverlap({ top: field.top, bottom: field.bottom }, args.barRect);
}
