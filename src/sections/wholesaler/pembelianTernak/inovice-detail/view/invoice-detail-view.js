'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _invoices } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceDetails from '../invoice-details';
import { RouterLink } from 'src/routes/components';
import { Button, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useMemo } from 'react';
import useGetOne from 'src/api/getOne';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView({ id }) {
  const settings = useSettingsContext();

  //   const currentInvoice = _invoices[0];

  const adminToken = sessionStorage.getItem('adminToken');

  const {
    data: invoice,
    loading,
    refetch,
  } = useGetOne('pembelianTernak', id, {
    expand: 'ternak,wholesaler,peternakan',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const inovice = useMemo(() => {
    if (!invoice) return null;
    const inv = {
      invoiceNumber: invoice.id || id,
      invoiceFrom: invoice.expand.wholesaler,
      invoiceTo: invoice.expand.peternakan,
      items: invoice.expand.ternak,
      createdAt: invoice.created,
      lokasiTujuan: invoice.lokasiTujuan,
    };

    return inv;
  }, [invoice]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Button
        type="button"
        component={RouterLink}
        href={paths.wholesaler.pembelianTernak.root}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={24} />}
        sx={{
          ml: -1,
        }}
      >
        <Typography variant="h4">{inovice?.invoiceNumber}</Typography>
      </Button>

      <InvoiceDetails invoice={inovice} />
    </Container>
  );
}

InvoiceDetailsView.propTypes = {
  id: PropTypes.string,
};
