import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import CalculatorResultsEmail from '@/emails/CalculatorResultsEmail';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const body = await request.json();
    const { email, calculatorName, summary, details, insights, inputs, calculatorPath } = body;

    if (!email || !calculatorName || !summary || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Build prefilled calculator URL
    let calculatorUrl = `https://dett.io${calculatorPath || '/calculators'}`;
    if (inputs && typeof inputs === 'object') {
      const params = new URLSearchParams();
      Object.entries(inputs).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        }
      });
      const qs = params.toString();
      if (qs) calculatorUrl += `?${qs}`;
    }

    const emailHtml = await render(
      CalculatorResultsEmail({
        calculatorName,
        summary,
        details,
        insights: insights || [],
        calculatorUrl,
      })
    );

    const { data, error } = await resend.emails.send({
      from: 'Dett <noreply@dett.io>',
      to: [email],
      subject: `${calculatorName} - Your Results from Dett`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
