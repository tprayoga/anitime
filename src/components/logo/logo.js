import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, isTitle, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = isTitle ? (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        cursor: 'pointer',
        ...sx,
      }}
      {...other}
    >
      <Box
        ref={ref}
        component="img"
        src="/logo/logo.png"
        alt="anitime"
        sx={{
          width: '75%',
          height: '75%',
        }}
      />

      {isTitle && (
        <Typography color="primary" sx={{ fontWeight: '900' }} variant="h4">
          ANITIME
        </Typography>
      )}
    </Stack>
  ) : (
    <Box
      ref={ref}
      component="img"
      src="/logo/logo.png"
      alt="anitime"
      sx={{
        cursor: 'pointer',
        ...sx,

        width: '75%',
        height: '75%',
      }}
      {...other}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
  isTitle: PropTypes.bool,
};

export default Logo;
