'use client';  // Add this to mark as client component

import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { FinancialData } from './api/data/route';

import { MetricsCards, MetricsCharts } from './components/MetricsCharts'

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
        
        <MetricsCards apiData={ apiData } />

        <MetricsCharts apiData={ apiData } />

      </Panel>

    </Container>
  );
}

export default Home;
