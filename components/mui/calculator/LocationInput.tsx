'use client';

import { Grid, Typography } from '@mui/material';
import { SelectInput, ZipInput } from './InputPanel';
import { STATE_OPTIONS } from '@/lib/calculators/closingCosts';
import {
  isCompleteZip,
  locationHelperText,
  resolveLocationDefaults,
  zipToState,
  type LocationValue,
} from '@/lib/locations';

const STATE_SELECT_OPTIONS = [
  { value: '', label: 'U.S. average' },
  ...STATE_OPTIONS,
];

interface LocationInputProps {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
  /** Home price used to format the helper amounts. */
  homePrice?: number;
  helperText?: string;
}

export function LocationInput({
  value,
  onChange,
  homePrice = 450000,
  helperText,
}: LocationInputProps) {
  const zipComplete = isCompleteZip(value.zip);
  const zipState = zipComplete ? zipToState(value.zip) : null;
  const zipUnknown = zipComplete && !zipState;

  const resolved = resolveLocationDefaults(value, homePrice);
  const caption = helperText ?? locationHelperText(resolved);

  const handleState = (state: string) => {
    const nextZip = zipState && zipState !== state ? '' : value.zip;
    onChange({ state, zip: nextZip });
  };

  const handleZip = (zip: string) => {
    const mapped = isCompleteZip(zip) ? zipToState(zip) : null;
    onChange({
      state: mapped ?? (isCompleteZip(zip) ? value.state : value.state),
      zip,
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 7 }}>
          <SelectInput
            label="State"
            value={value.state}
            onChange={(v) => handleState(v as string)}
            options={STATE_SELECT_OPTIONS}
            helperText="Sets tax, insurance, and closing customs"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 5 }}>
          <ZipInput
            value={value.zip}
            onChange={handleZip}
            error={zipUnknown}
            helperText={
              zipUnknown
                ? "We couldn't match that ZIP"
                : zipState
                  ? `Matched to ${resolved.stateName}`
                  : 'Optional — refines the state estimate'
            }
          />
        </Grid>
      </Grid>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -1 }}>
        {caption}
      </Typography>
    </>
  );
}
