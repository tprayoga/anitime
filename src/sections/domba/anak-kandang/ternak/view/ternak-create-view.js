'use client';

import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Container, Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';
import RHFDatePicker from 'src/components/hook-form/rhf-datepicker';
import { enqueueSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// import { useCreateData, useGetFulLData, useUpdateData } from "src/api/custom-api";
import { useBoolean } from 'src/hooks/use-boolean';
import BCSModal from 'src/components/modal/bcsModal';
import { useCreateData, useGetData, useGetFulLData, useUpdateData } from 'src/api/custom-domba-api';
import { useDebounce } from 'src/hooks/use-debounce';
import { RHFAutocompleteCustom } from 'src/components/hook-form/rhf-autocomplete';

export default function TernakCreateView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuthContext();
  const openBCSModal = useBoolean();

  const [umur, setUmur] = useState({
    label: '',
    value: '',
  });

  const { data: dataBCS, getFullData: getBCS } = useGetFulLData();
  const { data: dataBFS, getFullData: getBFS } = useGetFulLData();
  const { data: dataJenisBreed, getFullData: getJenisBreed } = useGetFulLData();
  const { data: dataKandang, getFullData: getKandang } = useGetFulLData();

  const { data: dataPerkawinan, getData: getPerkawinan } = useGetData();
  const { createData: createTernak, error: errorTernak, loading: loadingTernak } = useCreateData();

  const {
    updateData: updateKandang,
    error: errorUpdateKandang,
    loading: loadingUpdateKandang,
  } = useUpdateData();

  const LOKASI_FID_OPTIONS = ['Telinga Kiri', 'Telinga Kanan'];
  const JENIS_HEWAN_OPTIONS = ['Kambing', 'Domba'];
  const JENIS_KELAMIN_OPTIONS = ['Jantan', 'Betina'];
  const [penOptions, setPenOptions] = useState([]);
  const [perkawinanOptions, setPerkawinanOptions] = useState([]);
  const [jantanOptions, setJantanOptions] = useState([]);
  const [betinaOptions, setBetinaOptions] = useState([]);

  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search, 200);

  const onSearch = (value) => {
    setSearch(value);
  };

  const schema = Yup.object().shape({
    noFID: Yup.string().required('No FID Wajib Diisi'),
    // lokasi: Yup.string().required('Lokasi Wajib Diisi'),
    jenisHewan: Yup.string().required('Jenis Hewan Wajib Diisi'),
    jenisKelamin: Yup.string().required('Jenis Kelamin Wajib Diisi'),
    jenisBreed: Yup.string().required('Jenis Breed Wajib Diisi'),
    bodyConditionalScore: Yup.string().required('Body Conditional Score Wajib Diisi'),
    bodyFatScore: Yup.string().required('Body Fat Score Wajib Diisi'),
    berat: Yup.number().required('Berat Wajib Diisi').min(1, 'Berat wajib lebih dari 0'),
    tanggalLahir: Yup.date().required('Tanggal Lahir Wajib Diisi'),
    // asalPeternakan: Yup.string().required('Asal Peternakan Wajib Diisi'),
    kandang: Yup.string().required('Kandang Wajib Diisi'),
    pen: Yup.string().required('Pen Wajib Diisi'),
    checkboxSilsilah: Yup.boolean(),
  });

  const defaultValues = {
    noFID: '',
    // lokasi: '',
    jenisHewan: '',
    jenisKelamin: '',
    jenisBreed: '',
    bodyConditionalScore: '',
    bodyFatScore: '',
    berat: 0,
    tanggalLahir: null,
    // asalPeternakan: '',
    kandang: '',
    pen: '',
    checkboxSilsilah: false,
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
    watch,
  } = methods;

  const watchTanggalLahir = watch('tanggalLahir');

  useEffect(() => {
    calculateAge();
  }, [watchTanggalLahir]);
  useEffect(() => {
    getJenisBreed('listBreedHewan');
    getBCS('listBCS');
    getBFS('listBFS');
    getKandang('kandang', 'pen', `peternakan = "${user.createdBy}"`);
  }, []);

  useEffect(() => {
    if (watch('kandang')) {
      const selectedKandang = dataKandang?.find((e) => e.id === watch('kandang'));
      setPenOptions(selectedKandang?.expand?.pen);
    }
  }, [watch('kandang')]);

  useEffect(() => {
    if (watch('perkawinan')) {
      // const selectedKandang = dataKandang?.find((e) => e.id === watch('kandang'));
      // setPenOptions(selectedKandang?.expand?.pen);
      const findData = dataPerkawinan?.find((e) => e.id === watch('perkawinan'));
      setJantanOptions(findData?.expand?.ternakJantan);
      setBetinaOptions(findData?.expand?.ternakBetina);
    }
  }, [watch('perkawinan')]);

  useEffect(() => {
    if (dataPerkawinan) {
      const updatedData = dataPerkawinan.map((item) => {
        return item.id;
      });

      setPerkawinanOptions(updatedData);
    }
  }, [dataPerkawinan]);

  useEffect(() => {
    getPerkawinan(1, 5, '', '-created', 'perkawinan', 'ternakJantan, ternakBetina');
  }, [searchDebounce]);

  const calculateAge = () => {
    const tanggalLahir = getValues('tanggalLahir');
    if (tanggalLahir) {
      const dateOfBirth = new Date(tanggalLahir);
      const today = new Date();

      const ageDiffInMilliseconds = today - dateOfBirth;

      const ageDiffInSeconds = ageDiffInMilliseconds / 1000;

      const ageYears = Math.floor(ageDiffInSeconds / (365.25 * 24 * 60 * 60));
      const ageMonths = Math.floor(
        (ageDiffInSeconds % (365.25 * 24 * 60 * 60)) / (30.44 * 24 * 60 * 60)
      );
      const ageDays = Math.floor((ageDiffInSeconds % (30.44 * 24 * 60 * 60)) / (24 * 60 * 60));

      const totalAgeDays = ageYears * 365 + ageMonths * 30 + ageDays;

      setUmur({
        label: `${ageYears} tahun ${ageMonths} bulan ${ageDays} hari`,
        value: totalAgeDays,
      });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    // const updatedDataTernak = {
    //     ...data,
    //     kandang: selectedKandang.id,
    //     peternakan: user.user.createdBy,
    //     umur: umur.value,
    //     status: 'aktif'
    // }

    try {
      const responseData = await createTernak(data, 'ternak');
      // const updatedDataKandang = {
      //     ...selectedKandang,
      //     ternak: [
      //         ...selectedKandang.ternak,
      //         responseData.id
      //     ]
      // }
      // await updateKandang(updatedDataKandang.id, updatedDataKandang, "kandang")
      enqueueSnackbar('Success', { variant: 'success' });
      if (user.role === 'anakKandang') router.push(paths.dombaAnakKandang.ternak.root);
      if (user.role === 'intiAnakKandang') router.push(paths.dombaIntiAnakKandang.ternak.root);

      reset();
    } catch (error) {
      enqueueSnackbar('Failed', { variant: 'error' });
    }
  });

  const informasiDasarSection = (
    <>
      <Typography sx={{ fontWeight: 'medium', mb: 2 }} variant="h5">
        Tambah Ternak
      </Typography>
      <Grid container rowSpacing={3} columnSpacing={1}>
        <Grid item sm={6} xs={12}>
          <RHFTextField name="noFID" label="No FID" />
        </Grid>
        {/* <Grid item sm={6} xs={12}>
                    <RHFSelect name="lokasi" label="Lokasi">
                        {LOKASI_FID_OPTIONS.map((options) => (
                            <MenuItem value={options} key={options}>{options}</MenuItem>
                        ))}
                    </RHFSelect>
                </Grid> */}
        <Grid item sm={6} xs={12}>
          <RHFSelect name="jenisKelamin" label="Jenis Kelamin">
            {JENIS_KELAMIN_OPTIONS?.map((options) => (
              <MenuItem value={options} key={options}>
                {options}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={6}>
          <RHFSelect name="jenisHewan" label="Jenis Hewan">
            {JENIS_HEWAN_OPTIONS?.map((option) => (
              <MenuItem value={option} key={option}>
                {option}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={6}>
          <RHFSelect name="jenisBreed" label="Jenis Breed">
            {dataJenisBreed?.map((options) => (
              <MenuItem value={options.name} key={options.name}>
                {options.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item sm={6} xs={12}>
          <RHFDatePicker
            name="tanggalLahir"
            label="Tanggal Lahir"
            sx={{ width: '100%' }}
            disableFuture
          />
          <Typography sx={{ mt: 1 }} typography={'caption'}>
            Umur Saat Ini : {umur.label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <RHFTextField
            name="berat"
            label="Berat Awal"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="start">kg</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <RHFSelect name="bodyConditionalScore" label="Body Conditional Score (BCS)">
            {dataBCS?.map((options) => (
              <MenuItem value={options.id} key={options.id}>
                {options.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={6}>
          <RHFSelect name="bodyFatScore" label="Body Fat Score">
            {dataBFS?.map((options) => (
              <MenuItem value={options.id} key={options.id}>
                {options.name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={6}>
          <RHFSelect name="kandang" label="Kandang">
            {dataKandang?.map((options) => (
              <MenuItem value={options.id} key={options.id}>
                {options.namaKandang}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={6}>
          <RHFSelect name="pen" label="Pen">
            {penOptions?.map((options) => (
              <MenuItem value={options.id} key={options.id}>
                {options.namaPen}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={6}>
          <RHFCheckbox name="checkboxSilsilah" label="Input Silsilah Ternak" />
        </Grid>

        {watch('checkboxSilsilah') && (
          <>
            <Grid item xs={12}>
              <RHFAutocompleteCustom
                name="perkawinan"
                label="ID Perkawinan"
                options={perkawinanOptions}
                sx={{
                  mt: 1,
                }}
                onSearch={onSearch}
              />
              {watch('perkawinan') && (
                <Stack flexDirection={'row'} spacing={2} mt={2}>
                  <RHFSelect name="indukBetina" label="Ternak Jantan">
                    {jantanOptions?.map((options) => (
                      <MenuItem value={options.id} key={options.id}>
                        {options.noFID}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  <RHFSelect name="indukJantan" label="Ternak Betina">
                    {betinaOptions?.map((options) => (
                      <MenuItem value={options.id} key={options.id}>
                        {options.noFID}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Stack>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  {informasiDasarSection}
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
                      + Tambah
                    </LoadingButton>
                  </Box>
                </FormProvider>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {openBCSModal.value && <BCSModal open={openBCSModal.value} onClose={openBCSModal.onFalse} />}
    </>
  );
}
