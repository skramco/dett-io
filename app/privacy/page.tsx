'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
} from '@mui/material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';

export default function PrivacyPolicyPage() {
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
              Privacy Policy
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
            '& ul': { pl: 3, mb: 2, '& li': { fontSize: '1rem', lineHeight: 1.8, color: 'text.secondary', mb: 0.5 } },
          }}
        >
          <Stack spacing={0}>
            <h2>1. Introduction</h2>
            <p>Dett.io (&quot;Dett,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a website operated by Skramco Holdings LLC, a limited liability company organized under the laws of the State of Delaware. This Privacy Policy describes how we collect, use, disclose, and protect your information when you visit our website at dett.io (the &quot;Site&quot;) and use our free mortgage calculators, educational guides, and related services (collectively, the &quot;Services&quot;).</p>
            <p>By accessing or using the Site, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with this Privacy Policy, please do not access or use the Site.</p>

            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide Voluntarily</h3>
            <p>We may collect information that you voluntarily provide when using our Services, including:</p>
            <ul>
              <li><strong>Calculator Inputs:</strong> Financial data you enter into our calculators, such as income, loan amounts, interest rates, and property values. This data is processed locally in your browser and is not stored on our servers unless you explicitly choose to save or email your results.</li>
              <li><strong>Email Address:</strong> If you choose to email your calculator results to yourself, we collect the email address you provide solely for the purpose of delivering that email.</li>
              <li><strong>Contact Information:</strong> If you contact us directly, we may collect your name, email address, and the content of your communication.</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <p>When you visit the Site, certain information may be collected automatically, including:</p>
            <ul>
              <li><strong>Device and Browser Information:</strong> Browser type and version, operating system, device type, screen resolution, and language preferences.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, referring URLs, click patterns, and navigation paths.</li>
              <li><strong>IP Address:</strong> Your Internet Protocol address, which may be used to approximate your general geographic location (city/region level).</li>
              <li><strong>Cookies and Similar Technologies:</strong> We may use cookies, web beacons, pixels, and similar tracking technologies as described in Section 5 below.</li>
            </ul>

            <h3>2.3 Information We Do Not Collect</h3>
            <p>We do not collect, request, or store:</p>
            <ul>
              <li>Social Security numbers</li>
              <li>Bank account numbers or financial account credentials</li>
              <li>Credit card or payment information</li>
              <li>Credit reports or credit scores</li>
              <li>Government-issued identification numbers</li>
            </ul>
            <p>Our Services are entirely free and do not require account creation, login, or payment of any kind.</p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li><strong>To Provide the Services:</strong> Processing calculator inputs to generate results, delivering emailed results, and displaying educational content.</li>
              <li><strong>To Improve the Site:</strong> Analyzing usage patterns to improve functionality, user experience, and content relevance.</li>
              <li><strong>To Maintain Security:</strong> Detecting and preventing fraud, abuse, and unauthorized access.</li>
              <li><strong>To Comply with Legal Obligations:</strong> Responding to lawful requests from governmental authorities and complying with applicable laws and regulations.</li>
            </ul>
            <p>We do not use your information for targeted advertising, lead generation, or sale to third parties. We do not sell, rent, or lease your personal information to any third party for any purpose.</p>

            <h2>4. How We Share Your Information</h2>
            <p>We may share your information only in the following limited circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf, such as email delivery (Resend), web hosting (Netlify), analytics, and database services (Supabase). These providers are contractually obligated to use your information only as necessary to provide their services to us and are prohibited from using it for their own purposes.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law, regulation, legal process, or governmental request, or if we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others, investigate fraud, or respond to a government request.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, bankruptcy, or other similar event, your information may be transferred as part of that transaction. We will notify you via prominent notice on our Site of any change in ownership or uses of your personal information.</li>
            </ul>
            <p><strong>We do not sell your personal information.</strong> We have not sold personal information in the preceding twelve (12) months and do not intend to sell personal information in the future.</p>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>We may use the following types of cookies and similar technologies:</p>
            <ul>
              <li><strong>Strictly Necessary Cookies:</strong> Essential for the Site to function properly. These cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the Site by collecting and reporting information anonymously. We may use services such as Google Analytics or similar providers.</li>
              <li><strong>Functional Cookies:</strong> Enable enhanced functionality and personalization, such as remembering your calculator inputs during a session.</li>
            </ul>
            <p>You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. Please note that disabling cookies may affect the functionality of the Site.</p>
            <p>We do not use advertising cookies or retargeting pixels. We do not serve ads on the Site.</p>

            <h2>6. Data Retention</h2>
            <p>We retain your information only for as long as necessary to fulfill the purposes described in this Privacy Policy:</p>
            <ul>
              <li><strong>Calculator Inputs:</strong> Processed in real-time in your browser. If you choose to save results, they may be stored in our database and retained until you request deletion.</li>
              <li><strong>Email Addresses:</strong> Retained only as long as necessary to deliver your requested email. We do not add your email to any mailing list.</li>
              <li><strong>Usage Data:</strong> Retained in anonymized or aggregated form for up to twenty-four (24) months for analytics purposes.</li>
            </ul>

            <h2>7. Data Security</h2>
            <p>We implement reasonable administrative, technical, and physical safeguards designed to protect your information from unauthorized access, use, alteration, and destruction. These measures include:</p>
            <ul>
              <li>Encryption of data in transit using TLS/SSL</li>
              <li>Secure hosting infrastructure with access controls</li>
              <li>Regular security assessments and updates</li>
              <li>Principle of least privilege for data access</li>
            </ul>
            <p>However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially reasonable means to protect your information, we cannot guarantee its absolute security.</p>

            <h2>8. Your Rights and Choices</h2>
            <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete personal information.</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal information, subject to certain exceptions.</li>
              <li><strong>Right to Portability:</strong> Request a copy of your data in a structured, commonly used, machine-readable format.</li>
              <li><strong>Right to Opt-Out:</strong> Opt out of certain data processing activities, including the sale of personal information (which we do not engage in).</li>
            </ul>
            <p>To exercise any of these rights, please contact us at the address provided in Section 13 below. We will respond to your request within thirty (30) days, or such other period as required by applicable law.</p>

            <h2>9. California Residents (CCPA/CPRA)</h2>
            <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA), including:</p>
            <ul>
              <li>The right to know what personal information is collected, used, shared, or sold</li>
              <li>The right to delete personal information held by businesses</li>
              <li>The right to opt-out of the sale or sharing of personal information</li>
              <li>The right to non-discrimination for exercising your privacy rights</li>
              <li>The right to correct inaccurate personal information</li>
              <li>The right to limit use and disclosure of sensitive personal information</li>
            </ul>
            <p>We do not sell or share (as defined under the CCPA/CPRA) your personal information. We do not use or disclose sensitive personal information for purposes other than those permitted under the CCPA/CPRA.</p>

            <h2>10. Children&apos;s Privacy</h2>
            <p>The Site is not directed to children under the age of thirteen (13), and we do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected personal information from a child under 13, we will take reasonable steps to delete such information promptly. If you believe we may have collected information from a child under 13, please contact us immediately.</p>

            <h2>11. Third-Party Links</h2>
            <p>The Site may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices of such third parties. We encourage you to review the privacy policies of any third-party sites you visit. The inclusion of any link does not imply endorsement by Dett or Skramco Holdings LLC.</p>

            <h2>12. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the &quot;Effective Date&quot; at the top of this page and, where required by law, provide you with additional notice (such as a prominent notice on the Site). Your continued use of the Site after any changes constitutes your acceptance of the updated Privacy Policy.</p>

            <h2>13. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
            <p>
              <strong>Skramco Holdings LLC</strong><br />
              d/b/a Dett.io<br />
              Email: privacy@dett.io<br />
            </p>
            <p>We will make every reasonable effort to respond to your inquiry within thirty (30) days.</p>

            <h2>14. Governing Law</h2>
            <p>This Privacy Policy shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any disputes arising under or in connection with this Privacy Policy shall be subject to the exclusive jurisdiction of the state and federal courts located in the State of Delaware.</p>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
