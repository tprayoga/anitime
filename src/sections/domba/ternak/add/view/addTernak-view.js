'use client';

import React, { useCallback, useState } from 'react';

import { _roles, _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { Button, Container, IconButton, Link, Stack, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFAutocomplete, RHFTextField, RHFUploadField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const listJenisHewan = [
  { label: 'Domba Garut', value: 'Domba Garut' },
  {
    label: 'Domba Merino',
    value: 'Domba Merino',
  },
  { label: 'Domba Suffolk', value: 'Domba Suffolk' },
];

const listJenisBreed = [
  { label: 'Sapi Potong', value: 'Sapi Potong' },
  { label: 'Sapi Perah', value: 'Sapi Perah' },
];

const listJenisKelamin = [
  { label: 'Jantan', value: 'Jantan' },
  { label: 'Betina', value: 'Betina' },
];

const listBcs = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];

const listKandang = [
  { label: 'Kandang 1', value: 'Kandang 1' },
  { label: 'Kandang 2', value: 'Kandang 2' },
  { label: 'Kandang 3', value: 'Kandang 3' },
  { label: 'Kandang 4', value: 'Kandang 4' },
  { label: 'Kandang 5', value: 'Kandang 5' },
];

const defaultValues = {
  jenisHewan: 'Domba Garut',
  sertifikatSni: '',
  breedHewan: 'Sapi Potong',
  jenisKelamin: 'Jantan',
  tanggalLahir: '2023-02-25',
  usia: '',
  bcs: '4',
  beratBadan: '',
  kandang: 'Kandang 1',
  asalPeternakan: '',
};

const FormSchema = Yup.object().shape({
  jenisHewan: Yup.string().required('Jenis Hewan harus diisi'),
  // sertifikatSni: Yup.string().required('Sertifikat SNI harus diisi'),
  breedHewan: Yup.string().required('Breed Hewan harus diisi'),
  jenisKelamin: Yup.string().required('Jenis Kelamin harus diisi'),
  tanggalLahir: Yup.string().required('Tanggal Lahir harus diisi'),
  usia: Yup.string().required('Usia harus diisi'),
  bcs: Yup.string().required('Silahkan pilih BCS'),
  beratBadan: Yup.string().required('Berat Badan harus diisi'),
  kandang: Yup.string().required('Silahkan pilih Kandang'),
  asalPeternakan: Yup.string().required('Asal Peternakan harus diisi'),
});

export default function AddTernakView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [sertifikatSni, setSertifikatSni] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit((data) => {
    setLoadingSubmit(true);

    setTimeout(() => {
      setLoadingSubmit(false);
      enqueueSnackbar(data.jenisHewan + ' ditambahkan.', { variant: 'success' });
      reset();
    }, 1500);
    console.log(data);
  });

  const handleChangeFile = (e, setFile) => {
    console.log('masuk');
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    // Check if the file size is within the allowed limit (2 MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeInBytes) {
      alert('File size exceeds the maximum limit of 5 MB');
      e.target.value = null; // Reset the input
      setFile(null); // Clear the file state
      return;
    }

    setValue(name, file);
    setFile({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const renderFile = useCallback(
    ({ file, preview }, setFile) => {
      return (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            py: 1,
            pl: 2,
            border: (theme) => `1px dashed ${theme.palette.text.disabled}`,
            borderRadius: 1,
            backgroundColor: 'background.neutral',
            width: { xs: '100%', lg: '78%' },
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" noWrap>
            <span>
              <Link href={preview} target="_blank" variant="subtitle2">
                {file.name}
              </Link>
            </span>
          </Typography>
          <IconButton
            onClick={() => {
              console.log('clicked');
              // setValue(name, null); // Reset the input
              setFile(null);
            }}
          >
            <Iconify icon="mdi:close" />
          </IconButton>
        </Stack>
      );
    },
    [sertifikatSni]
  );

  const renderFormField = (
    <Stack spacing={4}>
      <Stack
        spacing={3}
        sx={{
          maxWidth: { xs: '100%', lg: '60%' },
        }}
      >
        <RHFAutocomplete
          label="Jenis Hewan"
          name="jenisHewan"
          options={listJenisHewan}
          onChange={(_, { value }) => {
            setValue('jenisHewan', value);
          }}
        />

        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{ overflow: 'hidden', flexDirection: { xs: 'column', lg: 'row' } }}
          width={1}
        >
          {sertifikatSni && renderFile(sertifikatSni, setSertifikatSni)}
          <label htmlFor="sertifikatSni" style={{ width: '100%' }}>
            <input
              id="sertifikatSni"
              name="sertifikatSni"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                console.log('mauk1');
                handleChangeFile(e, setSertifikatSni);
              }}
              accept="image/*,application/pdf"
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<Iconify icon="ion:attach" width={20} />}
              fullWidth
              sx={{
                paddingY: 1.8,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                Full Blood Certificate Number/ Sertifikat SNI
              </Typography>
            </Button>
          </label>
        </Stack>

        <RHFAutocomplete
          label="Breed Hewan"
          name="breedHewan"
          options={listJenisBreed}
          onChange={(_, { value }) => {
            setValue('breedHewan', value);
          }}
        />

        <RHFAutocomplete
          label="Jenis Kelamin"
          name="jenisKelamin"
          options={listJenisKelamin}
          onChange={(_, { value }) => {
            setValue('jenisKelamin', value);
          }}
        />

        <RHFTextField label="Tanggal Lahir" name="tanggalLahir" type="date" placeholder="" />

        <RHFTextField label="Usia" name="usia" />

        <RHFAutocomplete
          label="BCS"
          name="bcs"
          options={listBcs}
          onChange={(_, { value }) => {
            setValue('bcs', value);
          }}
        />

        <RHFTextField label="Berat Badan Ternak Harian" name="beratBadan" type="number" />

        <RHFAutocomplete
          label="Kandang"
          name="kandang"
          options={listKandang}
          onChange={(_, { value }) => {
            setValue('kandang', value);
          }}
        />

        <RHFTextField label="Asal Peternakan" name="asalPeternakan" fullWidth />
      </Stack>

      <Stack direction="row" justifyContent="end" spacing={2}>
        <Button
          type="button"
          variant="outlined"
          sx={{
            py: 1,
            width: { xs: '100%', lg: '150px' },
          }}
          onClick={() => router.back()}
        >
          Batal
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          type="submit"
          loading={loadingSubmit}
          sx={{
            py: 1,
            width: { xs: '100%', lg: '150px' },
          }}
        >
          Tambah
        </LoadingButton>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Tambah Ternak
        </Typography>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          {renderFormField}
        </FormProvider>
      </Container>
    </>
  );
}
