import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 380;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    marginBottom: theme.spacing(3),
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function ChartRadialBar1({ series }) {
  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    labels: ['Pengiriman Awal Ternak', 'Pengiriman Pakan', 'Pengambilan Pakan'],
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '68%',
        },
        dataLabels: {
          value: {
            offsetY: 16,
          },
          total: {
            formatter: () => fNumber(2324) + ' ton CO2 -e',
          },
        },
      },
    },
  });

  return (
    <StyledChart
      dir="ltr"
      type="radialBar"
      series={series}
      options={chartOptions}
      width="100%"
      height={280}
    />
  );
}

ChartRadialBar1.propTypes = {
  series: PropTypes.array,
};
