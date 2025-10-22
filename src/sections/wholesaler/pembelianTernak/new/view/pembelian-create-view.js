'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import PembelianNewEditForm from '../pembelian-new-edit-form';
import { Button, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function PembelianCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <Button
        type="button"
        component={RouterLink}
        href={paths.wholesaler.pembelianTernak.root}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        sx={{ mb: 3 }}
      >
        Kembali
      </Button> */}

      <Typography variant="h4" sx={{ my: 5 }}>
        Pembelian Ternak
      </Typography>

      <PembelianNewEditForm />
    </Container>
  );
}
