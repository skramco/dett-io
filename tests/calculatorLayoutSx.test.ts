import { describe, expect, it } from 'vitest';
import { calculatorBodySx } from '../components/mui/calculator/calculatorBodySx';

describe('calculatorBodySx', () => {
  const sx = calculatorBodySx(88);

  it('lets the inputs panel grow with the page instead of nested-scrolling', () => {
    expect(sx['& .calculator-inputs']).toEqual({
      maxHeight: 'none',
      overflow: 'visible',
      pb: { xs: 'calc(88px + env(safe-area-inset-bottom, 0px))', sm: 0 },
    });
    expect(sx['& .calculator-inputs']).not.toHaveProperty('overflowY');
    expect(sx['& .calculator-inputs']).not.toHaveProperty('maxHeight', expect.stringContaining('100vh'));
  });

  it('pads the input column on mobile so the sticky result bar does not cover the last field', () => {
    expect(sx['& .calculator-inputs'].pb).toEqual({
      xs: 'calc(88px + env(safe-area-inset-bottom, 0px))',
      sm: 0,
    });
  });

  it('does not paint a custom scrollbar track on the inputs panel', () => {
    expect(sx['& .calculator-inputs']).not.toHaveProperty('&::-webkit-scrollbar');
    expect(sx['& .calculator-inputs']).not.toHaveProperty('&::-webkit-scrollbar-track');
  });

  it('makes the results column sticky on desktop without a max-height', () => {
    const results = sx['& .MuiGrid-root:has(> .calculator-inputs) + .MuiGrid-root'];
    expect(results).toMatchObject({
      position: { xs: 'static', lg: 'sticky' },
      top: { lg: 88 },
      alignSelf: 'flex-start',
    });
    expect(results).not.toHaveProperty('overflowY');
    expect(results).not.toHaveProperty('maxHeight');
  });
});
