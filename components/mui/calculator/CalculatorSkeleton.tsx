import { Box, Container, Grid, Paper, Skeleton, Stack } from '@mui/material';
import { Header } from '@/components/mui/Header';

export default function CalculatorSkeleton() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero skeleton */}
        <Box sx={{ bgcolor: '#F8FAFC', py: { xs: 4, md: 6 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="lg">
            <Skeleton variant="rounded" width={120} height={28} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" height={48} />
            <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} />
          </Container>
        </Box>

        {/* Calculator body skeleton */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={4}>
            {/* Input panel skeleton */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
                <Stack spacing={3}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={i}>
                      <Skeleton variant="text" width="30%" height={20} sx={{ mb: 0.5 }} />
                      <Skeleton variant="rounded" height={56} />
                    </Box>
                  ))}
                </Stack>
              </Paper>
              <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
                <Stack spacing={3}>
                  {[1, 2, 3].map((i) => (
                    <Box key={i}>
                      <Skeleton variant="text" width="35%" height={20} sx={{ mb: 0.5 }} />
                      <Skeleton variant="rounded" height={56} />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* Results panel skeleton */}
            <Grid size={{ xs: 12, lg: 7 }}>
              {/* Hero metric */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center', mb: 3 }}>
                <Skeleton variant="text" width="30%" height={20} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="50%" height={56} sx={{ mx: 'auto' }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto', mt: 1 }} />
              </Paper>

              {/* Metric cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid key={i} size={{ xs: 6, md: 3 }}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Skeleton variant="text" width="60%" height={16} />
                      <Skeleton variant="text" width="80%" height={32} />
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Chart skeleton */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Skeleton variant="text" width="40%" height={28} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={280} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
