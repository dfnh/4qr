import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData } from 'chart.js';
import { memo } from 'react';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  dataLabel: string;
} & (
  | {
      labels: string[];
      data: number[];
      map?: never;
    }
  | {
      labels?: never[];
      data?: never[];
      map: Map<string, number>;
    }
);

export function createDataForPie(props: Props): ChartData<'pie', number[], string> {
  const lblm = (props?.map && [...props?.map?.keys()]) ?? [];
  const lbll = props?.labels ?? [];
  const labels = lbll.length > 0 ? lbll : lblm;

  const dtm = (props?.map && [...props?.map?.values()]) ?? [];
  const dtd = props?.data ?? [];
  const data = dtd.length > 0 ? dtd : dtm;

  const dataLabel = props?.dataLabel;

  return {
    labels: labels,
    datasets: [
      {
        label: dataLabel,
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
}
const PieChart = memo(({ data }: { data: ChartData<'pie', number[], string> }) => {
  return <Pie data={data} />;
});
PieChart.displayName = 'PieChart';

export default PieChart;
