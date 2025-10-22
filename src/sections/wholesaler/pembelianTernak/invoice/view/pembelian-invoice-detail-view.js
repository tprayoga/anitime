'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _invoices } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceDetails from '../invoice-details';
import { Button, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { Stack } from '@mui/system';
import InvoiceToolbar from '../invoice-toolbar';
import useGetOne from 'src/api/wholesaler/getOne';
import { useCallback, useMemo } from 'react';
import './style.css';

// ----------------------------------------------------------------------

export default function PembelianInvoiceDetailsView({ id }) {
  const settings = useSettingsContext();
  const adminToken = sessionStorage.getItem('adminToken');

  const {
    data: invoice,
    loading,
    refetch,
  } = useGetOne('pembelianTernak', id, {
    expand: 'ternak,wholesaler,peternakan',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const currentInvoice = useMemo(() => {
    if (!invoice) return null;
    const inv = {
      invoiceNumber: invoice.id || id,
      invoiceFrom: invoice.expand.wholesaler,
      invoiceTo: invoice.expand.peternakan,
      items: invoice.expand.ternak,
      createdAt: invoice.created,
    };

    return inv;
  }, [invoice]);

  const getStyles = () => {
    // Collect stylesheets from the original document
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch (e) {
          console.warn('Could not access cssRules from a stylesheet', e);
          return '';
        }
      })
      .join('\n');

    return `<style>${styles}</style>`;
  };

  const printDiv = (divId) => {
    console.log(divId);
    const printContents = document.getElementById(divId).outerHTML;
    const styles = getStyles();

    const iframeElement = document.createElement('iframe');
    document.body.appendChild(iframeElement);

    const iframeDocument = iframeElement.contentDocument;
    iframeDocument.open();
    iframeDocument.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Screening Profile</title>
        ${styles}
      </head>
      <body>${printContents}</body>
    </html>
  `);
    iframeDocument.close();

    iframeElement.contentWindow.print();

    document.body.removeChild(iframeElement);
  };

  // const currentInvoice = _invoices[0];

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={'lg'}>
      <Button
        type="button"
        component={RouterLink}
        href={paths.wholesaler.pembelianTernak.root}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        sx={{ mb: 5 }}
      >
        Kembali
      </Button>

      {/* <Stack direction="row" justifyContent="flex-end">
        <InvoiceToolbar invoice={currentInvoice} />
      </Stack> */}

      <InvoiceDetails invoice={currentInvoice} handlePrint={printDiv} />
    </Container>
  );
}

PembelianInvoiceDetailsView.propTypes = {
  id: PropTypes.string,
};
