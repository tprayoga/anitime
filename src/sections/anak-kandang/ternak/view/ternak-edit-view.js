'use client';

import { useTheme } from "@emotion/react";
import { LoadingButton } from "@mui/lab";
import { Button, Card, CardContent, Divider, Grid, InputAdornment, MenuItem, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { useSettingsContext } from "src/components/settings";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import RHFDatePicker from "src/components/hook-form/rhf-datepicker";
import { useGetJenisHewan } from "src/api/anak-kandang/jenis-hewan";
import { useGetJenisKelamin } from "src/api/anak-kandang/jenis-kelamin";
import { useGetJenisBreed } from "src/api/anak-kandang/jenis-breed";
import { useGetBodyConditionalScore } from "src/api/anak-kandang/body-conditional-score";
import { useCreateTernak, useFindTernak, useUpdateTernak } from "src/api/anak-kandang/ternak";
import { enqueueSnackbar } from "notistack";
import { useGetKandang, useUpdateKandang } from "src/api/anak-kandang/kandang";
import { useAuthContext } from "src/auth/hooks";
import { paths } from "src/routes/paths";
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from "src/hooks/use-boolean";
import BCSModal from "src/components/modal/bcsModal";

const LOKASI_FID_OPTIONS = [
  'Telinga Kiri',
  'Telinga Kanan',
]

export default function TernakEditView({ id }) {

  const settings = useSettingsContext();
  const router = useRouter();
  const user = useAuthContext();

  const { dataJenisHewan, getJenisHewan } = useGetJenisHewan();
  const { dataJenisKelamin, getJenisKelamin } = useGetJenisKelamin();
  const { dataJenisBreed, getJenisBreed } = useGetJenisBreed();
  const { dataBCS, getBCS } = useGetBodyConditionalScore();

  const { data: dataKandang, getFullKandang } = useGetKandang();
  const { data: dataTernak, findTernak } = useFindTernak();
  const { updateTernak } = useUpdateTernak();

  const openBCSModal = useBoolean();


  const [umur, setUmur] = useState({
    label: '',
    value: '',
  });

  useEffect(() => {
    getFullKandang();
    getJenisHewan();
    getJenisKelamin();
    getJenisBreed();
    getBCS();
    findTernak(id)
  }, [])

  useEffect(() => {
    if (dataTernak) {

      const newValue = ({
        noFID: dataTernak.noFID,
        lokasi: dataTernak.lokasi,
        jenisHewan: dataTernak.jenisHewan,
        jenisKelamin: dataTernak.jenisKelamin,
        jenisBreed: dataTernak.jenisBreed,
        warna: dataTernak.warna,
        bodyConditionalScore: dataTernak.bodyConditionalScore,
        berat: dataTernak.berat,
        tanggalLahir: new Date(dataTernak.tanggalLahir),
        asalPeternakan: dataTernak.asalPeternakan,
        RFID: dataTernak.RFID,
        idPKH: dataTernak.idPKH
      })

      reset(newValue);
    }
  }, [dataTernak])

  const calculateAge = () => {
    const tanggalLahir = getValues('tanggalLahir');
    if (tanggalLahir) {
      const dateOfBirth = new Date(tanggalLahir);
      const today = new Date();

      const ageDiffInMilliseconds = today - dateOfBirth;

      const ageDiffInSeconds = ageDiffInMilliseconds / 1000;

      const ageYears = Math.floor(ageDiffInSeconds / (365.25 * 24 * 60 * 60));
      const ageMonths = Math.floor((ageDiffInSeconds % (365.25 * 24 * 60 * 60)) / (30.44 * 24 * 60 * 60));
      const ageDays = Math.floor((ageDiffInSeconds % (30.44 * 24 * 60 * 60)) / (24 * 60 * 60));

      const totalAgeDays = ageYears * 365 + ageMonths * 30 + ageDays;

      setUmur({
        label: `${ageYears} tahun ${ageMonths} bulan ${ageDays} hari`,
        value: totalAgeDays,
      })

    }
  };

  const informasiDasarSection = (
    <>
      <Typography sx={{ fontWeight: 'medium', mb: 2 }} variant="h5">
        Informasi Dasar
      </Typography>
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12}>
          <RHFTextField name="noFID" label="No FID" />
        </Grid>
        <Grid item sm={6} xs={12}>
          <RHFSelect name="lokasi" label="Lokasi">
            {LOKASI_FID_OPTIONS.map((options) => (
              <MenuItem value={options} key={options}>{options}</MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={12}>
          <RHFSelect name="jenisHewan" label="Jenis Hewan">
            {dataJenisHewan?.map((options) => (
              <MenuItem value={options.name} key={options.name}>{options.name}</MenuItem>
            ))}
          </RHFSelect>
        </Grid>
      </Grid>
    </>
  )
  const physicalCharacteristicSection = (
    <>
      <Typography sx={{ fontWeight: 'medium', my: 2 }} variant="h5">
        Physical Characteristic
      </Typography>
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12}>
          <RHFSelect name="jenisKelamin" label="Jenis Kelamin">
            {dataJenisKelamin?.map((options) => (
              <MenuItem value={options.name} key={options.name}>{options.name}</MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item sm={6} xs={12}>
          <RHFSelect name="jenisBreed" label="Breed">
            {dataJenisBreed?.map((options) => (
              <MenuItem value={options.name} key={options.name}>{options.name}</MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item sm={6} xs={12} mt={3}>
          <RHFTextField name="warna" label="Warna" />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Typography
            textAlign={'right'}
            color={'primary'}
            sx={{
              '&:hover': {
                cursor: 'pointer'
              }
            }}
            onClick={() =>
              openBCSModal.onTrue()
            }
          >
            Referensi
          </Typography>
          <RHFSelect name="bodyConditionalScore" label="Body Conditional Score (BCS)">
            {dataBCS?.map((options) => (
              <MenuItem value={options.name} key={options.name}>{options.name}</MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={12}>
          <RHFTextField
            name="berat"
            label="Berat"
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  Kg
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </>
  )
  const informasiKelahiranSection = (
    <>
      <Typography sx={{ fontWeight: 'medium', my: 2 }} variant="h5">
        Informasi Kelahiran
      </Typography>
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12}>
          <RHFDatePicker name="tanggalLahir" label="Tanggal Lahir" sx={{ width: "100%" }} disableFuture />
          <Typography sx={{ mt: 1 }} typography={'body2'}>Umur : {umur.label}</Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          <RHFTextField name="asalPeternakan" label="Asal Peternakan" />
        </Grid>
      </Grid>
    </>
  )
  const informasiTambahanSection = (
    <>
      <Typography sx={{ fontWeight: 'medium', my: 2 }} variant="h5">
        Informasi Tambahan
      </Typography>
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12}>
          <RHFTextField name="RFID" label="RFID" />
        </Grid>
        <Grid item sm={6} xs={12}>
          <RHFTextField name="idPKH" label="ID PKH" />
        </Grid>
      </Grid>
    </>
  )

  const schema = Yup.object().shape({
    noFID: Yup.string().required('No FID Wajib Diisi'),
    lokasi: Yup.string().required('Lokasi Wajib Diisi'),
    jenisHewan: Yup.string().required('Jenis Hewan Wajib Diisi'),
    jenisKelamin: Yup.string().required('Jenis Kelamin Wajib Diisi'),
    jenisBreed: Yup.string().required('Jenis Breed Wajib Diisi'),
    warna: Yup.string().required('Warna Wajib Diisi'),
    bodyConditionalScore: Yup.string().required('Body Conditional Score Wajib Diisi'),
    berat: Yup.number()
      .required('Berat Wajib Diisi')
      .min(1, 'Berat wajib lebih dari 0'),
    tanggalLahir: Yup.date().required('Tanggal Lahir Wajib Diisi'),
    asalPeternakan: Yup.string().required('Asal Peternakan Wajib Diisi'),
    RFID: Yup.string().required('RFID Wajib Diisi'),
    idPKH: Yup.string().required('ID PKH Wajib Diisi'),
  });

  const defaultValues = {
    noFID: '',
    lokasi: '',
    jenisHewan: '',
    jenisKelamin: '',
    jenisBreed: '',
    warna: '',
    bodyConditionalScore: '',
    berat: 0,
    tanggalLahir: null,
    asalPeternakan: '',
    RFID: '',
    idPKH: ''
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
    setValue,
    getValues

  } = methods;

  const watchTanggalLahir = watch('tanggalLahir');

  useEffect(() => {
    calculateAge();
  }, [watchTanggalLahir])

  const onSubmit = handleSubmit(async (data) => {

    const updatedData = {
      ...data,
      kandang: dataTernak.kandang,
      peternakan: user.user.createdBy,
      umur: umur.value,
      status : 'aktif'

    }

    try {
      await updateTernak(id, updatedData)
      enqueueSnackbar('Success', { variant: 'success' });
      router.push(paths.anakKandang.ternak.root);

    } catch (error) {
      enqueueSnackbar('Failed', { variant: 'error' });
    } finally {
      reset();
    }
  });

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  {informasiDasarSection}
                  {physicalCharacteristicSection}
                  {informasiKelahiranSection}
                  {informasiTambahanSection}

                  <Box sx={{ display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: (theme) => theme.palette.text.disabled,
                      }}
                    >
                      Batal
                    </Button>
                    <LoadingButton

                      color="primary"
                      size="large"
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      + Update
                    </LoadingButton>
                  </Box>
                </FormProvider>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {openBCSModal.value &&
        <BCSModal
          open={openBCSModal.value}
          onClose={openBCSModal.onFalse}
        />
      }
    </>
  )
}