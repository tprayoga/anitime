import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import ButtonBase from '@mui/material/ButtonBase';

import Iconify from 'src/components/iconify';
import Chart, { useChart } from 'src/components/chart';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function GrafikIncome({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const data = {
    title: 'Income vs Expense',
    subheader: '(+43%) than last year',
    chart: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      series: [
        {
          year: '2019',
          data: [
            {
              name: 'Income',
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
            },
            {
              name: 'Expense',
              data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
            },
          ],
        },
        {
          year: '2020',
          data: [
            {
              name: 'Income',
              data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
            },
            {
              name: 'Expense',
              data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
            },
          ],
        },
      ],
      chart: {
        height: 2000,
      },
    },
  };

  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    categories,
    series,
    options,
  } = data.chart;

  const popover = usePopover();

  const [seriesData, setSeriesData] = useState('2019');

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0], opacity: 1 },
          { offset: 100, color: colr[1], opacity: 1 },
        ]),
      },
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  return (
    <>
      <Card {...other} sx={{ height: '100%', overflow: 'auto' }}>
        <Scrollbar>
          <CardHeader title={data.title} />

          {series.map((item) => (
            <Box key={item.year} sx={{ mt: 3, mx: 3, height: '100%' }}>
              {item.year === seriesData && (
                <Chart
                  dir="ltr"
                  type="line"
                  series={item.data}
                  options={chartOptions}
                  width="100%"
                  // height={200}
                />
              )}
            </Box>
          ))}
        </Scrollbar>
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {series.map((option) => (
          <MenuItem
            key={option.year}
            selected={option.year === seriesData}
            onClick={() => handleChangeSeries(option.year)}
          >
            {option.year}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

GrafikIncome.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
