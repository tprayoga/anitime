'use client';

import { Box, Container } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';

import { _roles, _userList } from 'src/_mock';
import useGetOne from 'src/api/getOne';
import { useSettingsContext } from 'src/components/settings';
import PembayaranDeliveryOrderDetail from '../pembayaran-delivery-order-detail';
import './style.css';
import DeliveryOrderDetail from 'src/components/deliveryOrderDetail';
// ----------------------------------------------------------------------

export default function PembelianDeliveryOrderView({ id }) {
  const settings = useSettingsContext();

  const adminToken = sessionStorage.getItem('adminToken');

  const { data: dataDeliveryOrder } = useGetOne('deliveryOrder', id, {
    expand:
      'pemasukan.pembelianTernak.wholesaler, pemasukan.pembelianTernak.peternakan, pemasukan.pembelianTernak.ternak',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const currentDataPemasukan = useMemo(() => {
    if (!dataDeliveryOrder) return null;
    const inv = {
      invoiceNumber: dataDeliveryOrder.expand.pembelianTernak,
      invoiceFrom: dataDeliveryOrder.expand.pemasukan.expand.pembelianTernak.expand.wholesaler,
      invoiceTo: dataDeliveryOrder.expand.pemasukan.expand.pembelianTernak.expand.peternakan,
      items: dataDeliveryOrder.expand.pemasukan.expand.pembelianTernak.expand.ternak,
      createdAt: dataDeliveryOrder.expand.pemasukan.created,
      data: dataDeliveryOrder.expand.pemasukan,
      pembelian: dataDeliveryOrder.expand.pemasukan.expand.pembelianTernak,
      deliveryOrder: dataDeliveryOrder,
    };

    return inv;
  }, [dataDeliveryOrder]);

  console.log(currentDataPemasukan);

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
        <title>Delivery Order</title>
        ${styles}
      </head>
      <body>${printContents}</body>
    </html>
  `);
    iframeDocument.close();

    iframeElement.contentWindow.print();

    document.body.removeChild(iframeElement);
  };
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Box mt={5}>
          <DeliveryOrderDetail deliveryOrder={currentDataPemasukan} handlePrint={printDiv} />
        </Box>
      </Container>
    </>
  );
}
