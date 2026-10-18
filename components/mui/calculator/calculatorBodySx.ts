/**
 * Shared calculator column styles.
 * Inputs grow with the page (no inner scroll / scrollbar track).
 * Results stay sticky on desktop, constrained to this container so they
 * cannot overlap the footer.
 */
export function calculatorBodySx(resultsStickyTop: number) {
  return {
    '& .MuiPaper-root': {
      borderRadius: 3,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      border: '1px solid',
      borderColor: 'divider',
    },
    '& input, & select': {
      borderRadius: 2,
    },
    '& .calculator-inputs': {
      maxHeight: 'none',
      overflow: 'visible',
    },
    // Results are the Grid item immediately after the inputs column.
    '& .MuiGrid-root:has(> .calculator-inputs) + .MuiGrid-root': {
      position: { xs: 'static', lg: 'sticky' } as const,
      top: { lg: resultsStickyTop },
      alignSelf: 'flex-start' as const,
    },
  };
}
