import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';


export interface FinancialData {
  years: string[];
  annual_eps: string[];
  annual_dividend_per_share: string[];
  annual_revenue: string[];
  annual_ebitda: string[];
  quarters: string[];
  q_dividends: string[];
  q_book_value: string[];
  q_revenue: string[];
  q_income: string[];
  q_eps: string[];
  q_assets: string[];
  q_liabilities: string[];
  q_equity: string[];
  q_cash: string[];
  q_free_cash_flow: string[];
  q_debt_to_equity: string[];
  dividend_growth_5y: string;
  eps_growth_5y: string;
  revenue_growth_5y: string;
  ebitda_growth_5y: string;
  dividend_growth_3y: string;
  eps_growth_3y: string;
  revenue_growth_3y: string;
  ebitda_growth_3y: string;
  eps_growth_ttm: string;
  revenue_growth_ttm: string;
  dividend_growth_ttm: string;
  ebitda_growth_ttm: string;
  ttm_eps: string;
  ttm_dividends: string;
  ttm_revenue: string;
  ttm_ebitda: string;
  roa: string;
  roe: string;
  roic: string;
  net_margin: string;
  fcf_margin: string;
  gross_margin: string;
  operating_margin: string;
  debt_to_equity: string;
  interest_coverage: string;
  symbol: string;
  company: string;
  currency: string;
  industry: string;
  sector: string;
  subindustry: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || 'AAPL';

  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'processed', `${symbol}.json`);
    const fileContents = await fs.readFile(jsonPath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data as FinancialData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load data' },
      { status: 500 }
    );
  }
}