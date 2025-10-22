import { Button, Grid, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../scrollbar';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { useEffect } from 'react';
import { useCreateData, useUpdateData } from 'src/api/custom-api';
import { useTheme } from '@emotion/react';
import RHFDatePicker from 'src/components/hook-form/rhf-datepicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 600 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function GenerateDeliveryOrder({
  open,
  onClose,
  pembelian,
  pemasukan,
  refetch,
  ternak,
  wholesaler,
  ...other
}) {
  const theme = useTheme();
  const user = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const TIPE_KENDARAAN = [
    { id: 'engkel', label: 'Truk Engkel' },
    { id: 'double', label: 'Truk Double' },
  ];

  const { createData: createDO, loading: loadingCreate, error: errorCreate } = useCreateData();

  const {
    createData: createNotificationDO,
    loading: loadingCreateNotif,
    error: errorCreateNotif,
  } = useCreateData();

  const {
    updateData: updatePemasukan,
    updateData: updatePembelian,
    updateData: updateTernak,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateData();

  const schema = Yup.object().shape({
    namaSupir: Yup.string().required('Nama Supir Wajib Diisi'),
    noKendaraan: Yup.string().required('Nomor Kendaraan Wajib Diisi'),
    tipeKendaraan: Yup.string().required('Tipe Kendaraan Wajib Diisi'),
    termPay: Yup.string().required('Term Payment Wajib Diisi'),
    tanggalDelivery: Yup.string().required('Tanggal Delivery Wajib Diisi'),
  });

  const defaultValues = {
    namaSupir: '',
    noKendaraan: '',
    tipeKendaraan: '',
    termPay: '',
    tanggalDelivery: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const body = {
      ...data,
      termPay: new Date(data.termPay),
      tanggalDelivery: new Date(data.tanggalDelivery),
      pemasukan: pemasukan,
    };

    await createDO(body, 'deliveryOrder')
      .then(async (deliveryOrder) => {
        await updatePemasukan(
          pemasukan,
          {
            deliveryOrder: deliveryOrder.id,
          },
          'pemasukan'
        );
        await updatePembelian(
          pembelian,
          {
            deliveryOrder: deliveryOrder.id,
          },
          'pembelianTernak'
        );

        await Promise.all(
          ternak?.map((item) =>
            updateTernak(
              item.id,
              {
                status: 'terjual',
              },
              'ternak'
            )
          )
        );

        await createNotificationDO(
          {
            name: 'Pembelian Diterima',
            message: `
            Pembelian Ternak ${pembelian} telah diterima, cek Delivery Order anda
            `,
            read: false,
            wholesaler: wholesaler,
            pembelianTernak: pembelian,
          },
          'notifications'
        );

        enqueueSnackbar('Success', { variant: 'success' });
        onClose();
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar('Failed', { variant: 'error' });
      });

    refetch();
    reset();
  });

  const modalHeader = (
    <Box
      sx={{
        backgroundColor: '#EAFFEA',
        borderRadius: 1,
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: '9999',
      }}
    >
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>
        Generate Delivery Order
      </Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2 }}>
      <RHFTextField name="namaSupir" label="Nama Supir" sx={{ mt: 1 }} />
      <Stack
        mt={3}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 3, sm: 1 },
        }}
      >
        <RHFTextField name="noKendaraan" label="Nomor Kendaraan" />
        <RHFSelect
          name="tipeKendaraan"
          label="Tipe Kendaraan"
          sx={{
            width: { xs: '100%', sm: '50%' },
          }}
        >
          {TIPE_KENDARAAN?.map((option) => (
            <MenuItem value={option.id} key={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </RHFSelect>
      </Stack>

      <RHFDatePicker name="termPay" label="Term Payment" sx={{ width: '100%', mt: 3 }} />
      <RHFDatePicker
        name="tanggalDelivery"
        label="Tanggal Delivery"
        sx={{ width: '100%', mt: 3 }}
      />
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button sx={{}} onClick={onClose}>
        Batal
      </Button>
      <LoadingButton color="primary" variant="contained" type="submit" loading={isSubmitting}>
        Generate
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Scrollbar sx={{ maxHeight: '80vh' }}>
            {modalHeader}
            <FormProvider methods={methods} onSubmit={onSubmit}>
              {modalBody}
              {modalFooter}
            </FormProvider>
          </Scrollbar>
        </Box>
      </Modal>
    </>
  );
}
