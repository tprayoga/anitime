import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Logo from 'src/components/logo';
import { tr } from 'date-fns/locale';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

const METHODS = [
  {
    id: 'jwt',
    label: 'Jwt',
    path: paths.auth.jwt.login,
    icon: '/assets/icons/auth/ic_jwt.svg',
  },
  {
    id: 'firebase',
    label: 'Firebase',
    path: paths.auth.firebase.login,
    icon: '/assets/icons/auth/ic_firebase.svg',
  },
  {
    id: 'amplify',
    label: 'Amplify',
    path: paths.auth.amplify.login,
    icon: '/assets/icons/auth/ic_amplify.svg',
  },
  {
    id: 'auth0',
    label: 'Auth0',
    path: paths.auth.auth0.login,
    icon: '/assets/icons/auth/ic_auth0.svg',
  },
];

export default function AuthDombaLayout({ children, image, title }) {
  const { method } = useAuthContext();
  const { themeMode } = useSettingsContext();

  const theme = useTheme();

  const upMd = useResponsive('up', 'md');

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
      path="/"
      isTitle
    />
  );

  const renderContent = (
    <Stack
      justifyContent={'center'}
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 4 },
        zIndex: 10,
        position: 'relative',
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack sx={{ width: '60%', position: 'relative' }}>
      <Stack
        sx={{
          height: '75vh',
          position: 'relative',
          top: '15%',
        }}
      >
        <Box
          component="img"
          alt="auth"
          src={image || '/assets/background/overlay_3.jpg'}
          sx={{
            top: 0,
            left: 0,
            objectFit: 'cover',
            position: 'absolute',
            width: 'calc(100% - 32px)',
            height: 'calc(100%)',
          }}
        />

        <Typography
          sx={{
            position: 'absolute',
            bottom: 30,
            left: 30,
            maxWidth: '70%',
            color: 'common.white',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'justify',
          }}
        >
          Embrace a revolution in livestock management that goes beyond traditional practices,
          offering you a comprehensive solution to oversee every aspect of your cattle farm with
          ease.
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        height: '100vh',
        position: 'relative',
      }}
    >
      {renderLogo}

      {upMd && renderSection}

      {renderContent}
    </Stack>
  );
}

AuthDombaLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
