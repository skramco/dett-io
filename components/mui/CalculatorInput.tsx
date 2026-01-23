'use client';

import { TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';

interface CalculatorInputProps {
  label: string;
  value: number | string | boolean;
  onChange: (value: string | boolean) => void;
  type?: 'number' | 'select' | 'checkbox';
  prefix?: string;
  suffix?: string;
  step?: string;
  options?: { value: string | number; label: string }[];
  helperText?: string;
  min?: number;
  max?: number;
}

export function CalculatorInput({
  label,
  value,
  onChange,
  type = 'number',
  prefix,
  suffix,
  step,
  options,
  helperText,
  min,
  max,
}: CalculatorInputProps) {
  if (type === 'checkbox') {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={value as boolean}
            onChange={(e) => onChange(e.target.checked)}
            sx={{
              color: 'primary.main',
              '&.Mui-checked': {
                color: 'primary.main',
              },
            }}
          />
        }
        label={
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
        }
      />
    );
  }

  if (type === 'select' && options) {
    return (
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={(e) => onChange(e.target.value as string)}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {helperText}
          </Typography>
        )}
      </FormControl>
    );
  }

  return (
    <TextField
      fullWidth
      label={label}
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputProps={{
        step: step || '1',
        min: min,
        max: max,
      }}
      InputProps={{
        startAdornment: prefix ? (
          <InputAdornment position="start">
            <Typography variant="body2" color="text.secondary">
              {prefix}
            </Typography>
          </InputAdornment>
        ) : undefined,
        endAdornment: suffix ? (
          <InputAdornment position="end">
            <Typography variant="body2" color="text.secondary">
              {suffix}
            </Typography>
          </InputAdornment>
        ) : undefined,
      }}
      helperText={helperText}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'divider',
          },
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused fieldset': {
            borderWidth: 2,
          },
        },
      }}
    />
  );
}
