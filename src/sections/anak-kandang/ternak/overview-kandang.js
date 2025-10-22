import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function OverviewKandang({ img, price, title, sx, type, ...other }) {
  const theme = useTheme();

  const success = {
    direction: '100deg',
    startColor: '#36B443',
    endColor: '#274441',
  }

  const pending = {
    direction: '100deg',
    startColor: '#FFD35A',
    endColor: '#443527',
  }

  const failed = {
    direction: '100deg',
    startColor: '#FF5A5A',
    endColor: '#443527',
  }

  const gradientColor = type === 'success' ? success : type === 'pending' ? pending : failed;

  return (
    <Box {...other}>
      <Box
        sx={{
          color: 'common.white',
          borderRadius: 2,
          p: theme.spacing(4, 4, 4, 4),
          ...bgGradient(gradientColor),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} justifyContent={'space-between'}>
          <Box
            component="img"
            alt="invite"
            src={img}
            sx={{
              position: 'relative',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
              ...sx,
            }}
          />
          <Box sx={{ whiteSpace: 'pre-line', typography: 'h4' }}>{title}</Box>
          <Box sx={{ typography: 'h2' }}>{price}</Box>
        </Stack>
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
