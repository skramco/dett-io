'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AccountBalance, Home, RestartAlt, Save } from '@mui/icons-material';
import { InputSection } from '@/components/mui/calculator/InputPanel';
import {
  SCENARIO_CORE_FIELDS,
  SCENARIO_FIELD_LABELS,
  emptyScenario,
  hasScenarioValues,
  type ScenarioProfile,
} from '@/lib/scenario';

type DraftField =
  | 'annualIncome'
  | 'monthlyDebts'
  | 'homePrice'
  | 'interestRate'
  | 'downPayment'
  | 'loanTerm'
  | 'creditScore'
  | 'propertyTaxRate'
  | 'homeInsuranceAnnual'
  | 'hoaFees';

type Draft = Record<DraftField, string>;

const EMPTY_DRAFT: Draft = {
  annualIncome: '',
  monthlyDebts: '',
  homePrice: '',
  interestRate: '',
  downPayment: '',
  loanTerm: '',
  creditScore: '',
  propertyTaxRate: '',
  homeInsuranceAnnual: '',
  hoaFees: '',
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    bgcolor: '#FFFFFF',
    '& fieldset': { borderWidth: 2, borderColor: '#D1D5DB' },
    '&:hover fieldset': { borderColor: '#196bc0', borderWidth: 2 },
    '&.Mui-focused fieldset': {
      borderWidth: 2,
      borderColor: '#196bc0',
      boxShadow: '0 0 0 3px rgba(25, 107, 192, 0.12)',
    },
  },
  '& .MuiInputBase-input': { fontWeight: 500, fontSize: '1rem', py: 1.75 },
  '& .MuiInputLabel-root': { fontWeight: 500, '&.Mui-focused': { color: '#196bc0' } },
};

function profileToDraft(profile: ScenarioProfile | null): Draft {
  const draft = { ...EMPTY_DRAFT };
  if (!profile) return draft;
  (Object.keys(EMPTY_DRAFT) as DraftField[]).forEach((field) => {
    const value = profile[field];
    draft[field] = typeof value === 'number' ? String(value) : '';
  });
  return draft;
}

function parseDraftNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === '') return undefined;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : undefined;
}

function draftToProfile(draft: Draft): ScenarioProfile {
  const profile = emptyScenario();
  (Object.keys(EMPTY_DRAFT) as DraftField[]).forEach((field) => {
    const value = parseDraftNumber(draft[field]);
    if (value != null) profile[field] = value;
  });
  return profile;
}

function OptionalNumberField({
  label,
  value,
  onChange,
  helperText,
  prefix,
  suffix,
  step,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <TextField
      fullWidth
      label={label}
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      helperText={helperText}
      inputProps={{ step, min, max }}
      InputProps={{
        startAdornment: prefix ? (
          <InputAdornment position="start">
            <Typography sx={{ fontWeight: 600, color: '#374151' }}>{prefix}</Typography>
          </InputAdornment>
        ) : undefined,
        endAdornment: suffix ? (
          <InputAdornment position="end">
            <Typography sx={{ fontWeight: 600, color: '#374151' }}>{suffix}</Typography>
          </InputAdornment>
        ) : undefined,
      }}
      sx={inputSx}
    />
  );
}

interface ScenarioFormProps {
  profile: ScenarioProfile | null;
  onSave: (profile: ScenarioProfile) => void;
  onReset: () => void;
  compact?: boolean;
}

export function ScenarioForm({ profile, onSave, onReset, compact = false }: ScenarioFormProps) {
  const [draft, setDraft] = useState<Draft>(() => profileToDraft(profile));

  useEffect(() => {
    setDraft(profileToDraft(profile));
  }, [profile]);

  const setField = (field: DraftField, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const downPaymentPercent = useMemo(() => {
    const price = parseDraftNumber(draft.homePrice);
    const down = parseDraftNumber(draft.downPayment);
    if (price == null || price <= 0 || down == null) return null;
    return Math.round((down / price) * 1000) / 10;
  }, [draft.homePrice, draft.downPayment]);

  const parsed = draftToProfile(draft);
  const filledCore = SCENARIO_CORE_FIELDS.filter((field) => typeof parsed[field] === 'number').length;
  const hasAnything = hasScenarioValues(parsed) || hasScenarioValues(profile);

  return (
    <Box>
      {!compact && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Saved on this device only — no account required. A signed-in copy is coming later.
          Shared calculator links still win over these numbers.
        </Alert>
      )}

      <InputSection title="The four numbers that follow you" icon={<AccountBalance />}>
        <OptionalNumberField
          label={SCENARIO_FIELD_LABELS.annualIncome}
          value={draft.annualIncome}
          onChange={(v) => setField('annualIncome', v)}
          prefix="$"
          helperText="Gross household income before taxes"
          min={0}
        />
        <OptionalNumberField
          label={SCENARIO_FIELD_LABELS.monthlyDebts}
          value={draft.monthlyDebts}
          onChange={(v) => setField('monthlyDebts', v)}
          prefix="$"
          helperText="Car, student loans, credit cards — not the mortgage"
          min={0}
        />
        <OptionalNumberField
          label={SCENARIO_FIELD_LABELS.homePrice}
          value={draft.homePrice}
          onChange={(v) => setField('homePrice', v)}
          prefix="$"
          min={0}
        />
        <OptionalNumberField
          label={SCENARIO_FIELD_LABELS.interestRate}
          value={draft.interestRate}
          onChange={(v) => setField('interestRate', v)}
          suffix="%"
          step={0.125}
          min={0}
          max={20}
          helperText="Leave blank to keep each calculator's market-rate default"
        />
        <Typography variant="caption" color="text.secondary">
          {filledCore} of 4 core fields filled. Partial profiles still pre-fill what you entered.
        </Typography>
      </InputSection>

      <InputSection title="Optional details" icon={<Home />} color="secondary">
        <OptionalNumberField
          label={SCENARIO_FIELD_LABELS.downPayment}
          value={draft.downPayment}
          onChange={(v) => setField('downPayment', v)}
          prefix="$"
          helperText={
            downPaymentPercent != null
              ? `${downPaymentPercent}% of home price`
              : 'Dollars. Calculators that use a percent will convert this.'
          }
          min={0}
        />
        <FormControl fullWidth>
          <InputLabel sx={{ fontWeight: 500, '&.Mui-focused': { color: '#196bc0' } }}>
            {SCENARIO_FIELD_LABELS.loanTerm}
          </InputLabel>
          <Select
            value={draft.loanTerm}
            label={SCENARIO_FIELD_LABELS.loanTerm}
            onChange={(e) => setField('loanTerm', String(e.target.value))}
            sx={{
              borderRadius: 1.5,
              bgcolor: '#FFFFFF',
              '& .MuiSelect-select': { fontWeight: 500, py: 1.5 },
              '& .MuiOutlinedInput-notchedOutline': { borderWidth: 2, borderColor: '#D1D5DB' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#196bc0', borderWidth: 2 },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: '#196bc0',
                boxShadow: '0 0 0 3px rgba(25, 107, 192, 0.12)',
              },
            }}
          >
            <MenuItem value="">Use calculator default</MenuItem>
            <MenuItem value="15">15 years</MenuItem>
            <MenuItem value="20">20 years</MenuItem>
            <MenuItem value="30">30 years</MenuItem>
          </Select>
        </FormControl>
        <OptionalNumberField
          label={SCENARIO_FIELD_LABELS.creditScore}
          value={draft.creditScore}
          onChange={(v) => setField('creditScore', v)}
          min={300}
          max={850}
          helperText="Estimated score — we never pull a credit report"
        />
        <OptionalNumberField
          label={SCENARIO_FIELD_LABELS.propertyTaxRate}
          value={draft.propertyTaxRate}
          onChange={(v) => setField('propertyTaxRate', v)}
          suffix="%"
          step={0.05}
          min={0}
        />
        <OptionalNumberField
          label={`${SCENARIO_FIELD_LABELS.homeInsuranceAnnual} (annual)`}
          value={draft.homeInsuranceAnnual}
          onChange={(v) => setField('homeInsuranceAnnual', v)}
          prefix="$"
          min={0}
        />
        <OptionalNumberField
          label={`${SCENARIO_FIELD_LABELS.hoaFees} (monthly)`}
          value={draft.hoaFees}
          onChange={(v) => setField('hoaFees', v)}
          prefix="$"
          min={0}
        />
      </InputSection>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={() => onSave(parsed)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Save scenario
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<RestartAlt />}
          onClick={() => {
            setDraft({ ...EMPTY_DRAFT });
            onReset();
          }}
          disabled={!hasAnything}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Reset scenario
        </Button>
      </Stack>
    </Box>
  );
}
