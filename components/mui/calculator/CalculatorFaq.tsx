'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import { ExpandMore, HelpOutline } from '@mui/icons-material';
import { getCalculatorFaqs } from '@/lib/seo/calculatorFaqs';

/**
 * Visible FAQ section for calculator pages. The same content is emitted as
 * FAQPage JSON-LD by the route layout (lib/seo/calculatorSeo.ts) — Google
 * requires FAQ rich-result content to be visible on the page.
 */
export function CalculatorFaq({ slug }: { slug: string }) {
  const faqs = getCalculatorFaqs(slug);
  if (faqs.length === 0) return null;

  return (
    <Box component="section" sx={{ mt: 6 }} aria-labelledby="calculator-faq-heading">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <HelpOutline sx={{ color: 'primary.main' }} />
        <Typography id="calculator-faq-heading" variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Frequently Asked Questions
        </Typography>
      </Box>
      {faqs.map((faq) => (
        <Accordion
          key={faq.question}
          disableGutters
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px !important',
            mb: 1.5,
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography component="h3" variant="body1" sx={{ fontWeight: 600 }}>
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
