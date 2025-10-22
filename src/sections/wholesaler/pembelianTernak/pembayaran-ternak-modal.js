import ModalWholesaler from '../components/modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, IconButton, InputAdornment, Link, Stack, Typography } from '@mui/material';
import {
  RHFAutocomplete,
  RHFMultiSelect,
  RHFRadioGroup,
  RHFTextField,
} from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import Iconify from 'src/components/iconify';
import React, { useCallback, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { NumericFormatCustom } from '../components/numberFormat';

const defaultValues = {
  harga: '',
  metodePembayaran: 'Tunai',
};

const FormSchema = Yup.object().shape({
  harga: Yup.string().required('Harga harus diisi'),
  metodePembayaran: Yup.string().required('Metode Pembayaran harus dipilih'),
});

export default function PembayaranTernakModal({
  open,
  close,
  onSubmitData,
  metodePembayaranOptions = [],
  data,
  handleBack = () => {},
  loadingSubmit,
}) {
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues: data || defaultValues,
  });

  const { handleSubmit, setValue } = methods;

  const onSubmit = handleSubmit((data) => {
    onSubmitData(data);
  });

  const [harga, setHarga] = useState('');

  const handleChange = (event) => {
    setHarga(event.target.value);
    setValue('harga', event.target.value);
  };

  return (
    <ModalWholesaler
      open={open}
      close={close}
      title="Pembayaran"
      buttonText="Tambah"
      maxWidth="xs"
      //
      isForm
      methods={methods}
      onSubmit={onSubmit}
      onClickBack={handleBack}
      loadingSubmit={loadingSubmit}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <RHFTextField
            name="harga"
            label="Harga"
            // type="number"
            InputProps={{
              inputComponent: NumericFormatCustom,
              startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
            }}
            value={harga}
            onChange={handleChange}
            id="formatted-numberformat-input"
          />
        </Stack>
        <Stack>
          <Typography variant="caption" sx={{ color: 'text.primary', pl: 1 }}>
            Metode Pembayaran
          </Typography>

          <RHFRadioGroup
            row
            name="metodePembayaran"
            spacing={2}
            size="small"
            sx={{ fontSize: 12, pl: 1 }}
            options={metodePembayaranOptions}
          />
        </Stack>
      </Stack>
    </ModalWholesaler>
  );
}
