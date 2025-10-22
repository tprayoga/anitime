import PropTypes from 'prop-types';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function ChartPie1({ series }) {
  const chartOptions = useChart({
    labels: ['Sorgum', 'Jagung', 'Sawit', 'Jati', 'Karet'],
    legend: {
      position: 'right',
      offsetX: -20,
      offsetY: 64,
      itemMargin: {
        vertical: 8,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
  });

  return (
    <Chart dir="ltr" type="pie" series={series} options={chartOptions} width={400} height="auto" />
  );
}

ChartPie1.propTypes = {
  series: PropTypes.array,
};
