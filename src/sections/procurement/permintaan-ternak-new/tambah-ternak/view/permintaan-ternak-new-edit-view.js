'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

import Container from '@mui/material/Container';

import { _orders } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PermintaanTernakNewEditForm from '../permintaan-ternak-new-edit-form';
import useGetOne from 'src/api/getOne';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function PermintaanTernakNewEditView({ id }) {
  const settings = useSettingsContext();
  const adminToken = sessionStorage.getItem('adminToken');

  const { data, loading } = useGetOne('permintaanTernak', id, {
    expand: 'createdBy, ternak, ternak.kandang, peternakan',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tambah Permintaan Ternak"
          links={[
            {
              name: 'Dashboard',
              href: '/procurement/',
            },
            {
              name: 'Permintaan Ternak',
              href: '/procurement/permintaan-ternak/',
            },
            { name: 'Tambah Permintaan Ternak' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <PermintaanTernakNewEditForm currentPermintaan={data} />
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
