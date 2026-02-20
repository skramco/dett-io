'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Chip,
  TextField,
  Button,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Code,
  ContentCopy,
  OpenInNew,
  Calculate,
  Palette,
  Preview,
  CheckCircle,
  ArrowBack,
  Close,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';

const ROLE_BENEFITS: Record<string, { title: string; tagline: string; benefits: string[]; topCalcs: string[] }> = {
  'Loan Officers': {
    title: 'Loan Officers',
    tagline: 'Turn your website into a lead-generating resource hub.',
    benefits: [
      'Clients run numbers before calling you — they arrive pre-educated and ready to move',
      'Position yourself as a transparent, tech-forward LO who gives before asking',
      'Embedded calculators keep visitors on your site longer, boosting SEO and engagement',
      'Email results feature lets clients send themselves data — with your site as the source',
      'Zero cost alternative to expensive lead-gen tools and calculator widgets',
    ],
    topCalcs: ['Affordability', 'Mortgage Cost', 'Refinance', 'FHA', 'VA'],
  },
  'Realtors': {
    title: 'Realtors',
    tagline: 'Help buyers understand their budget before the first showing.',
    benefits: [
      'Buyers who run affordability numbers first are more serious and better qualified',
      'Add calculators to listing pages so buyers can estimate payments on specific properties',
      'Stand out from other agents by offering real financial tools, not just listings',
      'Rent vs Buy calculator helps convert renters into buyers on your site',
      'Builds trust — you\'re helping them make informed decisions, not just selling',
    ],
    topCalcs: ['Affordability', 'Rent vs Buy', 'Down Payment', 'Closing Costs', 'Mortgage Cost'],
  },
  'Lenders': {
    title: 'Lenders',
    tagline: 'Educate borrowers at scale without building your own tools.',
    benefits: [
      'Offer 20 calculators on your site without any development cost or maintenance',
      'Borrowers who understand their numbers submit cleaner, more complete applications',
      'Reduce support calls — calculators answer the most common borrower questions',
      'FHA, VA, and conventional calculators help borrowers self-select the right product',
      'Embed on blog posts, landing pages, and resource centers for maximum engagement',
    ],
    topCalcs: ['FHA', 'VA', 'DTI', 'PMI', 'Refinance'],
  },
  'Financial Advisors': {
    title: 'Financial Advisors',
    tagline: 'Add mortgage clarity to your holistic financial planning.',
    benefits: [
      'Help clients see how mortgage decisions impact their overall financial picture',
      'Extra Payment and Acceleration calculators tie directly into wealth-building conversations',
      'Clients exploring home purchases get instant answers without leaving your site',
      'Positions you as a full-service advisor who covers housing, not just investments',
      'Great content for newsletters and client portals — educational and interactive',
    ],
    topCalcs: ['Extra Payment', 'Acceleration', 'ARM vs Fixed', 'Affordability', 'Interest Sensitivity'],
  },
  'Bloggers': {
    title: 'Bloggers & Content Creators',
    tagline: 'Make your mortgage content interactive and shareable.',
    benefits: [
      'Turn static blog posts into interactive experiences that keep readers engaged',
      'Readers who use a calculator spend 3-5x longer on your page — great for SEO',
      'Embed the relevant calculator right next to your article for instant context',
      'No coding required — just paste one line of HTML into your post',
      'Calculators are free forever — no affiliate strings or hidden costs',
    ],
    topCalcs: ['Mortgage Cost', 'Rent vs Buy', 'Affordability', 'Biweekly', 'Points Buydown'],
  },
};

const CALCULATORS = [
  { slug: 'mortgage-cost', name: 'True Monthly Mortgage Cost', category: 'Core' },
  { slug: 'affordability', name: 'How Much House Can I Afford?', category: 'Core' },
  { slug: 'down-payment', name: 'Down Payment Strategy', category: 'Core' },
  { slug: 'rent-vs-buy', name: 'Rent vs Buy Analysis', category: 'Core' },
  { slug: 'refinance', name: 'Refinance Break-Even', category: 'Core' },
  { slug: 'cash-out-refi', name: 'Cash-Out Refinance', category: 'Core' },
  { slug: 'recast-vs-refi', name: 'Recast vs Refinance', category: 'Core' },
  { slug: 'points-buydown', name: 'Points & Buydown', category: 'Core' },
  { slug: 'arm-vs-fixed', name: 'ARM vs Fixed Rate', category: 'Comparison' },
  { slug: 'timeline-simulator', name: 'Decision Timeline', category: 'Comparison' },
  { slug: 'extra-payment', name: 'Extra Payment Impact', category: 'Payoff' },
  { slug: 'acceleration', name: 'Payoff Acceleration', category: 'Payoff' },
  { slug: 'biweekly', name: 'Biweekly Payments', category: 'Payoff' },
  { slug: 'interest-sensitivity', name: 'Rate Sensitivity', category: 'Payoff' },
  { slug: 'amortization', name: 'Amortization Schedule', category: 'Payoff' },
  { slug: 'dti', name: 'DTI Calculator', category: 'Qualification' },
  { slug: 'closing-costs', name: 'Closing Cost Estimator', category: 'Qualification' },
  { slug: 'pmi', name: 'PMI Calculator', category: 'Qualification' },
  { slug: 'fha', name: 'FHA Loan Calculator', category: 'Qualification' },
  { slug: 'va', name: 'VA Loan Calculator', category: 'Qualification' },
];

export default function PartnersPage() {
  const [selectedSlug, setSelectedSlug] = useState('affordability');
  const [buttonLabel, setButtonLabel] = useState('Calculate');
  const [buttonColor, setButtonColor] = useState('#196bc0');
  const [textColor, setTextColor] = useState('#ffffff');
  const [embedTab, setEmbedTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [roleModal, setRoleModal] = useState<string | null>(null);

  const selectedCalc = CALCULATORS.find((c) => c.slug === selectedSlug)!;

  const scriptEmbed = useMemo(() => {
    const attrs = [`data-calculator="${selectedSlug}"`];
    if (buttonLabel !== 'Calculate') attrs.push(`data-label="${buttonLabel}"`);
    if (buttonColor !== '#196bc0') attrs.push(`data-color="${buttonColor}"`);
    if (textColor !== '#ffffff') attrs.push(`data-text-color="${textColor}"`);
    return `<script src="https://dett.io/embed.js" ${attrs.join(' ')}></script>`;
  }, [selectedSlug, buttonLabel, buttonColor, textColor]);

  const linkEmbed = useMemo(() => {
    return `<a href="#" class="dett-embed" data-calculator="${selectedSlug}">${buttonLabel}</a>\n<script src="https://dett.io/embed.js"></script>`;
  }, [selectedSlug, buttonLabel]);

  const iframeEmbed = useMemo(() => {
    return `<iframe src="https://dett.io/embed/${selectedSlug}" width="100%" height="700" frameborder="0" title="${selectedCalc.name} - Dett.io"></iframe>`;
  }, [selectedSlug, selectedCalc.name]);

  const currentCode = embedTab === 0 ? scriptEmbed : embedTab === 1 ? linkEmbed : iframeEmbed;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero */}
        <Box
          sx={{
            pt: { xs: 6, md: 10 },
            pb: { xs: 6, md: 10 },
            bgcolor: 'grey.900',
            color: 'white',
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Chip
              label="Free for Everyone"
              size="small"
              sx={{ mb: 3, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
            />
            <Typography variant="h2" component="h1" sx={{ fontSize: { xs: 32, md: 48 }, fontWeight: 700, mb: 2 }}>
              Embed Our Calculators
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 600, mx: 'auto', mb: 4 }}>
              Add any of our 20 mortgage calculators to your website for free. 
              No signup, no API key, no limits. Just copy and paste.
            </Typography>
            <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
              {Object.keys(ROLE_BENEFITS).map((role) => (
                <Chip
                  key={role}
                  label={role}
                  clickable
                  onClick={() => setRoleModal(role)}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    py: 2.5,
                    px: 0.5,
                    border: '1px solid',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.5)' },
                  }}
                />
              ))}
            </Stack>
            <Typography variant="caption" sx={{ color: 'grey.600', mt: 2, display: 'block' }}>
              Click any role to see how embedding helps
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={6}>
            {/* Step 1: Choose Calculator */}
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                  1
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Choose a Calculator</Typography>
              </Stack>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 1.5 }}>
                {CALCULATORS.map((calc) => (
                  <Paper
                    key={calc.slug}
                    elevation={0}
                    onClick={() => setSelectedSlug(calc.slug)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: selectedSlug === calc.slug ? 'primary.main' : 'divider',
                      bgcolor: selectedSlug === calc.slug ? 'primary.50' : 'white',
                      borderRadius: 2,
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      {selectedSlug === calc.slug ? (
                        <CheckCircle sx={{ fontSize: 18, color: 'primary.main' }} />
                      ) : (
                        <Calculate sx={{ fontSize: 18, color: 'text.disabled' }} />
                      )}
                      <Typography variant="body2" sx={{ fontWeight: selectedSlug === calc.slug ? 700 : 500, fontSize: '0.8rem' }}>
                        {calc.name}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Step 2: Customize */}
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                  2
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Customize Button</Typography>
              </Stack>

              <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                  <Stack spacing={3} sx={{ flex: 1 }}>
                    <TextField
                      label="Button Label"
                      value={buttonLabel}
                      onChange={(e) => setButtonLabel(e.target.value)}
                      size="small"
                      fullWidth
                    />
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                          Button Color
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <input
                            type="color"
                            value={buttonColor}
                            onChange={(e) => setButtonColor(e.target.value)}
                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer', borderRadius: 4 }}
                          />
                          <TextField
                            value={buttonColor}
                            onChange={(e) => setButtonColor(e.target.value)}
                            size="small"
                            sx={{ flex: 1 }}
                          />
                        </Stack>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                          Text Color
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            style={{ width: 40, height: 32, border: 'none', cursor: 'pointer', borderRadius: 4 }}
                          />
                          <TextField
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            size="small"
                            sx={{ flex: 1 }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Stack>

                  {/* Live Preview */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: 'grey.50', borderRadius: 2, minHeight: 120 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>Preview</Typography>
                    <button
                      style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        padding: '12px 24px',
                        background: buttonColor,
                        color: textColor,
                        border: 'none',
                        borderRadius: 8,
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                      onClick={() => setPreviewOpen(true)}
                    >
                      <span>{buttonLabel}</span>
                      <span style={{
                        fontSize: 9,
                        fontWeight: 400,
                        letterSpacing: 0.3,
                        color: (() => {
                          const hex = buttonColor.replace('#', '');
                          const r = parseInt(hex.substr(0, 2), 16) / 255;
                          const g = parseInt(hex.substr(2, 2), 16) / 255;
                          const b = parseInt(hex.substr(4, 2), 16) / 255;
                          const lr = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
                          const lg = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
                          const lb = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
                          const luminance = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
                          return luminance > 0.4 ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)';
                        })(),
                      }}>powered by dett.io</span>
                    </button>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 1.5 }}>
                      Click to preview modal
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>

            {/* Step 3: Copy Code */}
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                  3
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Copy Embed Code</Typography>
              </Stack>

              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                <Tabs
                  value={embedTab}
                  onChange={(_, v) => setEmbedTab(v)}
                  sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}
                >
                  <Tab label="Auto Button" icon={<Code sx={{ fontSize: 18 }} />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab label="Custom Link" icon={<OpenInNew sx={{ fontSize: 18 }} />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab label="Inline iFrame" icon={<Preview sx={{ fontSize: 18 }} />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>

                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {embedTab === 0 && 'Paste this single line anywhere on your page. It creates a styled button that opens the calculator in a modal.'}
                    {embedTab === 1 && 'Use your own link or button. Add the class and data attribute, then include the script.'}
                    {embedTab === 2 && 'Embed the calculator directly in your page content. No modal — it renders inline.'}
                  </Typography>

                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: 'grey.900',
                      borderRadius: 2,
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      color: '#A5F3FC',
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      lineHeight: 1.7,
                    }}
                  >
                    {currentCode}
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<ContentCopy />}
                    onClick={handleCopy}
                    sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Copy to Clipboard
                  </Button>
                </Box>
              </Paper>
            </Box>

            {/* How It Works */}
            <Divider />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
                How It Works
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                {[
                  { step: '1', title: 'Paste the code', desc: 'Add the embed code to any page on your website — blog posts, landing pages, resource pages.' },
                  { step: '2', title: 'User clicks the button', desc: 'A modal opens with the full calculator. No page redirect, no popups — it loads right on your site.' },
                  { step: '3', title: 'They get results', desc: 'Your visitors get accurate mortgage calculations. Subtle Dett.io branding links back to more tools.' },
                ].map((item) => (
                  <Paper key={item.step} elevation={0} sx={{ p: 4, flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.50', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, mx: 'auto', mb: 2 }}>
                      {item.step}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>

            {/* FAQ */}
            <Box sx={{ maxWidth: 700, mx: 'auto', width: '100%' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
                FAQ
              </Typography>
              <Stack spacing={3}>
                {[
                  { q: 'Is this really free?', a: 'Yes. No signup, no API key, no usage limits. The only requirement is keeping the subtle "Powered by Dett.io" branding visible.' },
                  { q: 'Will it slow down my site?', a: 'No. The embed script is under 5KB and loads asynchronously. The calculator only loads when a user clicks the button.' },
                  { q: 'Can I customize the look?', a: 'You can customize the button color, text, and label. The calculator itself maintains a consistent design for accuracy and trust.' },
                  { q: 'Does it work on mobile?', a: 'Yes. The modal is fully responsive and works on all screen sizes.' },
                  { q: 'Can I remove the Dett.io branding?', a: 'The branding is part of the free offering. Contact us if you need a white-label solution for your organization.' },
                ].map((item) => (
                  <Paper key={item.q} elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{item.q}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.a}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Role Benefits Modal */}
      {roleModal && ROLE_BENEFITS[roleModal] && (
        <Box
          onClick={() => setRoleModal(null)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Paper
            onClick={(e) => e.stopPropagation()}
            elevation={0}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 560,
              maxHeight: '85vh',
              overflowY: 'auto',
              borderRadius: 3,
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <IconButton
              onClick={() => setRoleModal(null)}
              sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
              size="small"
            >
              <Close fontSize="small" />
            </IconButton>

            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Chip label="Free for You" size="small" sx={{ mb: 2, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: 24, md: 28 } }}>
                For {ROLE_BENEFITS[roleModal].title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {ROLE_BENEFITS[roleModal].tagline}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                Why Embed on Your Site
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                {ROLE_BENEFITS[roleModal].benefits.map((benefit, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                    <CheckCircle sx={{ color: 'primary.main', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{benefit}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                Top Calculators for {ROLE_BENEFITS[roleModal].title}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                {ROLE_BENEFITS[roleModal].topCalcs.map((calc) => (
                  <Chip key={calc} label={calc} size="small" sx={{ fontWeight: 600, bgcolor: 'grey.100' }} />
                ))}
              </Stack>

              <Button
                variant="contained"
                fullWidth
                onClick={() => setRoleModal(null)}
                sx={{ textTransform: 'none', fontWeight: 600, py: 1.5 }}
              >
                Get Started — It&apos;s Free
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <Box
          onClick={() => setPreviewOpen(false)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'relative',
              width: '92%',
              maxWidth: 1200,
              height: '82vh',
              bgcolor: 'white',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <Button
              onClick={() => setPreviewOpen(false)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 10,
                minWidth: 36,
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: 'rgba(0,0,0,0.08)',
                color: 'text.primary',
                fontSize: 20,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.15)' },
              }}
            >
              &times;
            </Button>
            <iframe
              src={`/embed/${selectedSlug}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Calculator Preview"
            />
          </Box>
        </Box>
      )}

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setCopied(false)}>
          Embed code copied to clipboard!
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}
