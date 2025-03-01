import { styled } from 'styled-components'

import { Tabs, Tab, TabList, TabPanel } from '../Tabs/Tabs'
import { MetricsChartsProvider } from "./MetricsChartsContext";
import MetricsLineChart from './MetricsLineChart'


const ChartTitle = styled.h3`
  margin: 4px 0 2px 0;
`;


const MetricsCharts = ( props ) => {

    const { apiData } = props;

    if ( apiData && apiData['years']) {

        return (

        <MetricsChartsProvider>

            <Tabs defaultIndex={0} >

                <TabList>
                    <Tab index={0}><ChartTitle>Revenue Growth</ChartTitle></Tab>
                    <Tab index={1}><ChartTitle>EPS Trend</ChartTitle></Tab>
                    <Tab index={2}><ChartTitle>Dividends</ChartTitle></Tab>
                    <Tab index={3}><ChartTitle>Earnings</ChartTitle></Tab>
                </TabList>

                <TabPanel index={0}>
                    <MetricsLineChart data={apiData} metric="annual_revenue" />
                </TabPanel>
                
                <TabPanel index={1}>
                    <MetricsLineChart data={apiData} metric="annual_eps" />
                </TabPanel>

                <TabPanel index={2}>
                    <MetricsLineChart data={apiData} metric="annual_dividend_per_share" />
                </TabPanel>

                <TabPanel index={3}>
                    <MetricsLineChart data={apiData} metric="annual_ebitda" />
                </TabPanel>

            </Tabs>

        </MetricsChartsProvider>

    ) }

}


export default MetricsCharts
