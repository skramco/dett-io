'use client';

import { ReactNode, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Slider,
  Stack,
  Divider,
  Chip,
} from '@mui/material';

// Shared input styling for strong visual prominence
const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5, // Sharper corners (6px)
    bgcolor: '#FFFFFF',
    transition: 'all 0.15s ease',
    '& fieldset': {
      borderWidth: 2,
      borderColor: '#D1D5DB', // Stronger default border
    },
    '&:hover fieldset': {
      borderColor: '#006397',
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': {
      borderWidth: 2,
      borderColor: '#006397',
      boxShadow: '0 0 0 3px rgba(0, 99, 151, 0.12)',
    },
  },
  '& .MuiInputBase-input': {
    fontWeight: 500,
    fontSize: '1rem',
    py: 1.5,
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#006397',
    },
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
    primary: { bg: '#EBF5FF', iconColor: '#006397', border: '#006397' },
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
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    const num = parseFloat(display);
    if (isNaN(num) || num !== value) {
      setDisplay(value === 0 && display === '' ? '' : String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    if (display === '' || isNaN(parseFloat(display))) {
      setDisplay('0');
      onChange(0);
    }
  };

  return (
    <TextField
      fullWidth
      label={label}
      type="number"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ min, max }}
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
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    const num = parseFloat(display);
    if (isNaN(num) || num !== value) {
      setDisplay(value === 0 && display === '' ? '' : String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    if (display === '' || isNaN(parseFloat(display))) {
      setDisplay('0');
      onChange(0);
    }
  };

  return (
    <TextField
      fullWidth
      label={label}
      type="number"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ step, min, max }}
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
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    const num = parseFloat(display);
    if (isNaN(num) || num !== value) {
      setDisplay(value === 0 && display === '' ? '' : String(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    if (display === '' || isNaN(parseFloat(display))) {
      setDisplay('0');
      onChange(0);
    }
  };

  return (
    <TextField
      fullWidth
      label={label}
      type="number"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ step, min, max }}
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
  return (
    <FormControl fullWidth>
      <InputLabel sx={{ fontWeight: 500, '&.Mui-focused': { color: '#006397' } }}>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
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
            borderColor: '#006397',
            borderWidth: 2,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: '#006397',
            boxShadow: '0 0 0 3px rgba(0, 99, 151, 0.12)',
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
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
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
        borderColor: checked ? '#006397' : '#D1D5DB',
        borderRadius: 1.5,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: '#006397',
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
              '&.Mui-checked': { color: '#006397' },
              '& .MuiSvgIcon-root': { fontSize: 24 },
            }}
          />
        }
        label={
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
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
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: '#FFFFFF',
        border: '2px solid #D1D5DB',
        borderRadius: 1.5,
        '&:hover': {
          borderColor: '#006397',
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
          {label}
        </Typography>
        <Chip 
          label={valueLabelFormat ? valueLabelFormat(value) : value} 
          size="small"
          sx={{ 
            fontWeight: 700,
            bgcolor: '#006397',
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
        sx={{
          color: '#006397',
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
            bgcolor: '#FFFFFF',
            border: '3px solid #006397',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0 0 0 8px rgba(0, 99, 151, 0.16)',
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
