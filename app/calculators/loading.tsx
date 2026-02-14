import { Box, Container, Grid, Skeleton, Stack } from '@mui/material';
import { Header } from '@/components/mui/Header';

export default function CalculatorsLoading() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Box sx={{ bgcolor: '#F8FAFC', py: { xs: 4, md: 6 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="lg">
            <Skeleton variant="text" width="40%" height={48} />
            <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack spacing={1.5} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" width="70%" height={28} />
                  <Skeleton variant="text" width="90%" height={18} />
                  <Skeleton variant="text" width="80%" height={18} />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
