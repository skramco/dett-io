'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  Calculate,
  CheckCircle,
  Code,
  ContentCopy,
  ExpandMore,
  Palette,
  Preview,
  Speed,
  Tune,
  VerifiedUser,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import { EMBED_CALCULATORS, getEmbedCalculator } from '@/lib/embed/catalog';
import {
  buildEmbedSrc,
  DEFAULT_EMBED_OPTIONS,
  FONT_STACKS,
  type EmbedFont,
  type EmbedTheme,
  type EmbedWidgetOptions,
} from '@/lib/embed/options';

const PITCH_POINTS = [
  { icon: <VerifiedUser fontSize="small" />, label: 'Free forever' },
  { icon: <Speed fontSize="small" />, label: 'No signup or API key' },
  { icon: <Preview fontSize="small" />, label: 'Mobile-responsive' },
  { icon: <Tune fontSize="small" />, label: 'Always up to date' },
];

const FONT_LABELS: Record<EmbedFont, string> = {
  system: 'System UI',
  sans: 'Sans-serif',
  serif: 'Serif',
  mono: 'Monospace',
};

const PLATFORM_GUIDES: { id: string; name: string; steps: string[] }[] = [
  {
    id: 'html',
    name: 'Plain HTML',
    steps: [
      'Open the page template where the calculator should appear.',
      'Paste the iframe snippet where you want the widget.',
      'Add the optional embed.js script just before </body> if you want auto-height.',
      'Publish the page and confirm the “Powered by Dett.io” link is visible.',
    ],
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    steps: [
      'Edit the post or page, then add a Custom HTML block.',
      'Paste the iframe snippet (and embed.js if you want auto-height).',
      'Some themes strip scripts — if auto-resize does not run, set a fixed height instead.',
      'Update the page. The widget stays current without further WordPress updates.',
    ],
  },
  {
    id: 'squarespace',
    name: 'Squarespace',
    steps: [
      'Edit the page and add a Code Block.',
      'Paste the iframe snippet into the block.',
      'If you use auto-height, also add embed.js in Settings → Advanced → Code Injection (Footer).',
      'Save and preview on mobile and desktop.',
    ],
  },
  {
    id: 'wix',
    name: 'Wix',
    steps: [
      'In the editor, click Add → Embed Code → Embed HTML.',
      'Paste the iframe snippet into the HTML embed.',
      'Stretch the embed box to your preferred width. Use a fixed height if Wix blocks scripts.',
      'Publish the site.',
    ],
  },
  {
    id: 'webflow',
    name: 'Webflow',
    steps: [
      'Drag an Embed element onto the canvas.',
      'Paste the iframe snippet (and embed.js for auto-height).',
      'Publish to the staging or production domain.',
      'Webflow’s Designer preview may clip iframes — check the published URL.',
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is this really free?',
    a: 'Yes. Embeds are free, with no signup, API key, usage cap, or lead form. The only requirement is keeping the small “Powered by Dett.io” attribution link visible. Dett.io is owned by Knowe LLC.',
  },
  {
    q: 'Do I have to credit Dett.io?',
    a: 'Yes, for free use. Every embed includes a do-follow “Powered by Dett.io” link back to the matching calculator page. Please do not hide, cover, or nofollow that link.',
  },
  {
    q: 'Do you track my visitors or their inputs?',
    a: 'No. Calculator inputs stay in the visitor’s browser. We only record that an embed loaded, plus the referring website domain — no names, emails, IPs stored by us, or the numbers people type.',
  },
  {
    q: 'Will the widget slow down my site?',
    a: 'The optional loader is a few kilobytes and loads asynchronously. The calculator itself lives in the iframe and does not block your page. Charts are code-split and only load when shown.',
  },
  {
    q: 'Who do I contact for support?',
    a: 'Email hello@dett.io. Dett.io is operated by Knowe LLC. We are not a lender and we do not take leads through embeds.',
  },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
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
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
          style={{ width: 40, height: 32, border: 'none', cursor: 'pointer', background: 'transparent' }}
        />
        <TextField
          value={value}
          onChange={(event) => onChange(event.target.value)}
          size="small"
          fullWidth
        />
      </Stack>
    </Box>
  );
}

function buildIframeSnippet(
  src: string,
  title: string,
  width: string,
  heightMode: 'auto' | 'fixed',
  fixedHeight: number
) {
  const widthStyle = width === '100%' ? '100%' : `${width}px`;
  const heightStyle = heightMode === 'auto' ? 'min-height:720px;' : `height:${fixedHeight}px;`;
  const iframe = `<iframe src="${src}" title="${title} — Dett.io" loading="lazy" style="width:${widthStyle};max-width:100%;border:0;${heightStyle}"></iframe>`;
  const loader = heightMode === 'auto' ? `\n<script src="https://dett.io/embed.js" async></script>` : '';
  return `${iframe}${loader}`;
}

function buildJsSnippet(slug: string, src: string, width: string) {
  const widthAttr = width === '100%' ? '' : ` data-width="${width}"`;
  const query = src.includes('?') ? src.slice(src.indexOf('?') + 1) : '';
  const queryAttr = query ? ` data-query="${query}"` : '';
  return `<div data-dett-calculator="${slug}"></div>\n<script src="https://dett.io/embed.js" data-calculator="${slug}" data-mode="iframe"${widthAttr}${queryAttr} async></script>`;
}

function defaultsForSlug(slug: string): Record<string, number> {
  const calc = getEmbedCalculator(slug);
  const defaults: Record<string, number> = {};
  calc?.fields.forEach((field) => {
    defaults[field.key] = field.defaultValue;
  });
  return defaults;
}

export function EmbedPageClient() {
  const [selectedSlug, setSelectedSlug] = useState('affordability');
  const [options, setOptions] = useState<EmbedWidgetOptions>({
    ...DEFAULT_EMBED_OPTIONS,
    inputs: defaultsForSlug('affordability'),
  });
  const [width, setWidth] = useState<'100%' | string>('100%');
  const [heightMode, setHeightMode] = useState<'auto' | 'fixed'>('auto');
  const [fixedHeight, setFixedHeight] = useState(720);
  const [snippetTab, setSnippetTab] = useState(0);
  const [previewHeight, setPreviewHeight] = useState(720);
  const [copied, setCopied] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(buildEmbedSrc('affordability', DEFAULT_EMBED_OPTIONS, ''));

  const selected = getEmbedCalculator(selectedSlug) ?? EMBED_CALCULATORS[0];

  const handleSelectSlug = (slug: string) => {
    setSelectedSlug(slug);
    setOptions((prev) => ({ ...prev, inputs: defaultsForSlug(slug) }));
  };

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setPreviewSrc(buildEmbedSrc(selectedSlug, options, ''));
    }, 280);
    return () => window.clearTimeout(handle);
  }, [selectedSlug, options]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || data.source !== 'dett-embed' || data.type !== 'resize') return;
      const next = Number(data.height);
      if (Number.isFinite(next) && next > 200) {
        setPreviewHeight(next);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const productionSrc = useMemo(
    () => buildEmbedSrc(selectedSlug, options),
    [selectedSlug, options]
  );

  const iframeSnippet = useMemo(
    () => buildIframeSnippet(productionSrc, selected.name, width, heightMode, fixedHeight),
    [productionSrc, selected.name, width, heightMode, fixedHeight]
  );

  const jsSnippet = useMemo(
    () => buildJsSnippet(selectedSlug, productionSrc, width),
    [selectedSlug, productionSrc, width]
  );

  const currentSnippet = snippetTab === 0 ? iframeSnippet : jsSnippet;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
  };

  const updateOptions = (patch: Partial<EmbedWidgetOptions>) => {
    setOptions((prev) => ({ ...prev, ...patch }));
  };

  const grouped = EMBED_CALCULATORS.reduce<Record<string, typeof EMBED_CALCULATORS>>((acc, calc) => {
    acc[calc.category] = acc[calc.category] || [];
    acc[calc.category].push(calc);
    return acc;
  }, {});

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        <Box sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 10 }, bgcolor: 'grey.900', color: 'white' }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Chip
              label="Free for everyone · Knowe LLC"
              size="small"
              sx={{ mb: 3, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
            />
            <Typography variant="h2" component="h1" sx={{ fontSize: { xs: 32, md: 48 }, fontWeight: 700, mb: 2 }}>
              Embed our calculators
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 640, mx: 'auto', mb: 4 }}>
              Put any Dett.io mortgage calculator on your site. Free, no signup, no API key,
              mobile-responsive, and always up to date. Same math as dett.io.
            </Typography>
            <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap>
              {PITCH_POINTS.map((item) => (
                <Chip
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    '& .MuiChip-icon': { color: 'white' },
                  }}
                />
              ))}
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={7}>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <StepBadge n={1} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Choose a calculator
                </Typography>
              </Stack>
              <Stack spacing={3}>
                {Object.entries(grouped).map(([category, calcs]) => (
                  <Box key={category}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                      {category}
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                        gap: 1.5,
                      }}
                    >
                      {calcs.map((calc) => {
                        const selectedCard = selectedSlug === calc.slug;
                        return (
                          <Paper
                            key={calc.slug}
                            elevation={0}
                            onClick={() => handleSelectSlug(calc.slug)}
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              border: '2px solid',
                              borderColor: selectedCard ? 'primary.main' : 'divider',
                              bgcolor: selectedCard ? 'action.selected' : 'background.paper',
                              borderRadius: 2,
                            }}
                          >
                            <Stack direction="row" spacing={1} alignItems="center">
                              {selectedCard ? (
                                <CheckCircle sx={{ fontSize: 18, color: 'primary.main' }} />
                              ) : (
                                <Calculate sx={{ fontSize: 18, color: 'text.disabled' }} />
                              )}
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: selectedCard ? 700 : 500, fontSize: '0.8rem' }}
                              >
                                {calc.name}
                              </Typography>
                            </Stack>
                          </Paper>
                        );
                      })}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <StepBadge n={2} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Customize
                </Typography>
              </Stack>
              <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Palette sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Colors, type, and theme
                    </Typography>
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <ColorField
                      label="Primary color"
                      value={options.primaryColor}
                      onChange={(primaryColor) => updateOptions({ primaryColor })}
                    />
                    <ColorField
                      label="Accent color"
                      value={options.accentColor}
                      onChange={(accentColor) => updateOptions({ accentColor })}
                    />
                    <ColorField
                      label="Background"
                      value={options.backgroundColor}
                      onChange={(backgroundColor) => updateOptions({ backgroundColor })}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <InputLabel>Font</InputLabel>
                      <Select
                        label="Font"
                        value={options.font}
                        onChange={(event) => updateOptions({ font: event.target.value as EmbedFont })}
                      >
                        {Object.entries(FONT_LABELS).map(([value, label]) => (
                          <MenuItem key={value} value={value} sx={{ fontFamily: FONT_STACKS[value as EmbedFont] }}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <InputLabel>Mode</InputLabel>
                      <Select
                        label="Mode"
                        value={options.theme}
                        onChange={(event) => {
                      const theme = event.target.value as EmbedTheme;
                      updateOptions({
                        theme,
                        backgroundColor:
                          theme === 'dark' && options.backgroundColor === '#ffffff'
                            ? '#111827'
                            : theme === 'light' && options.backgroundColor === '#111827'
                              ? '#ffffff'
                              : options.backgroundColor,
                      });
                    }}
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                      </Select>
                    </FormControl>
                    <Box sx={{ flex: 1, minWidth: 180 }}>
                      <Typography variant="caption" color="text.secondary">
                        Border radius · {options.borderRadius}px
                      </Typography>
                      <Slider
                        value={options.borderRadius}
                        min={0}
                        max={32}
                        onChange={(_, value) => updateOptions({ borderRadius: value as number })}
                      />
                    </Box>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.showTitle}
                          onChange={(event) => updateOptions({ showTitle: event.target.checked })}
                        />
                      }
                      label="Show title"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.showCharts}
                          onChange={(event) => updateOptions({ showCharts: event.target.checked })}
                        />
                      }
                      label="Show charts"
                    />
                  </Stack>

                  <Divider />

                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Default inputs
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 2,
                    }}
                  >
                    {selected.fields.map((field) => (
                      <TextField
                        key={field.key}
                        label={field.label}
                        size="small"
                        type="number"
                        value={options.inputs[field.key] ?? field.defaultValue}
                        onChange={(event) => {
                          const num = Number(event.target.value);
                          updateOptions({
                            inputs: {
                              ...options.inputs,
                              [field.key]: Number.isFinite(num) ? num : field.defaultValue,
                            },
                          });
                        }}
                      />
                    ))}
                  </Box>

                  <Divider />

                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Size
                  </Typography>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <InputLabel>Width</InputLabel>
                      <Select
                        label="Width"
                        value={width === '100%' || width === '720' || width === '480' ? width : 'custom'}
                        onChange={(event) => {
                          const next = event.target.value;
                          if (next === 'custom') setWidth('640');
                          else setWidth(next);
                        }}
                      >
                        <MenuItem value="100%">Auto (100%)</MenuItem>
                        <MenuItem value="720">720px</MenuItem>
                        <MenuItem value="480">480px</MenuItem>
                        <MenuItem value="custom">Custom px</MenuItem>
                      </Select>
                    </FormControl>
                    {width !== '100%' && (
                      <TextField
                        label="Width (px)"
                        size="small"
                        type="number"
                        value={width}
                        onChange={(event) => setWidth(event.target.value || '640')}
                        sx={{ width: 140 }}
                      />
                    )}
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <InputLabel>Height</InputLabel>
                      <Select
                        label="Height"
                        value={heightMode}
                        onChange={(event) => setHeightMode(event.target.value as 'auto' | 'fixed')}
                      >
                        <MenuItem value="auto">Auto-height (recommended)</MenuItem>
                        <MenuItem value="fixed">Fixed height</MenuItem>
                      </Select>
                    </FormControl>
                    {heightMode === 'fixed' && (
                      <TextField
                        label="Height (px)"
                        size="small"
                        type="number"
                        value={fixedHeight}
                        onChange={(event) => setFixedHeight(Number(event.target.value) || 720)}
                        sx={{ width: 140 }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Paper>
            </Box>

            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <StepBadge n={3} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Live preview
                </Typography>
              </Stack>
              <Paper
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: options.theme === 'dark' ? '#111827' : 'grey.50',
                }}
              >
                <iframe
                  src={previewSrc}
                  title={`${selected.name} preview`}
                  style={{
                    width: width === '100%' ? '100%' : `${width}px`,
                    maxWidth: '100%',
                    height: heightMode === 'auto' ? previewHeight : fixedHeight,
                    border: 0,
                    display: 'block',
                    margin: '0 auto',
                    background: options.backgroundColor,
                  }}
                />
              </Paper>
            </Box>

            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <StepBadge n={4} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Copy the snippet
                </Typography>
              </Stack>
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                <Tabs value={snippetTab} onChange={(_, value) => setSnippetTab(value)} sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Tab icon={<Code sx={{ fontSize: 18 }} />} iconPosition="start" label="iframe + auto-resize" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab icon={<Tune sx={{ fontSize: 18 }} />} iconPosition="start" label="JS loader" sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {snippetTab === 0
                      ? 'Paste this iframe. The optional script listens for postMessage and resizes the frame on mobile and desktop.'
                      : 'A lightweight loader injects the iframe and auto-resizes it. Works anywhere you can add a script tag.'}
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
              {PLATFORM_GUIDES.map((guide) => (
                <Accordion key={guide.id} disableGutters elevation={0} sx={{ border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' }, mb: 1.5, borderRadius: '12px !important' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography sx={{ fontWeight: 700 }}>{guide.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack component="ol" sx={{ m: 0, pl: 2.5 }} spacing={1}>
                      {guide.steps.map((step) => (
                        <Typography key={step} component="li" variant="body2" color="text.secondary">
                          {step}
                        </Typography>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <Box sx={{ maxWidth: 760, mx: 'auto', width: '100%' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                FAQ
              </Typography>
              <Stack spacing={2}>
                {FAQ_ITEMS.map((item) => (
                  <Paper key={item.q} elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {item.q}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.a}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                Dett.io is owned by Knowe LLC. Embeds use the same calculator math as the main site and never include LoanKnow lead forms.
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
          Embed code copied to clipboard.
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      {n}
    </Box>
  );
}
