import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsChart({ data }) {
    // ডাটা প্রসেসিং: প্রতিদিনের স্ট্যাটাস অনুযায়ী গ্রুপিং
    const processData = () => {
        const chartMap = {};
        data.forEach(item => {
            const date = new Date(item.createdAt).toLocaleDateString(); // আপনার Schema-তে createdAt থাকতে হবে
            if (!chartMap[date]) {
                chartMap[date] = { date, pending: 0, confirmed: 0, completed: 0 };
            }
            if (item.status === 'pending') chartMap[date].pending++;
            if (item.status === 'confirmed') chartMap[date].confirmed++;
            if (item.status === 'completed') chartMap[date].completed++;
        });
        return Object.values(chartMap);
    };

    return (
        <div className="chart-section">
            <h3>Appointment Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="confirmed" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}