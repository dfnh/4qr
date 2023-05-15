import { type ChartData } from 'chart.js';

export type Props = {
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
          'rgba(252, 99, 132, 0.2)',
          'rgba(54, 162, 225, 0.2)',
          'rgba(254, 206, 86, 0.2)',
          'rgba(65, 192, 192, 0.2)',
          'rgba(163, 102, 255, 0.2)',
          'rgba(215, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(252, 99, 132, 1)',
          'rgba(54, 162, 225, 1)',
          'rgba(254, 206, 86, 1)',
          'rgba(65, 192, 192, 1)',
          'rgba(163, 102, 255, 1)',
          'rgba(215, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
}
