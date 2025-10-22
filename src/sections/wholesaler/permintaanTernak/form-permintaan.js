import ModalWholesaler from '../components/modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, IconButton, InputAdornment, Link, Stack, Typography } from '@mui/material';
import { RHFAutocomplete, RHFMultiCheckbox, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import Iconify from 'src/components/iconify';
import { useCallback, useState } from 'react';
import { NumericFormatCustom } from '../components/numberFormat';

const defaultValues = {
  jenisBreed: [],
  breedLainnya: '',
  berat: '',
  jumlah: '',
};

const FormSchema = Yup.object().shape({
  jenisBreed: Yup.array().min(1, 'Pilih jenis breed'),
  berat: Yup.number().required('Berat harus diisi').min(1, 'Berat harus diisi'),
  jumlah: Yup.number().required('Jumlah harus diisi').min(1, 'Jumlah harus diisi'),
});

export default function FormPermintaan({
  open,
  close,
  onSubmitData,
  //
  listJenisBreed,
  loadingSubmit,
}) {
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
  } = methods;

  const isLainnya = watch('jenisBreed').includes('Lainnya');
  const isLainnyaEmpty = watch('breedLainnya').length === 0 && isLainnya;

  const onSubmit = handleSubmit((data) => {
    if (isLainnyaEmpty) {
      return;
    }
    onSubmitData(data, reset);
  });

  return (
    <ModalWholesaler
      open={open}
      close={close}
      title="Form Permintaan"
      buttonText="Kirim"
      //
      isForm
      methods={methods}
      onSubmit={onSubmit}
      loadingSubmit={loadingSubmit}
    >
      <Stack spacing={2}>
        <Stack spacing={1}>
          <RHFMultiCheckbox
            row
            name="jenisBreed"
            label={
              <>
                Jenis Breed <sup>*</sup>
              </>
            }
            spacing={4}
            options={listJenisBreed}
            sx={{
              display: 'grid',
              gridColumn: { sm: 9, md: 12 },
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              marginTop: 1,
              gridColumnGap: 40,
            }}
          />
          {isLainnya && (
            <RHFTextField
              name="breedLainnya"
              label="Lainnya *"
              error={isLainnyaEmpty}
              helperText={isLainnyaEmpty ? 'Jenis breed lainnya harus diisi' : ''}
            />
          )}
        </Stack>

        <Stack marginTop={4} spacing={2}>
          <RHFTextField
            name="berat"
            type="number"
            label={
              <>
                Berat <sup>*</sup>
              </>
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            }}
          />

          <RHFTextField
            name="jumlah"
            type="number"
            label={
              <>
                Jumlah Permintaan <sup>*</sup>
              </>
            }
          />
        </Stack>
      </Stack>
    </ModalWholesaler>
  );
}
