'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Collapse,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  Functions,
  ExpandMore,
  ExpandLess,
  ArrowForward,
} from '@mui/icons-material';
import { calculatorFormulas, type FormulaSet } from '@/lib/calculators/formulas';

interface ShowMeTheMathProps {
  calculatorSlug: string;
  details: Record<string, number | string>;
}

export function ShowMeTheMath({ calculatorSlug, details }: ShowMeTheMathProps) {
  const [open, setOpen] = useState(false);

  const generator = calculatorFormulas[calculatorSlug];
  if (!generator) return null;

  const formulaSets = generator(details);
  if (!formulaSets || formulaSets.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: open ? 'primary.light' : 'divider',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <Button
        fullWidth
        onClick={() => setOpen(!open)}
        sx={{
          py: 2,
          px: 3,
          justifyContent: 'space-between',
          textTransform: 'none',
          color: 'text.primary',
          '&:hover': { bgcolor: 'grey.50' },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Functions sx={{ fontSize: 20, color: 'primary.main' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Show Me the Math
          </Typography>
          <Chip
            label="Transparency"
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
              bgcolor: 'primary.50',
              color: 'primary.main',
            }}
          />
        </Stack>
        {open ? <ExpandLess sx={{ color: 'text.secondary' }} /> : <ExpandMore sx={{ color: 'text.secondary' }} />}
      </Button>

      <Collapse in={open}>
        <Divider />
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Here are the exact formulas behind your numbers. No black boxes — just math.
          </Typography>

          <Stack spacing={3}>
            {formulaSets.map((set, setIndex) => (
              <FormulaSection key={setIndex} formulaSet={set} />
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
}

function FormulaSection({ formulaSet }: { formulaSet: FormulaSet }) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, mb: 1.5, color: 'primary.dark' }}
      >
        {formulaSet.title}
      </Typography>
      <Stack spacing={1}>
        {formulaSet.steps.map((step, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              gap: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'grey.50',
              alignItems: 'flex-start',
            }}
          >
            <ArrowForward sx={{ fontSize: 14, mt: 0.5, color: 'primary.main', flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {step.label}
                </Typography>
                {step.computedValue && (
                  <Chip
                    label={step.computedValue}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor: 'success.50',
                      color: 'success.dark',
                      border: '1px solid',
                      borderColor: 'success.light',
                    }}
                  />
                )}
              </Stack>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  color: 'primary.main',
                  fontWeight: 600,
                  display: 'block',
                  mt: 0.25,
                }}
              >
                {step.formula}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                {step.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
