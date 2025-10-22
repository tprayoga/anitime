import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { _addressBooks } from 'src/_mock';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

import PembelianNewEditAddress from './permintaan-new-edit-address';
import PembelianNewEditDetails from './permintaan-new-edit-details';
import { useAuthContext } from 'src/auth/hooks';
import { CalculatePrice } from '../../components/calculatePrice';
import { Divider } from '@mui/material';
import useCreateData from 'src/api/wholesaler/create';
import PermintaanNewEditDueDate from './permintaan-new-edit-due-date';

// ----------------------------------------------------------------------

export default function PermintaanNewEditForm({ currentInvoice }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const [page, setPage] = useState(0);
  const [dataPembelian, setDataPembelian] = useState({});

  const NewInvoiceSchema = Yup.object().shape({
    dueDate: Yup.mixed().required('Tanngal jatuh tempo harus diisi'),
    invoiceTo: Yup.mixed().nullable().required('Pilih Peternakan.'),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          jenisBreed: Yup.string().required('Jenis Breed harus dipilih.'),
          berat: Yup.number().required('Berat harus diisi').min(500, 'Berat minimum 500 Kg'),
          jumlahPermintaaan: Yup.number()
            .required('Jumlah Permintaan harus diisi')
            .min(1, 'Jumlah Permintaan harus lebih dari 0'),
        })
      )
    ),
    // not required
    taxes: Yup.number(),
    status: Yup.string(),
    wholesaler: Yup.mixed(),
    totalAmount: Yup.number(),
    invoiceNumber: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      createDate: currentInvoice?.createDate || new Date(),
      dueDate: currentInvoice?.dueDate || null,
      taxes: currentInvoice?.taxes || 0,
      status: currentInvoice?.status || 'Ditunda',
      wholesaler: currentInvoice?.wholesaler || user,
      invoiceTo: currentInvoice?.invoiceTo || null,
      items: currentInvoice?.items || [
        {
          jenisBreed: '',
          berat: 500,
          jumlahPermintaaan: 1,
          estimatePrice: CalculatePrice(500),
          estimatePriceTotal: CalculatePrice(500),
        },
      ],
      totalAmount: currentInvoice?.totalAmount || 0,
    }),
    [currentInvoice]
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = handleSubmit(async (data) => {
    loadingSend.onTrue();

    const bodies = data.items.map((item) => ({
      dueDate: data.dueDate,
      berat: item.berat,
      jumlah: item.jumlahPermintaaan,
      status: 'Ditunda',
      jenisBreed: item.jenisBreed,
      createdBy: user.id,
      peternakan: data.invoiceTo.id,
    }));

    try {
      await Promise.all(
        bodies.map(async (body) => {
          const { id } = await useCreateData('permintaanTernak', body);
          await useCreateData('notifications', {
            name: 'Permintaan Masuk',
            message: `Permintaan Ternak dari ${user.name} memerlukan konfirmasi`,
            permintaanTernak: id,
            wholesaler: user.id,
            peternakan: data.invoiceTo.id,
          });
        })
      );

      enqueueSnackbar('Permintaan berhasil ditambahkan', { variant: 'success' });
      reset();
      loadingSend.onFalse();
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Gagal menambahkan permintaan', { variant: 'error' });
      loadingSend.onFalse();
    }
  });

  return (
    <>
      <FormProvider methods={methods}>
        <Card>
          <PembelianNewEditAddress />

          <PermintaanNewEditDueDate />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <PembelianNewEditDetails />
        </Card>

        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          {/* <LoadingButton
              color="inherit"
              size="large"
              variant="outlined"
              disabled={page === 0}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Sebelumnya
            </LoadingButton> */}

          <LoadingButton
            size="large"
            variant="contained"
            color="primary"
            loading={loadingSend.value && isSubmitting}
            onClick={handleCreateAndSend}
          >
            Tambah Permintaan
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
}

PermintaanNewEditForm.propTypes = {
  currentInvoice: PropTypes.object,
};
