'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { Edit, RestartAlt, Save } from '@mui/icons-material';
import { useIsEmbed } from '@/lib/embedContext';
import { trackEvent } from '@/lib/analytics';
import {
  SCENARIO_CORE_FIELDS,
  SCENARIO_FIELD_LABELS,
  formatScenarioChip,
  mapInputsToProfile,
  useScenario,
  type ScenarioNumericField,
  type ScenarioProfile,
} from '@/lib/scenario';
import { ScenarioForm } from './ScenarioForm';

interface ScenarioBarProps {
  calculatorInputs?: Record<string, unknown>;
}

export function ScenarioBar({ calculatorInputs }: ScenarioBarProps) {
  const isEmbed = useIsEmbed();
  const { profile, hasProfile, saveProfile, clearProfile } = useScenario();
  const [editorOpen, setEditorOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (isEmbed) return null;

  const chips = SCENARIO_CORE_FIELDS.flatMap((field) => {
    const value = profile?.[field];
    if (typeof value !== 'number') return [];
    return [{ field, value }];
  });

  const handleSaveFromForm = (next: Parameters<typeof saveProfile>[0]) => {
    saveProfile(next);
    trackEvent('cta_click', { cta_label: 'scenario_saved' });
    setEditorOpen(false);
    setToast('My scenario saved. Other calculators will pre-fill from it.');
  };

  const handleReset = () => {
    clearProfile();
    trackEvent('cta_click', { cta_label: 'scenario_reset' });
    setConfirmReset(false);
    setEditorOpen(false);
    setToast('My scenario cleared. Calculators will use their defaults.');
  };

  const handleSaveFromCalculator = () => {
    if (!calculatorInputs) return;
    const merged = mapInputsToProfile(calculatorInputs, profile ?? { version: 1, updatedAt: new Date().toISOString() });
    saveProfile(merged);
    trackEvent('cta_click', { cta_label: 'scenario_saved_from_calculator' });
    setToast('These numbers are now your scenario across calculators.');
  };

  if (!hasProfile) {
    return (
      <>
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: { xs: 2, md: 2.5 },
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                My scenario
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter income, debts, price, and rate once. Every calculator pre-fills.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {calculatorInputs && (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Save />}
                  onClick={handleSaveFromCalculator}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Save these numbers
                </Button>
              )}
              <Button
                size="small"
                variant="contained"
                onClick={() => setEditorOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Set up scenario
              </Button>
            </Stack>
          </Stack>
        </Paper>
        <ScenarioEditorDialog
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={handleSaveFromForm}
          onReset={() => setConfirmReset(true)}
        />
        <ResetConfirmDialog
          open={confirmReset}
          onClose={() => setConfirmReset(false)}
          onConfirm={handleReset}
        />
        <FeedbackToast message={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: { xs: 2, md: 2.5 },
          border: '1px solid',
          borderColor: 'primary.light',
          bgcolor: '#EBF5FF',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Using My scenario
              </Typography>
              <Chip
                component={Link}
                href="/scenario"
                clickable
                label="Edit page"
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.7rem', bgcolor: 'background.paper' }}
              />
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {chips.map(({ field, value }) => (
                <Chip
                  key={field}
                  size="small"
                  label={`${SCENARIO_FIELD_LABELS[field as ScenarioNumericField]} ${formatScenarioChip(field, value)}`}
                  sx={{ bgcolor: 'background.paper', fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {calculatorInputs && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<Save />}
                onClick={handleSaveFromCalculator}
                sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'background.paper' }}
              >
                Update from this calculator
              </Button>
            )}
            <Button
              size="small"
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditorOpen(true)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="inherit"
              startIcon={<RestartAlt />}
              onClick={() => setConfirmReset(true)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <ScenarioEditorDialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveFromForm}
        onReset={() => setConfirmReset(true)}
      />
      <ResetConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
      />
      <FeedbackToast message={toast} onClose={() => setToast(null)} />
    </>
  );
}

function ScenarioEditorDialog({
  open,
  onClose,
  onSave,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (profile: ScenarioProfile) => void;
  onReset: () => void;
}) {
  const { profile } = useScenario();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle>My scenario</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          These numbers pre-fill every calculator on this device. Edit a calculator freely to
          explore — use Update from this calculator if you want those numbers to follow you.
        </Typography>
        <ScenarioForm profile={profile} onSave={onSave} onReset={onReset} compact />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ResetConfirmDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Reset My scenario?</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 1 }}>
          This clears the saved profile on this device. Income, debts, price, rate, and other
          mapped fields return to each calculator&apos;s defaults.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Keep scenario
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" sx={{ textTransform: 'none' }}>
          Reset scenario
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function FeedbackToast({ message, onClose }: { message: string | null; onClose: () => void }) {
  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={4000}
      onClose={onClose}
      message={message}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    />
  );
}
