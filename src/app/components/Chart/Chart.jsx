import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Chart = ( data, x, y ) => {

    return <ResponsiveContainer width="100%" height={200}>
                <LineChart
                    data={data[x].map((_x, i) => ({
                        _x,
                        _y: data[y][i] ? Number(data[y][i]) / 1000 : 0 })) || []}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="year" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                        contentStyle={{ background: '#1e1e1e', border: '1px solid #333' }}
                        labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="_y" stroke="#26a69a" />
                </LineChart>
            </ResponsiveContainer>

}