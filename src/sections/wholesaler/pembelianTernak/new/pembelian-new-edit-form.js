import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { _addressBooks } from 'src/_mock';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

import PembelianNewEditAddress from './pembelian-new-edit-address';
import PembelianNewEditStatusPengiriman from './pembelian-new-edit-status-pengiriman';
import PembelianNewEditDetails from './pembelian-new-edit-details';
import { useAuthContext } from 'src/auth/hooks';
import { randomInv } from '../../components/randomInv';
import PembelianNewEditPembayaran from './pembelian-new-edit-pembayaran';

// ----------------------------------------------------------------------

export default function PembelianNewEditForm({ currentInvoice }) {
  const router = useRouter();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const loadingSave = useBoolean();

  const loadingSend = useBoolean();

  const [page, setPage] = useState(0);
  const [dataPembelian, setDataPembelian] = useState({});

  const NewInvoiceSchema = Yup.object().shape({
    invoiceTo: Yup.mixed().nullable().required('Pilih Peternakan.'),
    metodePengiriman: Yup.string().required('Metode Pengiriman harus diisi.'),
    tujuanPembelian: Yup.string().required('Tujuan Pembelian harus diisi.'),
    lokasiTujuan: Yup.string().required('Lokasi Tujuan harus diisi.'),
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          rfid: Yup.string().required('RFID harus diisi.'),
        })
      )
    ),
    // not required
    taxes: Yup.number(),
    status: Yup.string(),
    discount: Yup.number(),
    shipping: Yup.number(),
    wholesaler: Yup.mixed(),
    totalAmount: Yup.number(),
    invoiceNumber: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      invoiceNumber: currentInvoice?.invoiceNumber || randomInv(),
      taxes: currentInvoice?.taxes || 0,
      shipping: currentInvoice?.shipping || 0,
      status: currentInvoice?.status || 'draft',
      discount: currentInvoice?.discount || 0,
      wholesaler: currentInvoice?.wholesaler || user,
      invoiceTo: currentInvoice?.invoiceTo || null,
      metodePengiriman: currentInvoice?.metodePengiriman || 'Pickup',
      tujuanPembelian: currentInvoice?.tujuanPembelian || 'Perdagangan',
      lokasiTujuan: currentInvoice?.lokasiTujuan || '',
      items: currentInvoice?.items || [
        {
          rfid: '',
          idTernak: '',
          berat: '',
          bcs: '',
          petugas: '',
          harga: 0,
          jenisBreed: '',
          filteredBreed: '',
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

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPage(1);
      // reset();
      loadingSend.onFalse();
      // router.push(paths.dashboard.invoice.root);
      console.info('DATA', JSON.stringify(data, null, 2));
      setDataPembelian(data);
    } catch (error) {
      console.error(error);
      loadingSend.onFalse();
    }
  });

  return (
    <>
      {page === 0 ? (
        <FormProvider methods={methods}>
          <Card>
            <PembelianNewEditAddress />

            <PembelianNewEditStatusPengiriman />

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
              Selanjutnya
            </LoadingButton>
          </Stack>
        </FormProvider>
      ) : (
        <PembelianNewEditPembayaran
          data={dataPembelian}
          onBack={() => setPage((prev) => prev - 1)}
          resetForm={reset}
        />
      )}
    </>
  );
}

PembelianNewEditForm.propTypes = {
  currentInvoice: PropTypes.object,
};
