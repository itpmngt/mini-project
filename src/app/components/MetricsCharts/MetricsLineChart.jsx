import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from "styled-components";

import { useMetricsCharts } from "./MetricsChartsContext";


const GraphWrapper = styled.div`
    background-color: aliceblue;
    padding-top:30px;
`;

const PillsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Pill = styled.button`
    padding: 4px 4px;
    margin: 4px;
`;

const MetricsLineChart = ( props ) => {

    const { data, metric } = props;

    const { activeMetricsChart, setActiveMetricsChart } = useMetricsCharts();

    if ( data && data['years']) {

        return (

                <GraphWrapper>


                    <PillsContainer>

                        <Pill onClick={() => setActiveMetricsChart('years')} > Years </Pill>
                        <Pill onClick={() => setActiveMetricsChart('quarters')} > Quarters </Pill>

                    </PillsContainer>

                    <ResponsiveContainer width="100%" height={200}>

                        <LineChart
                            data={  data[ activeMetricsChart ].map(( x, i) => ({
                                    x,
                                    y: data[ metric ][i] ? Number( data[ metric ][i]) / 1000 : 0 })) || []}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >

                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />

                            <XAxis dataKey={ activeMetricsChart } stroke="#888" />
                            <YAxis stroke="#888" />

                            <Tooltip 
                                contentStyle={{ background: '#666', border: '1px solid #333' }}
                                labelStyle={{ color: '#fff' }}
                            />

                            <Line type="monotone" dataKey="y" stroke="#26a69a" />

                        </LineChart>

                    </ResponsiveContainer>

                </GraphWrapper>

        );
    }
}

export default MetricsLineChart