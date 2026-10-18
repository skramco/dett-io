/**
 * Ad-hoc verification for ENG-327 fixes. Run: npx tsx scripts/verify-closing-costs.ts
 */
import { calculateClosingCosts, STATE_CLOSING_CUSTOMS } from '../lib/calculators/closingCosts';

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (!cond) {
    failures++;
    console.error(`FAIL: ${name}${detail ? ` — ${detail}` : ''}`);
  } else {
    console.log(`PASS: ${name}`);
  }
}

const base = {
  homePrice: 450000,
  downPaymentPercent: 20,
  interestRate: 6.75,
  loanTerm: 30,
  state: 'CA',
  isNewConstruction: false,
  originationFeePercent: 1,
  propertyTaxRate: 1.1,
  taxEscrowMonths: 3,
  prepaidInterestDays: 15,
  prepaidInsurance: 1800,
  sellerCreditPercent: 0,
};

// 1. Property tax appears exactly once (escrow prefund), never prepaid + escrow
const ca = calculateClosingCosts(base);
const taxLines = ca.lineItems.filter(i => i.name.toLowerCase().includes('tax') && i.category === 'prepaid');
check('exactly one property-tax line in prepaids', taxLines.length === 1, JSON.stringify(taxLines.map(t => t.name)));
const monthlyTax = Math.round((450000 * 0.011) / 12);
check('tax escrow = 3 months of monthly tax', taxLines[0].amount === monthlyTax * 3, `${taxLines[0].amount} vs ${monthlyTax * 3}`);

// 2. Inspection excluded from closing totals and cash to close
const inspection = ca.lineItems.find(i => i.name === 'Home Inspection');
check('inspection categorized outside closing', inspection?.category === 'outside-closing');
const sumAtClosing = ca.lineItems.filter(i => i.category !== 'outside-closing').reduce((s, i) => s + i.amount, 0);
check('totalClosingCosts excludes inspection', ca.details.totalClosingCosts === sumAtClosing);
check('cash to close = down payment + net closing costs', ca.details.totalCashNeeded === Math.round(90000 + (ca.details.totalClosingCosts as number)));
check('outsideClosingTotal = inspection fee', ca.details.outsideClosingTotal === 400);

// New construction: no inspection line at all
const newBuild = calculateClosingCosts({ ...base, isNewConstruction: true });
check('new construction has no inspection line', !newBuild.lineItems.some(i => i.name === 'Home Inspection'));

// 3. State logic — CA: no attorney fee, 0.11% transfer tax
check('CA has no attorney fee', !ca.lineItems.some(i => i.name.startsWith('Attorney')));
const caTransfer = ca.lineItems.find(i => i.name.startsWith('Transfer Tax'));
check('CA transfer tax = 0.11% of price', caTransfer?.amount === Math.round(450000 * 0.0011), String(caTransfer?.amount));

// NY: attorney state, 0.4% transfer tax
const ny = calculateClosingCosts({ ...base, state: 'NY' });
const nyAttorney = ny.lineItems.find(i => i.name.startsWith('Attorney'));
check('NY includes attorney fee', nyAttorney !== undefined && nyAttorney.amount === 1500);
const nyTransfer = ny.lineItems.find(i => i.name.startsWith('Transfer Tax'));
check('NY transfer tax = 0.4% of price', nyTransfer?.amount === Math.round(450000 * 0.004), String(nyTransfer?.amount));
check('NY total > CA total (attorney + higher transfer tax)', (ny.details.totalClosingCosts as number) > (ca.details.totalClosingCosts as number));

// TX: no transfer tax line at all
const tx = calculateClosingCosts({ ...base, state: 'TX' });
check('TX has no transfer-tax line', !tx.lineItems.some(i => i.name.startsWith('Transfer Tax')));

// 4. Origination fee editable
const noOrig = calculateClosingCosts({ ...base, originationFeePercent: 0 });
check('0% origination removes the line', !noOrig.lineItems.some(i => i.name.startsWith('Loan Origination')));
const halfOrig = calculateClosingCosts({ ...base, originationFeePercent: 0.5 });
const halfLine = halfOrig.lineItems.find(i => i.name.startsWith('Loan Origination'));
check('0.5% origination = 0.5% of loan', halfLine?.amount === Math.round(360000 * 0.005), String(halfLine?.amount));
check('origination line discloses assumption', halfLine?.name.includes('0.5% assumed') === true, halfLine?.name);

// Data sanity: all 50 states + DC present, all rates within plausible bounds
check('51 jurisdictions in table', Object.keys(STATE_CLOSING_CUSTOMS).length === 51, String(Object.keys(STATE_CLOSING_CUSTOMS).length));
for (const [code, s] of Object.entries(STATE_CLOSING_CUSTOMS)) {
  if (s.transferTaxRate < 0 || s.transferTaxRate > 4.5) { failures++; console.error(`FAIL: ${code} transfer rate out of range`); }
  if (s.attorneyCustomary !== (s.attorneyFee > 0)) { failures++; console.error(`FAIL: ${code} attorney flag/fee mismatch`); }
}
check('all state rates and attorney flags consistent', true);

// Unknown state falls back safely
const fallback = calculateClosingCosts({ ...base, state: 'ZZ' });
check('unknown state falls back without crashing', (fallback.details.totalClosingCosts as number) > 0);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
