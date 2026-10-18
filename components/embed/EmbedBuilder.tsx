'use client';

import { useEffect, useMemo, useState } from 'react';
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
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ContentCopy,
  CheckCircle,
  ExpandMore,
  HomeWork,
  AccountBalance,
  Groups,
  Article,
  Palette,
  Preview,
  Code,
  HelpOutline,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import { EMBED_AUDIENCES, EMBED_CALCULATORS, getEmbedCalculator } from '@/lib/embed/catalog';
import {
  DEFAULT_EMBED_APPEARANCE,
  buildEmbedSrc,
  iframeSnippet,
  loaderSnippet,
  type EmbedAppearance,
  type EmbedFont,
} from '@/lib/embed/options';
import { FAQJsonLd } from '@/components/JsonLd';

const AUDIENCE_ICONS = {
  realtors: HomeWork,
  brokers: Groups,
  lenders: AccountBalance,
  bloggers: Article,
} as const;

const FAQ_ITEMS = [
  {
    q: 'Is this really free?',
    a: 'Yes — embed them, free, forever. No signup, no API key, no usage limits, no watermark beyond the small “Powered by Dett.io” link. Dett.io is owned by Knowe LLC. We are not a lender and we do not take leads.',
  },
  {
    q: 'Do I have to credit Dett.io?',
    a: 'Yes. The free embed includes a small do-follow “Powered by Dett.io” link back to the matching calculator page. That credit is the entire price. Please leave it in place.',
  },
  {
    q: 'Do you track my visitors or their numbers?',
    a: 'No. Calculator inputs stay in the visitor’s browser. We do not collect names, emails, or the numbers they type. We only record that an embed loaded, counted by referring domain, so we can see which sites use the widgets.',
  },
  {
    q: 'Will it slow down my site?',
    a: 'The optional loader script is a few kilobytes and loads asynchronously. The calculator itself runs inside an iframe, so it cannot block your page. Auto-height uses postMessage — no polling of your DOM.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. Widgets are responsive, and the auto-resize loader grows the iframe to fit on phones and desktops.',
  },
  {
    q: 'Who do I contact for support?',
    a: 'Email hello@dett.io. For privacy questions, privacy@dett.io. We usually reply within a few business days.',
  },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <Box sx={{ flex: 1, minWidth: 140 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          style={{ width: 40, height: 32, border: 'none', cursor: 'pointer', background: 'none' }}
        />
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
        />
      </Stack>
    </Box>
  );
}

export function EmbedBuilder({ initialSlug }: { initialSlug?: string }) {
  const startingSlug =
    initialSlug && EMBED_CALCULATORS.some((c) => c.slug === initialSlug)
      ? initialSlug
      : 'affordability';
  const [selectedSlug, setSelectedSlug] = useState(startingSlug);
  const [appearance, setAppearance] = useState<EmbedAppearance>(DEFAULT_EMBED_APPEARANCE);
  const [inputOverrides, setInputOverrides] = useState<Record<string, Record<string, number>>>({});
  const [snippetTab, setSnippetTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(`/embed/${startingSlug}`);
  const [previewHeight, setPreviewHeight] = useState(640);
  const [guideExpanded, setGuideExpanded] = useState<string | false>('html');

  const selectedCalc = getEmbedCalculator(selectedSlug) ?? EMBED_CALCULATORS[1];
  const inputs = useMemo(() => {
    const defaults: Record<string, number> = {};
    selectedCalc.inputs.forEach((input) => {
      defaults[input.key] = input.defaultValue;
    });
    return { ...defaults, ...inputOverrides[selectedSlug] };
  }, [selectedCalc, selectedSlug, inputOverrides]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setPreviewSrc(buildEmbedSrc(selectedSlug, appearance, inputs, ''));
    }, 250);
    return () => window.clearTimeout(handle);
  }, [selectedSlug, appearance, inputs]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!e.data || e.data.source !== 'dett-embed' || e.data.type !== 'resize') return;
      const h = Number(e.data.height);
      if (h > 0) setPreviewHeight(h);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const productionSrc = useMemo(
    () => buildEmbedSrc(selectedSlug, appearance, inputs),
    [selectedSlug, appearance, inputs]
  );

  const snippets = useMemo(() => {
    const auto = loaderSnippet(productionSrc, selectedCalc.name, appearance);
    const iframe = iframeSnippet(productionSrc, selectedCalc.name, { ...appearance, height: appearance.height === 'auto' ? 700 : appearance.height });
    const button = `<script src="https://dett.io/embed.js" data-calculator="${selectedSlug}" data-label="Calculate" async></script>`;
    return [auto, iframe, button];
  }, [productionSrc, selectedCalc.name, appearance, selectedSlug]);

  const currentSnippet = snippets[snippetTab];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
  };

  const patchAppearance = (partial: Partial<EmbedAppearance>) => {
    setAppearance((prev) => ({ ...prev, ...partial }));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FAQJsonLd questions={FAQ_ITEMS.map((item) => ({ question: item.q, answer: item.a }))} />
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
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
              label="Embed them, free, forever"
              size="small"
              sx={{ mb: 3, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
            />
            <Typography variant="h2" component="h1" sx={{ fontSize: { xs: 32, md: 48 }, fontWeight: 700, mb: 2 }}>
              Free embeddable mortgage calculators
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 640, mx: 'auto', mb: 3 }}>
              Built for mortgage brokers, realtors, lenders, banks, credit unions, and financial bloggers.
              Drop a calculator on your site in a minute.
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
              {['Free', 'No signup', 'No API key', 'Mobile-responsive', 'Always up to date'].map((item) => (
                <Chip
                  key={item}
                  label={item}
                  sx={{
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.25)',
                    bgcolor: 'rgba(255,255,255,0.08)',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>
            <Typography variant="body2" sx={{ color: 'grey.500', mt: 3 }}>
              Dett.io is owned by Knowe LLC. Same math as the main site. No lead forms.
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={8}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                Made for the people who talk to borrowers every day
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4, maxWidth: 640, mx: 'auto' }}>
                Keep clients on your site. Look like the expert who shows the numbers. Embed them, free, forever.
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 2.5,
                }}
              >
                {EMBED_AUDIENCES.map((audience) => {
                  const Icon = AUDIENCE_ICONS[audience.id as keyof typeof AUDIENCE_ICONS] ?? AccountBalance;
                  return (
                    <Paper
                      key={audience.id}
                      elevation={0}
                      sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: 'primary.50',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon />
                        </Box>
                        <Box>
                          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 0.8, lineHeight: 1 }}>
                            {audience.eyebrow}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {audience.title}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {audience.tagline}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {audience.body}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                        Suggested calculators
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {audience.suggestedSlugs.map((slug) => {
                          const calc = getEmbedCalculator(slug);
                          if (!calc) return null;
                          return (
                            <Chip
                              key={slug}
                              label={calc.shortName}
                              size="small"
                              clickable
                              onClick={() => {
                                setSelectedSlug(slug);
                                document.getElementById('embed-builder')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              sx={{ fontWeight: 600 }}
                            />
                          );
                        })}
                      </Stack>
                    </Paper>
                  );
                })}
              </Box>
            </Box>

            <Box id="embed-builder">
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                  1
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Choose a calculator</Typography>
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 1.5 }}>
                {EMBED_CALCULATORS.map((calc) => (
                  <Paper
                    key={calc.slug}
                    elevation={0}
                    onClick={() => setSelectedSlug(calc.slug)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: selectedSlug === calc.slug ? 'primary.main' : 'divider',
                      bgcolor: selectedSlug === calc.slug ? 'primary.50' : 'background.paper',
                      borderRadius: 2,
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      {selectedSlug === calc.slug ? (
                        <CheckCircle sx={{ fontSize: 18, color: 'primary.main', mt: 0.2 }} />
                      ) : (
                        <Box sx={{ width: 18, height: 18, mt: 0.2, borderRadius: '50%', border: '2px solid', borderColor: 'divider' }} />
                      )}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: selectedSlug === calc.slug ? 700 : 600, fontSize: '0.8rem' }}>
                          {calc.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {calc.category}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Box>

            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                  2
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Customize</Typography>
              </Stack>

              <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Palette sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Look and feel</Typography>
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <ColorField label="Primary color" value={appearance.primary} onChange={(primary) => patchAppearance({ primary })} />
                    <ColorField label="Accent color" value={appearance.accent} onChange={(accent) => patchAppearance({ accent })} />
                    <ColorField label="Background" value={appearance.bg} onChange={(bg) => patchAppearance({ bg })} />
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">Font</Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={appearance.font}
                        onChange={(e) => patchAppearance({ font: e.target.value as EmbedFont })}
                      >
                        <MenuItem value="geist">Geist (Dett default)</MenuItem>
                        <MenuItem value="system">System UI</MenuItem>
                        <MenuItem value="serif">Georgia / serif</MenuItem>
                        <MenuItem value="mono">Monospace</MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">Mode</Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={appearance.mode}
                        onChange={(e) => patchAppearance({ mode: e.target.value as 'light' | 'dark' })}
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Border radius ({appearance.radius}px)
                      </Typography>
                      <Slider
                        min={0}
                        max={28}
                        value={appearance.radius}
                        onChange={(_, v) => patchAppearance({ radius: v as number })}
                      />
                    </Box>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={appearance.showTitle}
                          onChange={(e) => patchAppearance({ showTitle: e.target.checked })}
                        />
                      }
                      label="Show title"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={appearance.showCharts}
                          onChange={(e) => patchAppearance({ showCharts: e.target.checked })}
                        />
                      }
                      label="Show charts"
                    />
                    <Box sx={{ flex: 1, minWidth: 160 }}>
                      <Typography variant="caption" color="text.secondary">Width</Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={appearance.width === '100%' ? '100%' : 'fixed'}
                        onChange={(e) =>
                          patchAppearance({ width: e.target.value === '100%' ? '100%' : '800px' })
                        }
                      >
                        <MenuItem value="100%">Fluid (100%)</MenuItem>
                        <MenuItem value="fixed">800px</MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 160 }}>
                      <Typography variant="caption" color="text.secondary">Height</Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={appearance.height === 'auto' ? 'auto' : 'fixed'}
                        onChange={(e) =>
                          patchAppearance({ height: e.target.value === 'auto' ? 'auto' : 700 })
                        }
                      >
                        <MenuItem value="auto">Auto (recommended)</MenuItem>
                        <MenuItem value="fixed">Fixed 700px</MenuItem>
                      </Select>
                    </Box>
                  </Stack>

                  <Divider />

                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Default inputs for {selectedCalc.shortName}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
                    {selectedCalc.inputs.map((input) => (
                      <TextField
                        key={input.key}
                        label={input.label}
                        size="small"
                        type="number"
                        value={inputs[input.key] ?? input.defaultValue}
                        onChange={(e) =>
                          setInputOverrides((prev) => ({
                            ...prev,
                            [selectedSlug]: {
                              ...prev[selectedSlug],
                              [input.key]: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    ))}
                  </Box>
                </Stack>
              </Paper>
            </Box>

            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                  3
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Live preview</Typography>
              </Stack>
              <Paper
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: appearance.mode === 'dark' ? '#111' : 'grey.50',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2, py: 1.25, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Preview sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Updates as you change options · {selectedCalc.name}
                  </Typography>
                </Stack>
                <iframe
                  src={previewSrc}
                  title="Live calculator preview"
                  style={{
                    width: appearance.width === '100%' ? '100%' : appearance.width,
                    height: appearance.height === 'auto' ? previewHeight : appearance.height,
                    border: 0,
                    display: 'block',
                    margin: '0 auto',
                    background: 'transparent',
                  }}
                />
              </Paper>
            </Box>

            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                  4
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Copy the snippet</Typography>
              </Stack>
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                <Tabs
                  value={snippetTab}
                  onChange={(_, v) => setSnippetTab(v)}
                  sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}
                  variant="scrollable"
                >
                  <Tab label="Auto-resize iframe" icon={<Code sx={{ fontSize: 18 }} />} iconPosition="start" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab label="iframe only" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab label="Modal button" sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {snippetTab === 0 && 'Paste this on any page. The iframe loads the calculator and a tiny script listens for postMessage to grow with the content.'}
                    {snippetTab === 1 && 'Plain iframe with a fixed height. Use this if your CMS blocks scripts. You can still add embed.js later for auto-resize.'}
                    {snippetTab === 2 && 'A “Calculate” button that opens the widget in a modal. Useful for sidebars and blog CTAs.'}
                  </Typography>
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: 'grey.900',
                      borderRadius: 2,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: '0.85rem',
                      color: '#A5F3FC',
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      lineHeight: 1.7,
                    }}
                  >
                    {currentSnippet}
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<ContentCopy />}
                    onClick={handleCopy}
                    sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Copy
                  </Button>
                </Box>
              </Paper>
            </Box>

            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                Install guides
              </Typography>
              {[
                {
                  id: 'html',
                  title: 'Plain HTML',
                  body: 'Paste the snippet wherever the calculator should appear — typically before the closing </body> on a landing page, or inside the article body. The iframe is the calculator; the optional script only handles auto-height.',
                },
                {
                  id: 'wordpress',
                  title: 'WordPress',
                  body: 'In the block editor, add a Custom HTML block and paste the snippet. On classic themes, a Custom HTML widget in a sidebar also works. If a security plugin strips iframes, allow dett.io. Do not run the snippet through a visual editor that rewrites HTML.',
                },
                {
                  id: 'squarespace',
                  title: 'Squarespace',
                  body: 'Edit the page, add a Code Block, and paste the snippet. Squarespace Business plans and above support Code Blocks. Set the block to span the full content width so the calculator can breathe on mobile.',
                },
                {
                  id: 'wix',
                  title: 'Wix',
                  body: 'Add an Embed HTML / Embed a widget element, paste the snippet, and stretch the element to the width you want. If you use the auto-resize script, give the embed element room to grow vertically.',
                },
                {
                  id: 'webflow',
                  title: 'Webflow',
                  body: 'Drag an Embed element onto the canvas, paste the snippet, and publish. Put it in a container with a max width of ~900px for a comfortable reading column, or full-bleed for a resource page.',
                },
              ].map((guide) => (
                <Accordion
                  key={guide.id}
                  disableGutters
                  elevation={0}
                  expanded={guideExpanded === guide.id}
                  onChange={(_, open) => setGuideExpanded(open ? guide.id : false)}
                  sx={{ border: '1px solid', borderColor: 'divider', '&:not(:last-of-type)': { borderBottom: 0 }, '&:first-of-type': { borderTopLeftRadius: 12, borderTopRightRadius: 12 }, '&:last-of-type': { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 } }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ fontWeight: 700 }}>{guide.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {guide.body}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <Box sx={{ maxWidth: 760, mx: 'auto', width: '100%' }}>
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
                <HelpOutline color="primary" />
                <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
                  FAQ
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {FAQ_ITEMS.map((item) => (
                  <Paper key={item.q} elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{item.q}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.a}</Typography>
                  </Paper>
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                Questions? <Link href="mailto:hello@dett.io">hello@dett.io</Link>
                {' · '}
                <Link href="/privacy">Privacy</Link>
                {' · '}
                <Link href="/calculators">All calculators</Link>
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setCopied(false)}>
          Embed code copied
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}
