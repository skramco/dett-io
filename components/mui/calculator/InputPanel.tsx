'use client';

import { ReactNode, useId, useLayoutEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Slider,
  Stack,
  Chip,
} from '@mui/material';
import {
  formatCurrencyInput,
  formatCurrencyInputValue,
  mapFormattedCaret,
  parseCurrencyInput,
} from '@/lib/format';

const LABEL_SX = {
  display: 'block',
  fontSize: '0.875rem', // 14px minimum
  fontWeight: 600,
  color: '#1F2937', // ~16:1 on white
  mb: 0.75,
  letterSpacing: '0.01em',
} as const;

// Shared input styling for strong visual prominence
const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5, // Sharper corners (6px)
    bgcolor: '#FFFFFF',
    transition: 'all 0.15s ease',
    scrollMarginTop: 'calc(72px + env(safe-area-inset-top, 0px))',
    scrollMarginBottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
    '& fieldset': {
      borderWidth: 2,
      borderColor: '#D1D5DB', // Stronger default border
    },
    '&:hover fieldset': {
      borderColor: '#196bc0',
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': {
      borderWidth: 2,
      borderColor: '#196bc0',
      boxShadow: '0 0 0 3px rgba(25, 107, 192, 0.12)',
    },
  },
  '& .MuiInputBase-input': {
    fontWeight: 500,
    fontSize: '1rem',
    py: 1.75,
    minHeight: '1.5em',
  },
};

// ============================================
// INPUT SECTION - Group of related inputs
// ============================================
interface InputSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  color?: 'primary' | 'secondary';
}

export function InputSection({ title, icon, children, color = 'primary' }: InputSectionProps) {
  const colorMap = {
    primary: { bg: '#EBF5FF', iconColor: '#196bc0', border: '#196bc0' },
    secondary: { bg: '#D1FAE5', iconColor: '#059669', border: '#10B981' },
  };
  const colors = colorMap[color];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2, // Sharper section corners
        border: '2px solid',
        borderColor: '#E5E7EB',
        mb: 3,
        bgcolor: '#FAFAFA',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, pb: 2, borderBottom: '1px solid #E5E7EB' }}>
        {icon && (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              bgcolor: colors.bg,
              border: '2px solid',
              borderColor: colors.border,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.iconColor,
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937' }}>
          {title}
        </Typography>
      </Stack>
      <Stack spacing={3}>
        {children}
      </Stack>
    </Paper>
  );
}

// ============================================
// CURRENCY INPUT - Dollar amount input
// ============================================
interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  min?: number;
  max?: number;
}

export function CurrencyInput({ label, value, onChange, helperText, min, max }: CurrencyInputProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? formatCurrencyInputValue(value);

  useLayoutEffect(() => {
    if (caretRef.current === null || !inputRef.current) return;
    inputRef.current.setSelectionRange(caretRef.current, caretRef.current);
    caretRef.current = null;
  }, [display]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    const formatted = formatCurrencyInput(raw);
    caretRef.current = mapFormattedCaret(raw, formatted, caret);
    setDraft(formatted);

    const num = parseCurrencyInput(formatted);
    if (num === null) return;
    let next = num;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    onChange(next);
  };

  const handleBlur = () => {
    const num = parseCurrencyInput(display);
    if (num === null) {
      onChange(0);
    } else {
      let next = num;
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);
      if (next !== num) onChange(next);
    }
    setDraft(null);
  };

  return (
    <Box>
      <Typography component="label" htmlFor={id} sx={LABEL_SX}>
        {label}
      </Typography>
      <TextField
        id={id}
        fullWidth
        hiddenLabel
        type="text"
        value={display}
        onChange={handleChange}
        onFocus={() => {
          setDraft((current) => current ?? formatCurrencyInputValue(value));
        }}
        onBlur={handleBlur}
        inputRef={inputRef}
        inputProps={{
          inputMode: 'decimal',
          autoComplete: 'off',
          spellCheck: false,
          min,
          max,
          'aria-label': label,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Typography sx={{ fontWeight: 600, color: '#374151' }}>$</Typography>
            </InputAdornment>
          ),
        }}
        helperText={helperText}
        sx={inputStyles}
      />
    </Box>
  );
}

// ============================================
// PERCENTAGE INPUT - Rate/percentage input
// ============================================
interface PercentageInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  step?: number;
  min?: number;
  max?: number;
}

export function PercentageInput({ label, value, onChange, helperText, step = 0.125, min = 0, max = 100 }: PercentageInputProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? String(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDraft(raw);
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    if (display === '' || isNaN(parseFloat(display))) {
      onChange(0);
    }
    setDraft(null);
  };

  return (
    <Box>
      <Typography component="label" htmlFor={id} sx={LABEL_SX}>
        {label}
      </Typography>
      <TextField
        id={id}
        fullWidth
        hiddenLabel
        type="text"
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        inputProps={{ step, min, max, inputMode: 'decimal', autoComplete: 'off', 'aria-label': label }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography sx={{ fontWeight: 600, color: '#374151' }}>%</Typography>
            </InputAdornment>
          ),
        }}
        helperText={helperText}
        sx={inputStyles}
      />
    </Box>
  );
}

// ============================================
// NUMBER INPUT - Generic number input
// ============================================
interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}

export function NumberInput({ label, value, onChange, helperText, suffix, step = 1, min, max }: NumberInputProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? String(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDraft(raw);
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    if (display === '' || isNaN(parseFloat(display))) {
      onChange(0);
    }
    setDraft(null);
  };

  return (
    <Box>
      <Typography component="label" htmlFor={id} sx={LABEL_SX}>
        {label}
      </Typography>
      <TextField
        id={id}
        fullWidth
        hiddenLabel
        type="text"
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        inputProps={{ step, min, max, inputMode: 'decimal', autoComplete: 'off', 'aria-label': label }}
        InputProps={{
          endAdornment: suffix ? (
            <InputAdornment position="end">
              <Typography sx={{ fontWeight: 600, color: '#374151' }}>{suffix}</Typography>
            </InputAdornment>
          ) : undefined,
        }}
        helperText={helperText}
        sx={inputStyles}
      />
    </Box>
  );
}

// ============================================
// ZIP INPUT - 5-digit US ZIP code
// ============================================
interface ZipInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  error?: boolean;
}

export function ZipInput({ label = 'ZIP', value, onChange, helperText, error }: ZipInputProps) {
  const id = useId();
  return (
    <Box>
      <Typography component="label" htmlFor={id} sx={LABEL_SX}>
        {label}
      </Typography>
      <TextField
        id={id}
        fullWidth
        hiddenLabel
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
          maxLength: 5,
          autoComplete: 'postal-code',
          'aria-label': label,
        }}
        helperText={helperText}
        error={error}
        sx={inputStyles}
      />
    </Box>
  );
}

// ============================================
// SELECT INPUT - Dropdown selection
// ============================================
interface SelectInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{ value: string | number; label: string }>;
  helperText?: string;
}

export function SelectInput({ label, value, onChange, options, helperText }: SelectInputProps) {
  const id = useId();
  const labelId = useId();
  const helperId = useId();
  return (
    <FormControl fullWidth>
      <Typography component="label" htmlFor={id} id={labelId} sx={LABEL_SX}>
        {label}
      </Typography>
      <Select
        id={id}
        labelId={labelId}
        value={value}
        displayEmpty
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        aria-describedby={helperText ? helperId : undefined}
        sx={{
          borderRadius: 1.5,
          bgcolor: '#FFFFFF',
          '& .MuiSelect-select': {
            fontWeight: 500,
            py: 1.5,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: '#D1D5DB',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#196bc0',
            borderWidth: 2,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: '#196bc0',
            boxShadow: '0 0 0 3px rgba(25, 107, 192, 0.12)',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value} sx={{ fontWeight: 500 }}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography id={helperId} variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
}

// ============================================
// DATE INPUT - ISO calendar date (YYYY-MM-DD)
// ============================================
interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  min?: string;
  max?: string;
}

export function DateInput({ label, value, onChange, helperText, min, max }: DateInputProps) {
  const id = useId();
  return (
    <Box>
      <Typography component="label" htmlFor={id} sx={LABEL_SX}>
        {label}
      </Typography>
      <TextField
        id={id}
        fullWidth
        hiddenLabel
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        helperText={helperText}
        inputProps={{ min, max, 'aria-label': label }}
        sx={inputStyles}
      />
    </Box>
  );
}

// ============================================
// CHECKBOX INPUT - Toggle option
// ============================================
interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helperText?: string;
}

export function CheckboxInput({ label, checked, onChange, helperText }: CheckboxInputProps) {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: checked ? '#EBF5FF' : '#FFFFFF',
        border: '2px solid',
        borderColor: checked ? '#196bc0' : '#D1D5DB',
        borderRadius: 1.5,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: '#196bc0',
        },
      }}
      onClick={() => onChange(!checked)}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            sx={{
              color: '#6B7280',
              '&.Mui-checked': { color: '#196bc0' },
              '& .MuiSvgIcon-root': { fontSize: 24 },
            }}
          />
        }
        label={
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1F2937', fontSize: '0.875rem' }}>
            {label}
          </Typography>
        }
        sx={{ m: 0 }}
      />
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4, mt: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

// ============================================
// SLIDER INPUT - Range slider with labels
// ============================================
interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  marks?: boolean | Array<{ value: number; label: string }>;
  valueLabelFormat?: (value: number) => string;
}

export function SliderInput({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  marks = false,
  valueLabelFormat 
}: SliderInputProps) {
  const labelId = useId();
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: '#FFFFFF',
        border: '2px solid #D1D5DB',
        borderRadius: 1.5,
        scrollMarginTop: 'calc(72px + env(safe-area-inset-top, 0px))',
        scrollMarginBottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
        '&:hover': {
          borderColor: '#196bc0',
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography id={labelId} sx={{ ...LABEL_SX, mb: 0 }}>
          {label}
        </Typography>
        <Chip 
          label={valueLabelFormat ? valueLabelFormat(value) : value} 
          size="small"
          sx={{ 
            fontWeight: 700,
            bgcolor: '#196bc0',
            color: '#FFFFFF',
            borderRadius: 1,
          }}
        />
      </Stack>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={min}
        max={max}
        step={step}
        marks={marks}
        valueLabelDisplay="auto"
        valueLabelFormat={valueLabelFormat}
        aria-labelledby={labelId}
        getAriaValueText={valueLabelFormat ? (v) => valueLabelFormat(v) : undefined}
        sx={{
          color: '#196bc0',
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
            bgcolor: '#FFFFFF',
            border: '3px solid #196bc0',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0 0 0 8px rgba(25, 107, 192, 0.16)',
            },
          },
          '& .MuiSlider-track': {
            height: 8,
            borderRadius: 1,
          },
          '& .MuiSlider-rail': {
            height: 8,
            borderRadius: 1,
            bgcolor: '#E5E7EB',
          },
        }}
      />
    </Box>
  );
}

// ============================================
// INPUT HINT - Contextual help text
// ============================================
interface InputHintProps {
  children: ReactNode;
  type?: 'info' | 'warning';
}

export function InputHint({ children, type = 'info' }: InputHintProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: type === 'warning' ? 'warning.light' : 'grey.100',
        border: '1px solid',
        borderColor: type === 'warning' ? 'warning.main' : 'grey.300',
      }}
    >
      <Typography variant="caption" sx={{ color: type === 'warning' ? 'warning.dark' : 'text.secondary' }}>
        {children}
      </Typography>
    </Box>
  );
}
