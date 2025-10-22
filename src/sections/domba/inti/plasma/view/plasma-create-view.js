'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import ManageNewEditForm from '../plasma-new-edit-form';
import { Button, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function PlasmaCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Button
        type="button"
        component={RouterLink}
        href={paths.dombaIntiPeternakan.plasma.root}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        sx={{ mb: 5 }}
      >
        Back
      </Button>

      <Typography variant="h4" sx={{ my: 2 }}>
        Buat User
      </Typography>

      <ManageNewEditForm />
    </Container>
  );
}
