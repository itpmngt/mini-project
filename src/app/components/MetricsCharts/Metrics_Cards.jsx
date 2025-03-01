import { styled } from 'styled-components';

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

const MetricsCards = ( props ) => {

    const { apiData } = props;

    return (

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

    );

}

export default MetricsCards