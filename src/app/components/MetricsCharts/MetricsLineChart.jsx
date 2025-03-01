import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from "styled-components";

import { MetricsChartsProvider, useMetricsCharts} from "./MetricsChartsContext.jsx";

const GraphWrapper = styled.div`
    background-color: aliceblue;
    padding-top:30px;
`;

const MetricsLineChart = ( props ) => {

    const { data, x, y } = props;

    const {activeMetricsChart, setActiveMetricsChart} = useMetricsCharts();

    return (

        <GraphWrapper>

            

            <MetricsChartsProvider defaultIndex={defaultIndex}>

                <ResponsiveContainer width="100%" height={200}>

                    <LineChart
                        data={data[x].map((_x, i) => ({
                            _x,
                            _y: data[y][i] ? Number(data[y][i]) / 1000 : 0 })) || []}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >

                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />

                        <XAxis dataKey="year" stroke="#888" />
                        <YAxis stroke="#888" />

                        <Tooltip 
                            contentStyle={{ background: '#666', border: '1px solid #333' }}
                            labelStyle={{ color: '#fff' }}
                        />

                        <Line type="monotone" dataKey="_y" stroke="#26a69a" />

                    </LineChart>

                </ResponsiveContainer>

            </MetricsChartsProvider>

        </GraphWrapper>

    );

}

export default MetricsLineChart