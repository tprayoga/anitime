import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, {
  RHFCheckbox,
  RHFMultiCheckbox,
  RHFSelect,
  RHFTextField,
  RHFUpload,
  RHFUploadAvatar,
  RHFUploadBox,
  RHFUploadField,
} from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import RHFDatePicker from '../../hook-form/rhf-datepicker';
import Scrollbar from '../../scrollbar';
import { useState } from 'react';
import { useCreateData } from 'src/api/custom-domba-api';
import { useSnackbar } from 'notistack';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 1000 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};
export default function RegistrasiObatModal({ open, onClose, setRefetch, ...other }) {
  const { createData: createListObat } = useCreateData();

  const schema = Yup.object().shape({
    jenisObat: Yup.string().required('Jenis Obat wajib diisi'),
    namaObat: Yup.string().required('Nama Obat wajib diisi'),
    bahanAktif: Yup.string().required('Bahan Aktif wajib diisi'),
    konsentrasiBahanAktif: Yup.number()
      .required('Konsentrasi Bahan Aktif wajib diisi')
      .min(1, 'Suhu wajib lebih dari 0'),
    merkObat: Yup.string().required('Merk Obat wajib diisi'),
    ukuranKemasan: Yup.string().required('Ukuran Kemasan wajib diisi'),
    persyaratanPenyimpanan: Yup.string().required('Persyaratan Penyimpanan wajib diisi'),
    dosis: Yup.number().required('Dosis wajib diisi').min(1, 'Suhu wajib lebih dari 0'),
    lamaPengobatan: Yup.number()
      .required('Lama Pengobatan wajib diisi')
      .min(1, 'Suhu wajib lebih dari 0'),
    intervalPengobatan: Yup.number()
      .required('Interval Pengobatan wajib diisi')
      .min(1, 'Suhu wajib lebih dari 0'),
    caraPemberian: Yup.string().required('Cara Pemberian wajib diisi'),
    peringatanKontradiksi: Yup.string().required('Peringatan wajib diisi'),
    fungsiSpesifik: Yup.string().required('Fungsi Spesifik wajib diisi'),
    satuanDosis: Yup.string().required('Satuan Dosis wajib diisi'),
    satuanLamaPengobatan: Yup.string().required('Satuan Lama Pengobatan wajib diisi'),
    satuanIntervalPengobatan: Yup.string().required('Satuan Interval Pengobatan wajib diisi'),
    tanggalKadaluarsa: Yup.date().required('Tanggal Kadaluarsa Wajib Diisi'),
    batch: Yup.string().required('Batch wajib diisi'),
  });

  const defaultValues = {
    jenisObat: '',
    namaObat: '',
    bahanAktif: '',
    konsentrasiBahanAktif: 0,
    merkObat: '',
    ukuranKemasan: '',
    persyaratanPenyimpanan: '',
    dosis: 0,
    lamaPengobatan: 0,
    intervalPengobatan: 0,
    caraPemberian: '',
    peringatanKontradiksi: '',
    fungsiSpesifik: '',
    satuanDosis: '',
    satuanLamaPengobatan: '',
    satuanIntervalPengobatan: '',
    tanggalKadaluarsa: null,
    batch: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const JENIS_OBAT_OPTIONS = [
    { label: 'Vaksin', value: 'Vaksin' },
    { label: 'Parasiticedes', value: 'Parasiticedes' },
    { label: 'Antibiotik', value: 'Antibiotik' },
    { label: 'Anti-inflammatory drugs', value: 'Anti-inflammatory drugs' },
    { label: 'Eye Preparations', value: 'Eye Preparations' },
    { label: 'Topical Wound Treatments', value: 'Topical Wound Treatments' },
  ];

  const NAMA_OBAT_OPTIONS =
    watch('jenisObat') === 'Vaksin'
      ? [
          { label: 'Vaksin PMK', value: 'Vaksin PMK' },
          { label: 'BEF (Bovine Ephemeral Fever)', value: 'BEF (Bovine Ephemeral Fever)' },
          { label: 'HS (P. Multicoda Robert type B)', value: 'HS (P. Multicoda Robert type B)' },
          { label: 'Black Quarters', value: 'Black Quarters' },
          { label: 'Anthrax', value: 'Anthrax' },
          { label: 'LSD (Lumpy Skin Disease)', value: 'LSD (Lumpy Skin Disease)' },
        ]
      : [
          { label: 'Liquid Paraffin', value: 'Liquid Paraffin' },
          { label: 'Bloat Oil (Intervet)', value: 'Bloat Oil (Intervet)' },
          { label: 'Cetrigen (Fly Repellent)', value: 'Cetrigen (Fly Repellent)' },
          { label: 'Gusanex (Fly Repellent)', value: 'Gusanex (Fly Repellent)' },
          { label: 'Orbenin (Eye Ointment)', value: 'Orbenin (Eye Ointment)' },
          { label: 'Bicarbonate of Soda', value: 'Bicarbonate of Soda' },
          { label: 'Cuka', value: 'Cuka' },
          { label: 'Garam Epsom', value: 'Garam Epsom' },
          { label: 'Alkohol 70%', value: 'Alkohol 70%' },
          { label: 'Larutan Povidone Iodine 1%', value: 'Larutan Povidone Iodine 1%' },
          { label: 'Disinfektan Klorheksidin 0.5%', value: 'Disinfektan Klorheksidin 0.5%' },
          {
            label: 'Short Acting Penicillin (Broad Spectrum)',
            value: 'Short Acting Penicillin (Broad Spectrum)',
          },
          { label: 'Ocytetracycline inj', value: 'Ocytetracycline inj' },
          { label: 'Trimethoprim /Trisoprim', value: 'Trimethoprim /Trisoprim' },
          { label: 'Tilmikosin (respiratory-AB)', value: 'Tilmikosin (respiratory-AB)' },
          {
            label: 'Flunixin (Anti-inflamasi non-steroid)',
            value: 'Flunixin (Anti-inflamasi non-steroid)',
          },
          { label: 'Ketoprofen', value: 'Ketoprofen' },
          { label: 'Kortikosteroid Inj', value: 'Kortikosteroid Inj' },
          { label: 'Calcigol Plus 500 mL', value: 'Calcigol Plus 500 mL' },
        ];

  const PERSYARATAN_PENYIMPANAN_OPTIONS = [
    { label: 'Air Conditioning', value: 'Air Conditioning' },
    { label: 'Refrigeration', value: 'Refrigeration' },
  ];

  const CARA_PEMBERIAN_OPTIONS = [
    { label: 'Intramuscular', value: 'Intramuscular' },
    { label: 'Subcutaneous SC', value: 'Subcutaneous SC' },
    { label: 'Intravenous IV', value: 'Intravenous IV' },
    { label: 'Topical', value: 'Topical' },
  ];

  const { enqueueSnackbar } = useSnackbar();

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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Registrasi Obat</Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RHFSelect name="jenisObat" label="Jenis Obat">
        {JENIS_OBAT_OPTIONS.map((data) => (
          <MenuItem value={data.value}>{data.label}</MenuItem>
        ))}
      </RHFSelect>
      <RHFSelect name="namaObat" label="Nama Obat">
        {NAMA_OBAT_OPTIONS.map((data) => (
          <MenuItem value={data.value}>{data.label}</MenuItem>
        ))}
      </RHFSelect>
      <RHFTextField name="bahanAktif" label="Bahan Aktif" />
      <RHFTextField name="konsentrasiBahanAktif" label="Konsentrasi Bahan Aktif" type={'number'} />
      <RHFTextField name="merkObat" label="Merk Obat" />
      <RHFTextField name="ukuranKemasan" label="Ukuran Kemasan" />
      <RHFSelect name="persyaratanPenyimpanan" label="Persyaratan Penyimpanan">
        {PERSYARATAN_PENYIMPANAN_OPTIONS.map((data) => (
          <MenuItem value={data.value}>{data.label}</MenuItem>
        ))}
      </RHFSelect>
      <Stack
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 3, sm: 1 },
        }}
      >
        <RHFTextField name="dosis" label="Dosis" type={'number'} />
        <RHFSelect
          name="satuanDosis"
          label="Satuan Dosis"
          sx={{
            width: { xs: '100%', sm: '45%' },
          }}
        >
          <MenuItem value={'ml/kg BB'}>ml/kg BB</MenuItem>
          <MenuItem value={'ml/100 kg BB'}>ml/100 kg BB</MenuItem>
          <MenuItem value={'ml/cow'}>ml/cow</MenuItem>
          <MenuItem value={'tab/ kg BB'}>tab/ kg BB</MenuItem>
        </RHFSelect>
      </Stack>

      <Stack
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 3, sm: 1 },
        }}
      >
        <RHFTextField name="lamaPengobatan" label="Lama Pengobatan" type={'number'} />
        <RHFSelect
          name="satuanLamaPengobatan"
          label="Satuan Lama Pengobatan"
          sx={{
            width: { xs: '100%', sm: '45%' },
          }}
        >
          <MenuItem value={'hari'}>Hari</MenuItem>
          <MenuItem value={'minggu'}>Minggu</MenuItem>
        </RHFSelect>
      </Stack>

      <Stack
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 3, sm: 1 },
        }}
      >
        <RHFTextField name="intervalPengobatan" label="Interval Pengobatan" type={'number'} />
        <RHFSelect
          name="satuanIntervalPengobatan"
          label="Satuan Interval Pengobatan"
          sx={{
            width: { xs: '100%', sm: '45%' },
          }}
        >
          <MenuItem value={'hari'}>Hari</MenuItem>
          <MenuItem value={'minggu'}>Minggu</MenuItem>
        </RHFSelect>
      </Stack>

      <RHFSelect name="caraPemberian" label="Cara Pemberian">
        {CARA_PEMBERIAN_OPTIONS.map((data) => (
          <MenuItem value={data.value}>{data.label}</MenuItem>
        ))}
      </RHFSelect>
      <RHFTextField name="peringatanKontradiksi" label="Peringatan Kontradiksi" />
      <RHFTextField name="fungsiSpesifik" label="Fungsi Spesifik" />
      <RHFDatePicker
        name="tanggalKadaluarsa"
        label="Tanggal Kadaluarsa"
        sx={{ width: '100%' }}
        disablePast
      />
      <RHFTextField name="batch" label="Batch" />
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={4} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <LoadingButton color="primary" variant="contained" type="submit" loading={isSubmitting}>
        Tambah
      </LoadingButton>
    </Box>
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = {
        ...data,
        stok: 0,
      };
      await createListObat(body, 'listObat');
      enqueueSnackbar('Success', { variant: 'success' });
      onClose();
      reset();
      setRefetch((x) => !x);
    } catch (error) {
      enqueueSnackbar('Failed', { variant: 'error' });
    }
  });

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
