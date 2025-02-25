'use client';  // Add this to mark as client component

import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { FinancialData } from './api/data/route';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, Tab, TabList, TabPanel } from './components/Tabs/Tabs'

interface YahooFinanceResponse {
  chart?: {
    result?: Array<{
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
        }>;
      };
    }>;
    error: any;
  };
}

const Container = styled.div`
  background-color: #121212;
  color: #fff;
  min-height: 100vh;
  display: flex;
`;

const Panel = styled.div<{ $rightPanel?: boolean }>`
  flex: ${props => props.$rightPanel ? '0.3' : '0.7'};  // 70-30 split
  padding: 20px;
  ${(props: { $rightPanel?: boolean }) => props.$rightPanel && `
    border-left: 1px solid #333;
    overflow-y: auto;
  `}
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: calc(100vh - 100px);  // Full height minus padding and title
`;

const DataDisplay = styled.pre`
  white-space: pre-wrap;
`;

const LoadingText = styled.p`
  margin: 0;
`;

const InputContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  background: #1e1e1e;
  color: #fff;
  border: 1px solid #333;
  padding: 8px 12px;
  border-radius: 4px;
`;

const Button = styled.button`
  background: #26a69a;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #2bbbad;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const MetricCard = styled.div`
  background: #1e1e1e;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #333;
`;

const MetricTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #888;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #26a69a;
`;

const ChartTitle = styled.h2`
  margin: 4px 0 2px 0;
`;

function Home() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [apiData, setApiData] = useState<FinancialData | null>(null);
  const [inputTicker, setInputTicker] = useState<string>('AAPL');
  const [ticker, setTicker] = useState<string>('AAPL');

  // Fetch stock data from our Next.js API route
  useEffect(() => {
    fetch(`/api/stock?symbol=${ticker}`)
      .then((res) => res.json())
      .then((data: YahooFinanceResponse) => {
        const result = data.chart?.result?.[0];
        if (
          result &&
          result.timestamp &&
          result.indicators &&
          result.indicators.quote &&
          result.indicators.quote[0].close
        ) {
          const timestamps = result.timestamp;
          const quote = result.indicators.quote[0];
          const chartData = timestamps.map((ts, index) => ({
            time: ts as Time,
            open: quote.open[index],
            high: quote.high[index],
            low: quote.low[index],
            close: quote.close[index],
          }));
          setChartData(chartData);
        }
      })
      .catch((err) => console.error('Error fetching stock data:', err));

    // Fetch JSON data with the same ticker
    fetch(`/api/data?symbol=${ticker}`)
      .then((res) => res.json())
      .then((data) => setApiData(data))
      .catch((err) => console.error('Error fetching local data:', err));
  }, [ticker]);

  // Initialize the chart once when the component mounts
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,  // Use full container height
        layout: {
          background: { color: '#121212' },
          textColor: '#fff',
        },
        grid: {
          vertLines: { color: '#333' },
          horzLines: { color: '#333' },
        },
        timeScale: {
          borderColor: '#333',
        },
      });
      
      chartRef.current = chart;
      // Create a candlestick series instead of line series
      candlestickSeriesRef.current = chart.addCandlestickSeries( {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // Resize handler to keep chart responsive
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();  // Cleanup chart on unmount
      };
    }
  }, []);

  // Update the chart data once it's fetched
  useEffect(() => {
    if (candlestickSeriesRef.current && chartData.length > 0) {
      candlestickSeriesRef.current.setData(chartData);
    }
  }, [chartData]);
  return (
    <Container>
      {/* Left Panel: Stock Chart */}
      <Panel>
        <InputContainer>
          <Input 
            type="text" 
            value={inputTicker}
            onChange={(e) => setInputTicker(e.target.value.toUpperCase())}
            placeholder="Enter ticker symbol"
          />
          <Button onClick={() => setTicker(inputTicker)}>
            Update
          </Button>
        </InputContainer>
        <ChartContainer ref={chartContainerRef} />
      </Panel>

      {/* Right Panel: Local JSON Data */}
      <Panel $rightPanel>
        <Title>{apiData?.company || 'Company'} ({apiData?.symbol || ''})</Title>
        
        <MetricsGrid>
          <MetricCard>
            <MetricTitle>TTM Revenue</MetricTitle>
            <MetricValue>
              ${apiData?.ttm_revenue ? (Number(apiData.ttm_revenue) / 1000).toFixed(1) : '--'}B
            </MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricTitle>TTM EPS</MetricTitle>
            <MetricValue>${apiData?.ttm_eps || '--'}</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricTitle>Gross Margin</MetricTitle>
            <MetricValue>{apiData?.gross_margin || '--'}%</MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricTitle>ROE</MetricTitle>
            <MetricValue>{apiData?.roe || '--'}%</MetricValue>
          </MetricCard>
        </MetricsGrid>

        <Tabs defaultIndex={0} >

          <TabList>
            <Tab index={0}><ChartTitle>Revenue Growth</ChartTitle></Tab>
            <Tab index={1}><ChartTitle>EPS Trend</ChartTitle></Tab>
          </TabList>

          <TabPanel index={0}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={apiData?.years?.map((year, i) => ({
                  year,
                  revenue: apiData?.annual_revenue?.[i] ? Number(apiData.annual_revenue[i]) / 1000 : 0
                })) || []}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="year" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ background: '#1e1e1e', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#26a69a" />
              </LineChart>
            </ResponsiveContainer>
          </TabPanel>
          
          <TabPanel index={1}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={apiData?.years?.map((year, i) => ({
                  year,
                  eps: apiData?.annual_eps?.[i] ? Number(apiData.annual_eps[i]) : 0
                })) || []}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="year" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ background: '#1e1e1e', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="eps" stroke="#26a69a" />
              </LineChart>
            </ResponsiveContainer>
          </TabPanel>

        </Tabs>

      </Panel>
    </Container>
  );
}

export default Home;
