'use client';

import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { _orders, ORDER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import PembayaranDetailsToolbar from './pembayaran-detail-toolbar';
import PembayaranDetailItems from './pembayaran-detail-item';
import PembayaranDetailsInfo from './pembayaran-detail-info';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useBoolean } from 'src/hooks/use-boolean';
import PembayaranDetailDialog from './pembayaran-detail-dialog';
import useCreateData from 'src/api/wholesaler/create';

import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import useUpdateData from 'src/api/wholesaler/update';

// ----------------------------------------------------------------------

export default function OrderDetailsView({ data, onBack, resetForm }) {
  const openModalBayar = useBoolean();
  const loadingSubmit = useBoolean();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmitPembayaran = async (paymentMethod) => {
    loadingSubmit.onTrue();
    try {
      const res = await useCreateData('pembelianTernak', {
        id: data.invoiceNumber,
        ternak: data.items.map((item) => item.idTernak),
        wholesaler: data.wholesaler.id,
        peternakan: data.invoiceTo.id,
        metodePembayaran: paymentMethod,
        tujuanPembelian: data.tujuanPembelian,
        lokasiTujuan: data.lokasiTujuan,
        harga: data.totalAmount,
      });

      await Promise.all(
        res.ternak.map(async (item) => {
          await useUpdateData('ternak', item, { status: 'proses' });
        })
      );

      await useCreateData('pemasukan', {
        jenisPemasukan: 'Penjualan Ternak',
        tanggal: new Date(),
        jumlahPemasukan: data.items.length,
        satuanPemasukan: 'Ekor',
        nilaiPemasukan: data.totalAmount,
        detailPemasukan: data.items.map((item) => ({
          RFID: item.rfid,
          harga: parseInt(item.harga),
        })),
        peternakan: data.invoiceTo.id,
        pembelianTernak: res.id,
      });

      loadingSubmit.onFalse();
      openModalBayar.onFalse();
      resetForm();
      enqueueSnackbar('Pembayaran berhasil', { variant: 'success' });
      router.push(`${paths.wholesaler.pembelianTernak.root}/${res.id}`);
    } catch (error) {
      console.log(error);
      loadingSubmit.onFalse();
      enqueueSnackbar('Pembayaran gagal', { variant: 'error' });
    }
  };

  return (
    <Stack>
      <PembayaranDetailsToolbar
        onBack={onBack}
        invoiceNumber={data.invoiceNumber}
        createdAt={new Date()}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <PembayaranDetailItems
              totalAmount={data.totalAmount}
              data={data.items}
              onBack={onBack}
            />

            <LoadingButton
              size="large"
              variant="contained"
              color="primary"
              // loading={loadingSend.value && isSubmitting}
              onClick={openModalBayar.onTrue}
            >
              Bayar
            </LoadingButton>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <PembayaranDetailsInfo
            customer={data.wholesaler}
            delivery={data.metodePengiriman}
            lokasiTujuan={data.lokasiTujuan}
          />
        </Grid>
      </Grid>

      <PembayaranDetailDialog
        open={openModalBayar.value}
        onClose={openModalBayar.onFalse}
        totalAmount={data.totalAmount}
        handleSubmitPembayaran={handleSubmitPembayaran}
        loadingSubmit={loadingSubmit.value}
      />
    </Stack>
  );
}

OrderDetailsView.propTypes = {
  data: PropTypes.object.isRequired,
};
