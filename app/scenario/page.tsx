'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Container,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import { ScenarioForm } from '@/components/mui/scenario/ScenarioForm';
import { trackEvent } from '@/lib/analytics';
import { useScenario } from '@/lib/scenario';

export default function ScenarioPage() {
  const { profile, saveProfile, clearProfile } = useScenario();
  const [toast, setToast] = useState<string | null>(null);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        <Box
          sx={{
            pt: { xs: 6, md: 8 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 36, md: 48 } }}>
              My scenario
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 640 }}>
              Enter income, debts, price, and rate once. Every calculator pre-fills so you never
              re-type the same numbers.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={3}>
            <Alert severity="success" variant="outlined">
              This is the same profile the calculators read. Edit here, then open any calculator.
            </Alert>
            <ScenarioForm
              profile={profile}
              onSave={(next) => {
                saveProfile(next);
                trackEvent('cta_click', { cta_label: 'scenario_saved' });
                setToast('My scenario saved on this device.');
              }}
              onReset={() => {
                clearProfile();
                trackEvent('cta_click', { cta_label: 'scenario_reset' });
                setToast('My scenario cleared.');
              }}
            />
          </Stack>
        </Container>
      </Box>

      <Footer />
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
