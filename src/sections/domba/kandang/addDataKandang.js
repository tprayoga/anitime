import ModalDomba from '../components/modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, IconButton, Link, Stack, Typography } from '@mui/material';
import {
  RHFAutocomplete,
  RHFMultiSelect,
  RHFRadioGroup,
  RHFTextField,
} from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import Iconify from 'src/components/iconify';
import React, { useCallback, useState } from 'react';

const selectOptionJenisHewan = [
  { label: 'Sapi Potong', value: 'Sapi Potong' },
  { label: 'Sapi Perah', value: 'Sapi Perah' },
];

const defaultValues = {
  namaKandang: '',
  luasKandang: '',
  jenisHewan: 'Sapi Potong',
  jumlahHewan: '',
  jumlahJantan: '',
  jumlahBetina: '',
};

const FormSchema = Yup.object().shape({
  namaKandang: Yup.string().required('Nama Kandang harus diisi'),
  luasKandang: Yup.string().required('Luas Kandang harus diisi'),
  jenisHewan: Yup.string().required('Jenis Hewan harus diisi'),
  jumlahHewan: Yup.string().required('Jumlah Hewan harus diisi'),
  //   jumlahJantan: Yup.string().required('Jumlah Jantan harus diisi'),
  //   jumlahBetina: Yup.string().required('Jumlah Betina harus diisi'),
});

export default function AddDataKandangModal({
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

  const { handleSubmit, setValue, reset } = methods;

  const onSubmit = handleSubmit((data) => {
    onSubmitData(data, reset);
  });

  return (
    <ModalDomba
      open={open}
      close={close}
      title="Input Data"
      buttonText="Tambah"
      maxWidth="xs"
      //
      isForm
      methods={methods}
      onSubmit={onSubmit}
      loadingSubmit={loadingSubmit}
    >
      <Stack spacing={2}>
        <RHFTextField label="Nama Kandang" name="namaKandang" />
        <RHFTextField label="Luas Kandang" name="luasKandang" />
        <RHFAutocomplete
          label="Jenis Hewan"
          name="jenisHewan"
          options={selectOptionJenisHewan}
          onChange={(_, { value }) => {
            setValue('jenisHewan', value);
          }}
        />
        <RHFTextField label="Jumlah Hewan" name="jumlahHewan" type="number" />

        <Stack spacing={2} direction="row">
          <RHFTextField label="Jumlah Jantan" name="jumlahJantan" type="number" />
          <RHFTextField label="Jumlah Betina" name="jumlahBetina" type="number" />
        </Stack>
      </Stack>
    </ModalDomba>
  );
}
