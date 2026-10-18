import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (rel: string) => readFileSync(resolve(__dirname, '..', rel), 'utf8');

describe('calculator accessibility + chart code-splitting (ENG-335)', () => {
  it('wires SelectInput to its visible label and helper text', () => {
    const src = read('components/mui/calculator/InputPanel.tsx');
    expect(src).toMatch(/export function SelectInput[\s\S]*const labelId = useId\(\)/);
    expect(src).toMatch(/<InputLabel id=\{labelId\}/);
    expect(src).toMatch(/labelId=\{labelId\}/);
    expect(src).toMatch(/aria-describedby=\{helperText \? helperId : undefined\}/);
  });

  it('gives SliderInput an accessible name and formatted value text', () => {
    const src = read('components/mui/calculator/InputPanel.tsx');
    expect(src).toMatch(/export function SliderInput[\s\S]*const labelId = useId\(\)/);
    expect(src).toMatch(/aria-labelledby=\{labelId\}/);
    expect(src).toMatch(/getAriaValueText=\{valueLabelFormat \? \(v\) => valueLabelFormat\(v\) : undefined\}/);
  });

  it('announces the HeroMetric headline via a polite live region', () => {
    const src = read('components/mui/calculator/ResultsPanel.tsx');
    expect(src).toContain('role="status"');
    expect(src).toContain('aria-live="polite"');
    expect(src).toContain('aria-atomic="true"');
  });

  it('reuses the shared sticky result bar instead of adding a second one', () => {
    const results = read('components/mui/calculator/ResultsPanel.tsx');
    expect(results).toContain("import { StickyResultBar } from './StickyResultBar'");
    expect(results).toContain('<StickyResultBar label={label} value={value} watchRef={heroRef} />');
  });

  it('does not statically pull recharts through LazyCharts primitive re-exports', () => {
    const lazy = read('components/mui/calculator/LazyCharts.tsx');
    const primitives = read('components/mui/calculator/ChartPrimitives.tsx');

    expect(lazy).toMatch(/export \{ HorizontalBar, ChartLegend, CHART_COLORS \} from '\.\/ChartPrimitives'/);
    expect(lazy).not.toMatch(/export \{[^}]*CHART_COLORS[^}]*\} from '\.\/ChartComponents'/);
    expect(primitives).not.toMatch(/from ['"]recharts['"]/);
  });
});
