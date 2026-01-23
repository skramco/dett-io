'use client';

import { ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  LinearProgress,
  Stack,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle,
  Warning,
  Lightbulb,
} from '@mui/icons-material';

// ============================================
// HERO METRIC - The big number that matters most
// ============================================
interface HeroMetricProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
}

export function HeroMetric({ label, value, sublabel, trend, trendLabel }: HeroMetricProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        background: 'linear-gradient(135deg, #006397 0%, #004B73 100%)',
        color: 'white',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.1)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -20,
          right: 40,
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.05)',
        }}
      />
      
      <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography 
        variant="h2" 
        sx={{ 
          fontWeight: 700, 
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          lineHeight: 1.1,
          mb: 1,
        }}
      >
        {value}
      </Typography>
      {sublabel && (
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {sublabel}
        </Typography>
      )}
      {trend && trendLabel && (
        <Chip
          icon={trend === 'up' ? <TrendingUp /> : trend === 'down' ? <TrendingDown /> : undefined}
          label={trendLabel}
          size="small"
          sx={{
            mt: 2,
            bgcolor: trend === 'up' ? 'rgba(16, 185, 129, 0.2)' : trend === 'down' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            '& .MuiChip-icon': { color: 'white' },
          }}
        />
      )}
    </Paper>
  );
}

// ============================================
// METRIC CARD - Secondary important numbers
// ============================================
interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export function MetricCard({ label, value, sublabel, icon, color = 'primary' }: MetricCardProps) {
  const colorMap = {
    primary: { bg: '#EBF5FF', border: '#006397', text: '#004B73' },
    secondary: { bg: '#F0FDF4', border: '#10B981', text: '#059669' },
    success: { bg: '#F0FDF4', border: '#22C55E', text: '#16A34A' },
    warning: { bg: '#FFFBEB', border: '#F59E0B', text: '#D97706' },
    error: { bg: '#FEF2F2', border: '#EF4444', text: '#DC2626' },
  };
  const colors = colorMap[color];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '4px solid',
        borderLeftColor: colors.border,
        bgcolor: colors.bg,
        height: '100%',
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        {icon && (
          <Avatar sx={{ bgcolor: colors.border, width: 40, height: 40 }}>
            {icon}
          </Avatar>
        )}
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
            {value}
          </Typography>
          {sublabel && (
            <Typography variant="caption" color="text.secondary">
              {sublabel}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

// ============================================
// BREAKDOWN ROW - Line items with visual bars
// ============================================
interface BreakdownRowProps {
  label: string;
  value: string;
  percentage?: number;
  color?: string;
}

export function BreakdownRow({ label, value, percentage, color = '#006397' }: BreakdownRowProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Stack>
      {percentage !== undefined && (
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              bgcolor: color,
              borderRadius: 4,
            },
          }}
        />
      )}
    </Box>
  );
}

// ============================================
// INSIGHT CALLOUT - Important takeaways
// ============================================
interface InsightCalloutProps {
  type: 'info' | 'success' | 'warning' | 'tip';
  title?: string;
  children: ReactNode;
}

export function InsightCallout({ type, title, children }: InsightCalloutProps) {
  const config = {
    info: { icon: <Info />, bg: '#EBF5FF', border: '#006397', color: '#004B73' },
    success: { icon: <CheckCircle />, bg: '#F0FDF4', border: '#22C55E', color: '#16A34A' },
    warning: { icon: <Warning />, bg: '#FFFBEB', border: '#F59E0B', color: '#D97706' },
    tip: { icon: <Lightbulb />, bg: '#FDF4FF', border: '#A855F7', color: '#7C3AED' },
  };
  const c = config[type];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: c.bg,
        border: '1px solid',
        borderColor: c.border,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar sx={{ bgcolor: c.border, width: 36, height: 36 }}>
          {c.icon}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: c.color, mb: 0.5 }}>
              {title}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: c.color }}>
            {children}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

// ============================================
// COMPARISON CARD - Side by side comparison
// ============================================
interface ComparisonItem {
  label: string;
  value: string;
  sublabel?: string;
}

interface ComparisonCardProps {
  title: string;
  left: ComparisonItem;
  right: ComparisonItem;
  winner?: 'left' | 'right' | 'tie';
}

export function ComparisonCard({ title, left, right, winner }: ComparisonCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Box
          sx={{
            flex: 1,
            p: 3,
            textAlign: 'center',
            bgcolor: winner === 'left' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
          }}
        >
          {winner === 'left' && (
            <Chip label="Better" size="small" color="success" sx={{ mb: 1 }} />
          )}
          <Typography variant="caption" color="text.secondary" display="block">
            {left.label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5 }}>
            {left.value}
          </Typography>
          {left.sublabel && (
            <Typography variant="caption" color="text.secondary">
              {left.sublabel}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 3,
            textAlign: 'center',
            bgcolor: winner === 'right' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
          }}
        >
          {winner === 'right' && (
            <Chip label="Better" size="small" color="success" sx={{ mb: 1 }} />
          )}
          <Typography variant="caption" color="text.secondary" display="block">
            {right.label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, my: 0.5 }}>
            {right.value}
          </Typography>
          {right.sublabel && (
            <Typography variant="caption" color="text.secondary">
              {right.sublabel}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

// ============================================
// RESULTS SECTION - Container with title
// ============================================
interface ResultsSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function ResultsSection({ title, subtitle, children }: ResultsSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  );
}

// ============================================
// EMPTY STATE - Before calculation
// ============================================
export function EmptyResultsState() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        borderRadius: 4,
        border: '2px dashed',
        borderColor: 'divider',
        textAlign: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'primary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />
      </Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Your Results Will Appear Here
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto' }}>
        Adjust the inputs on the left and watch your personalized analysis update in real time.
      </Typography>
    </Paper>
  );
}
