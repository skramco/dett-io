'use client';

import { Box, Stack, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

interface AssumptionsBlockProps {
  /** Calculator-specific assumption lines (e.g. rate, term, guideline thresholds). */
  items?: string[];
  /** Tighter spacing for embed mode. */
  compact?: boolean;
}

/**
 * Compliance-required assumptions block, rendered above the fold on every
 * calculator. Always states that displayed interest rates are not APRs and
 * that payments assume the stated term (Reg Z advertising hygiene).
 */
export function AssumptionsBlock({ items, compact = false }: AssumptionsBlockProps) {
  return (
    <Box
      sx={{
        mb: compact ? 2 : 3,
        px: 2,
        py: 1.5,
        bgcolor: '#F8FAFC',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <InfoOutlined sx={{ fontSize: 16, color: 'text.secondary', mt: '2px', flexShrink: 0 }} />
        <Box>
          <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.6, color: 'text.secondary' }}>
            <strong>Assumptions:</strong>{' '}
            {items && items.length > 0 ? `${items.join('. ')}. ` : ''}
            Results are educational estimates only — not a loan offer, approval decision, or indication that you
            will receive any particular terms.
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.6, color: 'text.secondary', mt: 0.5 }}>
            Payments shown assume the stated interest rate and loan term. Interest rates are not APRs — your APR
            will differ once lender fees and other loan costs are included.
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
