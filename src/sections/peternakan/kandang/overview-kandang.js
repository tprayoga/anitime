import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function OverviewKandang({ img, price, title, sx, loading, ...other }) {
  const theme = useTheme();

  return (
    <Box {...other}>
      <Box
        sx={{
          color: 'common.white',
          borderRadius: 2,
          p: theme.spacing(5, 5, 5, 5),
          ...bgGradient({
            direction: '100deg',
            startColor: '#36B443',
            endColor: '#274441',
          }),
        }}
      >
        {loading ? (
          'eos-icons:three-dots-loading'
        ) : (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              component="img"
              alt="invite"
              src={img}
              sx={{
                width: 'clamp(0.1vw, 5vw, 5vw)',
                position: 'relative',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
                ...sx,
              }}
            />
            <Box sx={{ fontSize: 'clamp(0.1vw, 1.5vw, 5vw)', fontWeight: 'bold' }}>{title}</Box>
            <Box sx={{ fontSize: 'clamp(0.1vw, 2.5vw, 5vw)', fontWeight: 'bold' }}>
              {title === 'Total Luas' ? (
                <b>
                  {price}
                  <span style={{ fontSize: 20 }}>Ha</span>
                </b>
              ) : (
                price
              )}
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

OverviewKandang.propTypes = {
  img: PropTypes.string,
  price: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
};
