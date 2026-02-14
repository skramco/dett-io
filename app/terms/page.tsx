'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
} from '@mui/material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';

export default function TermsOfUsePage() {
  const effectiveDate = 'February 13, 2026';

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
              Terms of Use
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Effective Date: {effectiveDate}
            </Typography>
          </Container>
        </Box>

        <Container
          maxWidth="md"
          sx={{
            py: { xs: 6, md: 8 },
            '& h2': { fontSize: { xs: 22, md: 26 }, fontWeight: 700, mt: 5, mb: 1.5 },
            '& h3': { fontSize: { xs: 18, md: 20 }, fontWeight: 600, mt: 3, mb: 1 },
            '& p': { fontSize: '1rem', lineHeight: 1.8, color: 'text.secondary', mb: 2 },
            '& ul, & ol': { pl: 3, mb: 2, '& li': { fontSize: '1rem', lineHeight: 1.8, color: 'text.secondary', mb: 0.5 } },
          }}
        >
          <Stack spacing={0}>
            <h2>1. Acceptance of Terms</h2>
            <p>These Terms of Use (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;you,&quot; &quot;your,&quot; or &quot;User&quot;) and Skramco Holdings LLC, a Florida limited liability company, doing business as Dett.io (&quot;Dett,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using the website located at dett.io (the &quot;Site&quot;) and any services, features, content, calculators, tools, or applications offered on or through the Site (collectively, the &quot;Services&quot;), you agree to be bound by these Terms.</p>
            <p>If you do not agree to all of these Terms, you must not access or use the Site or Services. We reserve the right to modify these Terms at any time. Your continued use of the Site following the posting of revised Terms constitutes your acceptance of such changes.</p>

            <h2>2. Description of Services</h2>
            <p>Dett.io provides free, web-based mortgage and financial calculators, educational articles, guides, and related informational content. The Services are designed to help consumers understand mortgage-related financial concepts and perform illustrative calculations for educational purposes.</p>
            <p>The Services are provided free of charge. No account creation, registration, or payment is required to access or use the Services.</p>

            <h2>3. Not Financial, Legal, or Tax Advice</h2>
            <p><strong>THE SERVICES PROVIDED ON THIS SITE DO NOT CONSTITUTE FINANCIAL ADVICE, INVESTMENT ADVICE, TAX ADVICE, LEGAL ADVICE, OR ANY OTHER FORM OF PROFESSIONAL ADVICE.</strong></p>
            <p>All calculator results, estimates, projections, analyses, articles, guides, and other content provided through the Services (collectively, &quot;Output&quot;) are for <strong>informational and educational purposes only</strong>. Output is based on the data you provide, general assumptions, and simplified mathematical models that may not account for all variables relevant to your specific financial situation.</p>
            <p>You acknowledge and agree that:</p>
            <ul>
              <li>Dett.io is <strong>not</strong> a mortgage lender, mortgage broker, financial advisor, investment advisor, tax advisor, real estate agent, or licensed professional of any kind.</li>
              <li>Dett.io does <strong>not</strong> originate, fund, service, approve, or deny mortgage loans or any other financial products.</li>
              <li>Dett.io does <strong>not</strong> make any representations or guarantees regarding mortgage approval, interest rates, loan terms, or any financial outcome.</li>
              <li>Output should <strong>not</strong> be relied upon as the sole basis for any financial decision, including but not limited to purchasing a home, refinancing a mortgage, or selecting a loan product.</li>
              <li>You should consult with qualified professionals — including licensed mortgage loan originators, financial advisors, tax professionals, and attorneys — before making any financial decisions.</li>
              <li>Actual mortgage terms, rates, payments, costs, and eligibility will vary based on factors not captured by our calculators, including but not limited to your complete credit history, employment verification, property appraisal, lender underwriting criteria, and current market conditions.</li>
            </ul>

            <h2>4. Accuracy of Information</h2>
            <p>While we make reasonable efforts to ensure the accuracy and reliability of the information and calculations provided through the Services, we make <strong>no warranty or guarantee</strong> that any Output is accurate, complete, current, or error-free.</p>
            <p>Calculator results are estimates based on simplified formulas and the inputs you provide. Actual financial outcomes may differ materially from any estimates or projections generated by the Services. Tax rates, insurance costs, PMI rates, closing costs, and other variables used in calculations are approximations and may not reflect your actual costs.</p>
            <p>We are not responsible for any errors or omissions in the content provided on the Site, or for any actions taken or not taken based on such content.</p>

            <h2>5. User Conduct</h2>
            <p>By using the Site, you agree that you will not:</p>
            <ul>
              <li>Use the Services for any unlawful purpose or in violation of any applicable local, state, national, or international law or regulation.</li>
              <li>Attempt to gain unauthorized access to any portion of the Site, other accounts, computer systems, or networks connected to the Site.</li>
              <li>Use any automated means, including robots, crawlers, scrapers, or data mining tools, to access, collect, or copy any content from the Site without our prior written consent.</li>
              <li>Interfere with or disrupt the operation of the Site or the servers or networks used to make the Site available.</li>
              <li>Transmit any viruses, worms, defects, Trojan horses, or other items of a destructive nature.</li>
              <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
              <li>Reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any content from the Site, except as permitted by these Terms.</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>All content, features, and functionality of the Site — including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, software, calculator algorithms, and the design, selection, and arrangement thereof — are the exclusive property of Skramco Holdings LLC or its licensors and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
            <p>The &quot;Dett,&quot; &quot;Dett.io,&quot; and &quot;Skramco&quot; names, logos, and all related names, logos, product and service names, designs, and slogans are trademarks of Skramco Holdings LLC. You may not use such marks without our prior written permission.</p>
            <p>You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Site and Services for your personal, non-commercial use, subject to these Terms.</p>

            <h2>7. Third-Party Links and Services</h2>
            <p>The Site may contain links to third-party websites, services, or resources that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p>

            <h2>8. Disclaimer of Warranties</h2>
            <p><strong>THE SITE AND SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</strong></p>
            <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, SKRAMCO HOLDINGS LLC DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE OR SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SITE OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
            <p>WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY, RELIABILITY, COMPLETENESS, OR TIMELINESS OF THE CONTENT, SERVICES, SOFTWARE, TEXT, GRAPHICS, LINKS, OR COMMUNICATIONS PROVIDED ON OR THROUGH THE SITE.</p>

            <h2>9. Limitation of Liability</h2>
            <p><strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SKRAMCO HOLDINGS LLC, ITS OFFICERS, DIRECTORS, MEMBERS, MANAGERS, EMPLOYEES, AGENTS, AFFILIATES, SUCCESSORS, OR ASSIGNS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH:</strong></p>
            <ul>
              <li>Your access to, use of, or inability to access or use the Site or Services;</li>
              <li>Any Output, content, or information obtained from or through the Site or Services;</li>
              <li>Any financial decisions made based on Output or content from the Site;</li>
              <li>Unauthorized access to or alteration of your transmissions or data;</li>
              <li>Any conduct or content of any third party on the Site;</li>
              <li>Any other matter relating to the Site or Services.</li>
            </ul>
            <p><strong>IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SITE OR SERVICES EXCEED ONE HUNDRED DOLLARS ($100.00).</strong></p>
            <p>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE EXCLUSIONS OR LIMITATIONS MAY NOT APPLY, AND YOU MAY HAVE ADDITIONAL RIGHTS.</p>

            <h2>10. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Skramco Holdings LLC, its officers, directors, members, managers, employees, agents, affiliates, successors, and assigns from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising from or relating to: (a) your use of the Site or Services; (b) your violation of these Terms; (c) your violation of any rights of a third party; or (d) any financial decisions you make based on Output or content from the Site.</p>

            <h2>11. Governing Law and Dispute Resolution</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.</p>
            <p>Any dispute, claim, or controversy arising out of or relating to these Terms or the breach, termination, enforcement, interpretation, or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, shall be determined by binding arbitration administered in accordance with the rules of the American Arbitration Association (&quot;AAA&quot;). The arbitration shall be conducted in the State of Delaware. Judgment on the award rendered by the arbitrator(s) may be entered in any court having jurisdiction thereof.</p>
            <p><strong>YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION.</strong> If for any reason a claim proceeds in court rather than in arbitration, you and Skramco Holdings LLC each waive any right to a jury trial.</p>

            <h2>12. Severability</h2>
            <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such invalidity, illegality, or unenforceability shall not affect any other provision of these Terms, and these Terms shall be construed as if such invalid, illegal, or unenforceable provision had never been contained herein.</p>

            <h2>13. Waiver</h2>
            <p>No waiver of any term or condition set forth in these Terms shall be deemed a further or continuing waiver of such term or condition or a waiver of any other term or condition, and any failure to assert a right or provision under these Terms shall not constitute a waiver of such right or provision.</p>

            <h2>14. Entire Agreement</h2>
            <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and Skramco Holdings LLC regarding your use of the Site and Services, and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Site and Services.</p>

            <h2>15. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at:</p>
            <p>
              <strong>Skramco Holdings LLC</strong><br />
              d/b/a Dett.io<br />
              Email: legal@dett.io<br />
            </p>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
