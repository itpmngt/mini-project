import { styled } from 'styled-components';

import MetricsCharts from './MetricsCharts';
import MetricsCards from './MetricsCards';

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const MetricsChartsContainer = styled.div`
  margin-bottom: 1rem;
`;


const MetricsChartsComponent = ( props ) => {

    const { apiData } = props;

    return (

      <MetricsChartsContainer>

        <Title>{apiData?.company || 'Company'} ({apiData?.symbol || ''})</Title>
                
        <MetricsCards apiData={ apiData } />

        <MetricsCharts apiData={ apiData } />

      </MetricsChartsContainer>

    )
}


export default MetricsChartsComponent