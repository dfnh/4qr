import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData } from 'chart.js';
import { memo } from 'react';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = memo(({ data }: { data: ChartData<'pie', number[], string> }) => {
  return <Pie data={data} />;
});
PieChart.displayName = 'PieChart';

export default PieChart;
