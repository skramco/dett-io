# Dett - Free Debt Education & Calculators

**Understand debt. See the truth. Make better decisions.**

Dett is a 100% free, consumer-first web application dedicated to debt education and transparent calculators. No paywalls, no lead gating, no hidden agendas.

Sister site to [LoanKnow](https://loanknow.com).

## 🎯 Project Philosophy

- **100% Free** - No paywalls, no lead forms, no monetization pressure
- **Transparent** - Show the real cost of debt, not just what lenders want you to see
- **Educational** - Learn as you calculate, understand tradeoffs
- **Consumer-First** - Built to help people make better decisions, not to sell them

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (Postgres + Auth)
- **Hosting**: Netlify

## 📊 Features

### Calculators
1. **True Monthly Mortgage Cost** - See your real monthly payment including PITI, HOA, and PMI
2. **Refinance Break-Even** - Compare current loan vs refinancing with total cost analysis
3. **Extra Payment Impact** - See interest savings and compare debt paydown vs investing

### Educational Content
- What debt actually is
- Good debt vs bad debt
- Why interest + time matter more than you think
- How lenders think about debt

### Technical Features
- Modular calculator engine with pure functions
- Scenario comparison (A/B/C)
- Anonymous session storage with Supabase
- Shareable calculator URLs (future)
- Mobile-first responsive design
- Fast, clean, accessible UI

## 🛠️ Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (optional for local dev)
- Resend account (for email functionality)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd dett

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your credentials to .env.local
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# RESEND_API_KEY=your_resend_api_key
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema in `lib/supabase/schema.sql` in your Supabase SQL editor
3. Copy your project URL and anon key to `.env.local`

### Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key in your Resend dashboard
3. Add your domain or use Resend's test domain
4. Update the `from` address in `app/api/send-results/route.ts` to match your verified domain
5. Add `RESEND_API_KEY` to `.env.local`

**Note:** With Resend's free tier, you can send up to 100 emails/day for testing.

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
dett/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home page
│   ├── learn/                   # Educational content
│   ├── calculators/             # Calculator hub + individual calculators
│   │   ├── page.tsx            # Calculators hub
│   │   ├── mortgage-cost/      # True monthly cost calculator
│   │   ├── refinance/          # Refinance calculator
│   │   └── extra-payment/      # Extra payment calculator
├── components/                   # Reusable React components
│   └── CalculatorLayout.tsx    # Shared calculator page layout
├── lib/                         # Core business logic
│   ├── calculators/            # Calculator engine (pure functions)
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── mortgageCost.ts    # Mortgage calculations
│   │   ├── refinance.ts       # Refinance calculations
│   │   ├── extraPayment.ts    # Extra payment calculations
│   │   └── index.ts           # Exports
│   └── supabase/               # Database client & types
│       ├── client.ts          # Supabase client
│       ├── types.ts           # Database types
│       └── schema.sql         # Database schema
├── .env.example                 # Environment variables template
├── netlify.toml                # Netlify configuration
└── README.md                   # This file
```

## 🧮 Calculator Architecture

Calculators are built with a clean separation of concerns:

1. **Pure calculation functions** (`lib/calculators/*.ts`) - No side effects, fully testable
2. **UI components** (`app/calculators/*/page.tsx`) - Handle user input and display results
3. **Shared types** (`lib/calculators/types.ts`) - Type safety across the app

Each calculator returns a `CalculatorResult` with:
- `summary` - Plain English explanation
- `details` - Key numbers and metrics
- `chartData` - Data for visualizations
- `insights` - Contextual tips and warnings

## 🚢 Deployment

### Netlify (Recommended)

1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

Netlify will automatically:
- Build on every push
- Create preview deployments for PRs
- Handle Next.js server-side rendering

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy .next directory to your hosting provider
```

## 🔒 Security & Privacy

- No user tracking or analytics (by design)
- Anonymous calculator sessions (no PII required)
- Row-level security enabled in Supabase
- All calculations happen client-side (no data sent to server during calculation)
- Optional email-based accounts for saving scenarios (future feature)

## 🎨 Design System

- **Colors**: Slate palette (calm, professional)
- **Typography**: System fonts (fast, accessible)
- **Spacing**: Generous whitespace
- **Components**: Rounded corners, subtle shadows, clear hierarchy
- **Tone**: Calm, empowering, educational

## 📝 Future Enhancements

- [ ] Scenario saving and comparison (A/B/C)
- [ ] Shareable calculator URLs
- [ ] More calculators (student loans, credit cards, auto loans)
- [ ] Interactive charts with tooltips
- [ ] PDF export of results
- [ ] Email-based accounts (optional)
- [ ] Calculator history
- [ ] Mobile app

## 🤝 Contributing

This is a consumer education project. Contributions welcome!

## 📄 License

MIT License - See LICENSE file for details

## 💡 Philosophy

Most financial calculators are built by lenders to sell you loans. They hide the true cost, focus on monthly payments, and make refinancing seem like a no-brainer.

Dett exists to show you the truth. Every number explained. Every tradeoff visible. No agenda except helping you make better decisions.

---

Built with ❤️ for consumers who deserve better.
