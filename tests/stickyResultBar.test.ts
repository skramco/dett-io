import { describe, expect, it } from 'vitest';
import {
  estimateBarRect,
  isEditableTarget,
  isHeadlineBelowViewport,
  isKeyboardOpen,
  rectsOverlap,
  shouldHideForEditedField,
  stickyBarPlacement,
} from '../lib/hooks/stickyResultBar';

describe('isKeyboardOpen', () => {
  it('treats a large visual-viewport shrink as a keyboard', () => {
    expect(isKeyboardOpen(800, 400)).toBe(true);
  });

  it('ignores small chrome / address-bar collapse', () => {
    expect(isKeyboardOpen(800, 720)).toBe(false);
  });
});

describe('isHeadlineBelowViewport', () => {
  it('shows the bar while the headline is still below the fold', () => {
    expect(isHeadlineBelowViewport(false, 900)).toBe(true);
  });

  it('hides the bar once the headline is on screen', () => {
    expect(isHeadlineBelowViewport(true, 80)).toBe(false);
  });

  it('hides the bar after the user has scrolled past the headline', () => {
    expect(isHeadlineBelowViewport(false, -200)).toBe(false);
  });
});

describe('stickyBarPlacement', () => {
  it('pins to the bottom by default', () => {
    expect(stickyBarPlacement(false)).toBe('bottom');
  });

  it('moves to the top of the visual viewport when the keyboard is open', () => {
    expect(stickyBarPlacement(true)).toBe('top');
  });
});

describe('estimateBarRect / overlap', () => {
  it('places a bottom bar against the visual viewport bottom', () => {
    expect(estimateBarRect({ placement: 'bottom', viewportTop: 0, viewportBottom: 800, barHeight: 64 }))
      .toEqual({ top: 736, bottom: 800 });
  });

  it('places a top bar against the visual viewport top', () => {
    expect(estimateBarRect({ placement: 'top', viewportTop: 40, viewportBottom: 500, barHeight: 64 }))
      .toEqual({ top: 40, bottom: 104 });
  });

  it('detects overlapping rectangles', () => {
    expect(rectsOverlap({ top: 700, bottom: 760 }, { top: 736, bottom: 800 })).toBe(true);
    expect(rectsOverlap({ top: 100, bottom: 160 }, { top: 736, bottom: 800 })).toBe(false);
  });
});

describe('shouldHideForEditedField', () => {
  it('ignores non-editable targets', () => {
    const div = { tagName: 'DIV', getAttribute: () => null, getBoundingClientRect: () => ({ top: 740, bottom: 780 }) };
    expect(
      shouldHideForEditedField({
        activeElement: div as unknown as Element,
        barRect: { top: 736, bottom: 800 },
      })
    ).toBe(false);
  });

  it('hides when an input would sit under the bar', () => {
    const input = {
      tagName: 'INPUT',
      getAttribute: () => null,
      getBoundingClientRect: () => ({ top: 740, bottom: 790 }),
    };
    expect(
      shouldHideForEditedField({
        activeElement: input as unknown as Element,
        barRect: { top: 736, bottom: 800 },
      })
    ).toBe(true);
  });

  it('stays visible when the focused input is clear of the bar', () => {
    const input = {
      tagName: 'INPUT',
      getAttribute: () => null,
      getBoundingClientRect: () => ({ top: 200, bottom: 256 }),
    };
    expect(
      shouldHideForEditedField({
        activeElement: input as unknown as Element,
        barRect: { top: 736, bottom: 800 },
      })
    ).toBe(false);
  });
});

describe('isEditableTarget', () => {
  it('recognizes form controls and slider roles', () => {
    expect(isEditableTarget({ tagName: 'INPUT', getAttribute: () => null } as unknown as Element)).toBe(true);
    expect(isEditableTarget({ tagName: 'DIV', getAttribute: (n: string) => (n === 'role' ? 'slider' : null) } as unknown as Element)).toBe(true);
    expect(isEditableTarget({ tagName: 'DIV', getAttribute: () => null } as unknown as Element)).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });
});
