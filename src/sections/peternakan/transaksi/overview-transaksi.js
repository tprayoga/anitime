import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

import { bgGradient } from 'src/theme/css';
import { Typography } from '@mui/material';
import { FormatRupiah } from '@arismun/format-rupiah';
import Chart, { useChart } from 'src/components/chart';
import { fNumber } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OverviewTransaksi({ img, price, title, chart, wilayah, sx, ...other }) {
  const theme = useTheme();
  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    colors: ['#0EE9FF'],
    chart: {
      animations: {
        enabled: true,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
      marker: {
        show: false,
      },
    },
    ...options,
  });

  return (
    <Box {...other}>
      <Box
        sx={{
          color: 'common.white',
          borderRadius: 2,
          p: 2,
          ...bgGradient({
            direction: '100deg',
            startColor: '#369DB4',
            endColor: '#274441',
          }),
          position: 'relative',
        }}
      >
        <Button
          sx={{
            borderRadius: '20px',
            backgroundColor: 'common.white',
            display: 'inline-block',
            color: '#000',
            px: 2,
            py: 1,
          }}
        >
          {wilayah}
        </Button>
        <Typography mt={2} fontWeight={'bold'}>
          {title}
        </Typography>
        <Typography fontWeight={'bold'} typography={'h2'}>
          <FormatRupiah value={price} />
        </Typography>
        <Typography>Rp. /Kg</Typography>
        <Button
          size="large"
          startIcon={<Iconify icon="charm:arrow-down" />}
          variant="contained"
          sx={{
            mt: 1,
            ...bgGradient({
              direction: '100deg',
              startColor: '#292560',
              endColor: '#8271C9',
            }),
          }}
        >
          -3,59% - Rp. -4.500
        </Button>

        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            maxWidth: '50%',
            height: '100%',
            objectFit: 'cover',
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
            ...sx,
          }}
        >
          <Chart
            dir="ltr"
            type="area"
            series={[{ data: series }]}
            options={chartOptions}
            width={'100%'}
            height={'100%'}
          />
        </Box>
        {/* <Box
          component="img"
          alt="invite"
          src={'/assets/images/chart-line/chart.png'}
          sx={{
            position: 'absolute',
            right : 0,
            top : 0,
            maxWidth : '50%',
            height : '100%',
            objectFit : 'cover',
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
            ...sx,
          }} */}
      </Box>
    </Box>
  );
}

OverviewTransaksi.propTypes = {
  img: PropTypes.string,
  price: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
};
