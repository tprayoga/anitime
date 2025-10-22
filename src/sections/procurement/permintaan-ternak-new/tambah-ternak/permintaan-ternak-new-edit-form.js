import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { _addressBooks } from 'src/_mock';

import FormProvider from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';

import PembelianNewEditAddress from './permintaan-ternak-new-edit-address';
import PembelianNewEditDetails from './permintaan-ternak-new-edit-details';
import { useAuthContext } from 'src/auth/hooks';
import { Divider } from '@mui/material';
import PermintaanNewEditDueDate from './permintaan-ternak-new-edit-due-date';
import { CalculatePrice } from 'src/components/calculatePrice';
import { LoadingScreen } from 'src/components/loading-screen';
import useUpdateData from 'src/api/update';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import useCreateData from 'src/api/create';

// ----------------------------------------------------------------------

export default function PermintaanTernakNewEditForm({ currentPermintaan }) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const loadingSave = useBoolean();
  const loadingSend = useBoolean();

  const NewInvoiceSchema = Yup.object().shape({
    items: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          rfid: Yup.string().required('RFID harus dipilih.'),
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

  const currentTernak = useMemo(() => {
    const curData = currentPermintaan?.expand?.ternak?.map((item) => ({
      id: item.id,
      rfid: item.RFID,
      kandang: item?.expand?.kandang?.namaKandang || '',
      jenisBreed: item.jenisBreed,
      berat: item.berat,
      jumlahPermintaaan: item.jumlah,
      estimatePrice: CalculatePrice(item.berat),
      estimatePriceTotal: CalculatePrice(item.berat),
      isDeclined: item.isDeclined,
    })) || [
      {
        id: '',
        rfid: '',
        jenisBreed: currentPermintaan?.jenisBreed || '',
        kandang: '',
        berat: 0,
        jumlahPermintaaan: 1,
        estimatePrice: CalculatePrice(0),
        estimatePriceTotal: CalculatePrice(0),
        isDeclined: false,
      },
    ];

    return curData;
  }, [currentPermintaan]);

  const defaultValues = useMemo(
    () => ({
      createDate: new Date(currentPermintaan?.created),
      dueDate: new Date(currentPermintaan?.dueDate),
      taxes: 0,
      status: currentPermintaan?.status || 'Ditunda',
      wholesaler: currentPermintaan?.expand?.createdBy || {},
      peternakan: currentPermintaan?.expand?.peternakan || {},
      jenisBreed: currentPermintaan?.jenisBreed || '',
      berat: currentPermintaan?.berat || 0,
      jumlahPermintaaan: currentPermintaan?.jumlah || 0,
      items: currentTernak,

      totalAmount: 0,
    }),
    [currentPermintaan, currentTernak]
  );

  const methods = useForm({
    resolver: yupResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setError,
  } = methods;

  const values = watch();

  const handleTambahTernak = handleSubmit(async (data) => {
    loadingSend.onTrue();

    const ternak = data.items.map((item) => item.id);
    const filterTernak =
      currentPermintaan?.expand?.ternak?.filter((item) => ternak.includes(item.id)) || [];
    const filterOldTernak = filterTernak.map((item) => item.id) || [];

    const filteredDeclined =
      currentPermintaan?.expand?.ternak?.filter((item) => item.isDeclined) || [];

    const isBooked = filterTernak.some((ternak) => ternak.status === 'booked');
    const filterBookedRfid = filterTernak.filter((ternak) => ternak.status === 'booked');
    const bookedIndexs = filterBookedRfid.map((item) =>
      data.items.findIndex((ternak) => ternak.rfid === item.RFID)
    );

    const findDuplicateRFID = findDuplicateRFIDs(data.items);

    console.log({ data });

    if (isBooked) {
      bookedIndexs.forEach((index) => {
        setError(`items[${index}].rfid`, {
          type: 'manual',
          message: 'Ternak yang dipilih sudah dibooking',
        });
      });
      enqueueSnackbar('Beberapa ternak sudah dibooking', { variant: 'error' });
      loadingSend.onFalse();
      return;
    } else if (findDuplicateRFID.length > 0) {
      findDuplicateRFID.forEach((index) => {
        setError(`items[${index}].rfid`, {
          type: 'manual',
          message: 'RFID tidak boleh sama',
        });
      });
      enqueueSnackbar('Beberapa RFID telah digunakan', { variant: 'error' });
      loadingSend.onFalse();
      return;
    }

    try {
      // change status to declined
      await Promise.all(
        filteredDeclined.map(async (item) => {
          await useUpdateData('ternak', item.id, { isDeclined: false });
        })
      );

      // change status to booked
      if (filterOldTernak.length > 0) {
        await Promise.all(
          filterOldTernak.map(async (id) => {
            await useUpdateData('ternak', id, { isDeclined: false, status: 'booked' });
          })
        );
      } else {
        await Promise.all(
          data.items.map(async ({ id }) => {
            await useUpdateData('ternak', id, { isDeclined: false, status: 'booked' });
          })
        );
      }

      await useUpdateData('permintaanTernak', currentPermintaan.id, {
        ternak,
        status: 'Ditinjau',
      });

      await useCreateData('notifications', {
        name: 'Perlu peninjauan',
        message: `Permintaan Ternak ${currentPermintaan.id} memerlukan peninjauan lebih lanjut`,
        permintaanTernak: currentPermintaan.id,
        peternakan: currentPermintaan.peternakan,
      });

      enqueueSnackbar('Permintaan ternak akan ditinjau', { variant: 'success' });
      loadingSave.onFalse();
      router.push(paths.procurement.permintaanTernak.root);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Gagal menyimpan permintaan sebagai draft', { variant: 'error' });
      loadingSave.onFalse();
    }
  });

  const handleSaveAsDraft = handleSubmit(async (data) => {
    loadingSave.onTrue();

    const ternak = data.items.map((item) => item.id);

    try {
      await useUpdateData('permintaanTernak', currentPermintaan.id, {
        ternak,
      });

      enqueueSnackbar('Permintaan berhasil disimpan sebagai draft', { variant: 'success' });
      loadingSave.onFalse();
      console.info('DATA', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Gagal menyimpan permintaan sebagai draft', { variant: 'error' });
      loadingSave.onFalse();
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
            color="inherit"
            size="large"
            variant="outlined"
            loading={loadingSave.value && isSubmitting}
            onClick={handleSaveAsDraft}
          >
            Simpan Sebagai Draft
          </LoadingButton>
          <LoadingButton
            size="large"
            variant="contained"
            color="primary"
            loading={loadingSend.value && isSubmitting}
            onClick={handleTambahTernak}
            disabled={
              values.items.length < currentPermintaan.jumlah ||
              values.items.some((item) => item.isDeclined)
            }
          >
            Tambah Permintaan
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
}

PermintaanTernakNewEditForm.propTypes = {
  currentPermintaan: PropTypes.object,
};

const findDuplicateRFIDs = (data) => {
  const rfidMap = {};
  const duplicateIndices = [];

  data.forEach((entry, index) => {
    const rfid = entry.rfid;
    if (rfid in rfidMap) {
      // If RFID is already in the map, add both the existing index and the current index to the result if not already added
      if (!duplicateIndices.includes(rfidMap[rfid])) {
        duplicateIndices.push(rfidMap[rfid]);
      }
      duplicateIndices.push(index);
    } else {
      rfidMap[rfid] = index;
    }
  });

  return duplicateIndices;
};
