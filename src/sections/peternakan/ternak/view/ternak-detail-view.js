'use client';

import { paths } from 'src/routes/paths';
import uuidv4 from 'src/utils/uuidv4';
import { RouterLink } from 'src/routes/components';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Breadcrumbs,
  Card,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import KandangTableRow from '../ternak-table-row';
import KandangTableToolbar from '../ternak-table-toolbar';
import KandangTableHead from '../ternak-table-head';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import OverviewKandang from '../overview-kandang';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
import ComponentBlock from 'src/sections/_examples/component-block';
import Link from 'next/link';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import RiwayatTableRow from '../riwayat-table-row';
import { RHFSelect } from 'src/components/hook-form';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useGetData, useGetOneData } from 'src/api/custom-api';
import { fDate, fDateTime, fTime } from 'src/utils/format-time';
import { addDays } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers';
import pb from 'src/utils/pocketbase';
import { FILES_API, FILES_DOMAIN, FILES_DOMAIN_API } from 'src/config-global';

// ----------------------------------------------------------------------

export default function TernakDetailView({ id }) {
  const { user } = useMockedUser();

  const popover = usePopover();

  const table = useTable();

  const theme = useTheme();

  const settings = useSettingsContext();

  const { data, error, loading, getOneData } = useGetOneData();
  const {
    data: dataPemberianPakan,
    error: errorPemberianPakan,
    loading: loadingPemberianPakan,
    getData: getPemberianPakan,
  } = useGetData();
  const {
    data: dataCatatanWelfare,
    error: errorCatatanWelfare,
    loading: loadingCatatanWelfare,
    getData: getCatatanWelfare,
  } = useGetData();
  const {
    data: dataSurveilans,
    error: errorSurveilans,
    loading: loadingSurveilans,
    getData: getSurveilans,
  } = useGetData();

  const denseHeight = table.dense ? 60 : 80;

  const confirm = useBoolean();

  const [currentDate, setCurrentDate] = useState(new Date());

  const IMAGE_URL = dataSurveilans[0]?.fotoGejala.map((data) => {
    return `${FILES_API}/${dataSurveilans[0]?.collectionId}/${dataSurveilans[0]?.id}/${data}?token=${pb.authStore.token}`;
  });

  const refetch = () => {
    getPemberianPakan(
      1,
      5,
      `ternak = "${id}" && created >= "${fDate(currentDate, 'yyyy-MM-dd')}" && created <= "${fDate(
        addDays(currentDate, 1),
        'yyyy-MM-dd'
      )}"`,
      '-created',
      'pemberianPakanTernak'
    );
    getCatatanWelfare(
      1,
      5,
      `ternak = "${id}" && created >= "${fDate(currentDate, 'yyyy-MM-dd')}" && created <= "${fDate(
        addDays(currentDate, 1),
        'yyyy-MM-dd'
      )}"`,
      '-created',
      'catatanWelfareTernak'
    );
    getSurveilans(
      1,
      5,
      `ternak = "${id}" && created >= "${fDate(currentDate, 'yyyy-MM-dd')}" && created <= "${fDate(
        addDays(currentDate, 1),
        'yyyy-MM-dd'
      )}"`,
      '-created',
      'surveilansTernak'
    );
  };

  const hitungWaktu = (hari) => {
    const tahun = Math.floor(hari / 365);
    const sisaHari = hari % 365;
    const bulan = Math.floor(sisaHari / 30);
    const hariSisa = sisaHari % 30;

    return `${tahun ? `${tahun} Tahun` : ''} ${bulan ? `${bulan} Bulan` : ''} ${
      hariSisa ? `${hariSisa} Hari` : ''
    }`;
  };

  useEffect(() => {
    if (id) {
      getOneData(id, 'ternak', 'kandang', '');
      refetch();
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [currentDate]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AnitimeBreadcrumbs
            links={[
              { name: 'Data Ternak', href: paths.peternakan.ternak.root },
              { name: `${data?.RFID} - ${data?.jenisHewan}` },
            ]}
            // sx={{ mb: { xs: 3, md: 5 } }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <Box sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  size="large"
                  sx={{ fontSize: 17, color: 'black' }}
                >
                  Informasi Dasar
                </Button>
              </Box>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                <Typography>Jenis Hewan : {data?.jenisHewan}</Typography>
                <Typography>
                  No Tag (FID) : {data?.noFID} ({data?.lokasi})
                </Typography>
                <Typography>Medical History : N/A</Typography>
                <Typography>Lokasi Kandang : {data?.expand?.kandang?.namaKandang}</Typography>
              </Stack>
            </Card>

            <Card>
              <Box sx={{ pl: 2, py: 1, backgroundColor: '#F9FCDB' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  size="large"
                  sx={{ fontSize: 17, color: 'black' }}
                >
                  Informasi Kelahiran
                </Button>
              </Box>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                <Typography>Umur : {hitungWaktu(data?.umur)}</Typography>
                <Typography>Tanggal Lahir : {fDate(data?.tanggalLahir)}</Typography>
                <Typography>Berat : {data?.berat} Kg</Typography>
                <Typography>Asal : {data?.asalPeternakan}</Typography>
              </Stack>
            </Card>

            <Card>
              <Box sx={{ pl: 2, py: 1, backgroundColor: '#EAFFEA' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  size="large"
                  sx={{ fontSize: 17, color: 'black' }}
                >
                  Informasi Tambahan
                </Button>
              </Box>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                <Typography>RFID : {data?.RFID}</Typography>
                <Typography>ID Indentik PKH : {data?.idPKH}</Typography>
                <Typography>Rata-rata Pakan/Hari : 200</Typography>
              </Stack>
            </Card>

            <Card>
              <Box sx={{ pl: 2, py: 1, backgroundColor: '#FFE8E8' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  size="large"
                  sx={{ fontSize: 17, color: 'black' }}
                >
                  Karakter Fisik
                </Button>
              </Box>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                <Typography>Jenis Kelamin : {data?.jenisKelamin}</Typography>
                <Typography>Breed : {data?.jenisBreed}</Typography>
                <Typography>Warna : {data?.warna}</Typography>
                <Typography>Berat : {data?.berat} Kg</Typography>
                <Typography>Body Conditional Score (BCS): {data?.bodyConditionalScore}</Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ minHeight: '100vh', p: 3 }}>
            <Stack direction={'row'} spacing={2}>
              <Button variant="contained" sx={{ backgroundColor: '#E3F8FF', color: 'black' }}>
                Aktivitas
              </Button>

              <DatePicker
                value={currentDate}
                format="dd-MM-yyyy"
                onChange={(date) => setCurrentDate(date)}
              />

              <Button variant={'text'} color="inherit" sx={{ fontWeight: 'bold' }}>
                Berat {data?.berat} Kg
              </Button>
            </Stack>

            {/* Pemberian Pakan */}
            <Card sx={{ mt: 3 }}>
              <Stack
                sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Button variant={'text'} color="inherit" size="large" sx={{ fontSize: 17 }}>
                  Pemberian Pakan
                </Button>
              </Stack>
              <Stack sx={{ p: 3, pl: 3 }} spacing={1}>
                {loadingPemberianPakan ? (
                  <Iconify
                    icon="line-md:loading-loop"
                    sx={{
                      width: '40px',
                      height: '40px',
                    }}
                  />
                ) : dataPemberianPakan[0] ? (
                  <>
                    <Stack flexDirection={'row'} alignItems={'start'}>
                      <Typography>{fTime(dataPemberianPakan[0].created)}</Typography>
                      <Stack spacing={1} ml={3}>
                        <Typography>
                          Tipe Pakan
                          {dataPemberianPakan[0]?.tipePakan?.map((data, index) => (
                            <Fragment key={index}>
                              <Stack flexDirection={'row'} sx={{ flex: 1 }} mt={1}>
                                <Iconify icon="radix-icons:dot-filled" />
                                <Typography>{data.jenisPakan} : </Typography>
                                <Typography> &nbsp; {data.jumlah} kg</Typography>
                              </Stack>
                            </Fragment>
                          ))}
                        </Typography>
                        {/* <Typography>Jumlah Pakan : {dataPemberianPakan[0]?.jumlahPakan} Kg</Typography> */}
                        <Typography>
                          Jumlah Pakan Konsentrat : {dataPemberianPakan[0]?.jumlahPakanKonsentrat}{' '}
                          Kg
                        </Typography>
                        {/* <Typography>Jumlah Pakan Tambahan : {dataPemberianPakan[0]?.jumlahPakanTambahan} Kg</Typography> */}
                        <Typography>
                          Jumlah Pakan Pemberian Air : {dataPemberianPakan[0]?.jumlahPemberianAir}{' '}
                          Liter
                        </Typography>
                      </Stack>
                      {/* <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Iconify icon="typcn:edit" />}
                        sx={{
                          ml: 'auto',
                        }}
                        disabled={
                          !dataPemberianPakan[0] || fDate(currentDate) !== fDate(new Date())
                        }
                        onClick={() => {
                          setStatus('pakan');
                          setType('EDIT');
                          setSelectedPemberianPakan(dataPemberianPakan[0]);
                        }}
                      >
                        Edit
                      </Button> */}
                    </Stack>
                    <Divider />
                    {dataPemberianPakan[1] && (
                      <Stack flexDirection={'row'} alignItems={'start'}>
                        <Typography>{fTime(dataPemberianPakan[1]?.created)}</Typography>
                        <Stack spacing={1} ml={3}>
                          <Typography>
                            Tipe Pakan
                            {dataPemberianPakan[1]?.tipePakan?.map((data, index) => (
                              <Fragment key={index}>
                                <Stack flexDirection={'row'} sx={{ flex: 1 }} mt={1}>
                                  <Iconify icon="radix-icons:dot-filled" />
                                  <Typography>{data.jenisPakan} : </Typography>
                                  <Typography> &nbsp; {data.jumlah} kg</Typography>
                                </Stack>
                              </Fragment>
                            ))}
                          </Typography>
                          <Typography>
                            Jumlah Pakan Konsentrat : {dataPemberianPakan[1]?.jumlahPakanKonsentrat}{' '}
                            Kg
                          </Typography>
                          <Typography>
                            Jumlah Pakan Pemberian Air : {dataPemberianPakan[1]?.jumlahPemberianAir}{' '}
                            Liter
                          </Typography>
                        </Stack>
                        {/* <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Iconify icon="typcn:edit" />}
                          sx={{
                            ml: 'auto',
                          }}
                          disabled={
                            !dataPemberianPakan[1] || fDate(currentDate) !== fDate(new Date())
                          }
                          onClick={() => {
                            setStatus('pakan');
                            setType('EDIT');
                            setSelectedPemberianPakan(dataPemberianPakan[1]);
                          }}
                        >
                          Edit
                        </Button> */}
                      </Stack>
                    )}
                  </>
                ) : (
                  'Tidak ada Data Pemberian Pakan'
                )}
              </Stack>
            </Card>

            {/* Catatan Welfare */}
            <Card sx={{ mt: 3 }}>
              <Stack
                sx={{ pl: 2, py: 1, backgroundColor: '#F9FCDB' }}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Button variant={'text'} color="inherit" size="large" sx={{ fontSize: 17 }}>
                  Catatan Welfare
                </Button>

                {/* <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="typcn:edit" />}
                  sx={{
                    mr: 2,
                  }}
                  disabled={!dataCatatanWelfare[0] || fDate(currentDate) !== fDate(new Date())}
                  onClick={() => {
                    setStatus('welfare');
                    setType('EDIT');
                  }}
                >
                  Edit
                </Button> */}
              </Stack>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                {loadingCatatanWelfare ? (
                  <Iconify
                    icon="line-md:loading-loop"
                    sx={{
                      width: '40px',
                      height: '40px',
                    }}
                  />
                ) : dataCatatanWelfare[0] ? (
                  <>
                    <Typography>Berat : {dataCatatanWelfare[0]?.berat} Kg</Typography>
                    <Typography>
                      Body Conditional Score : {dataCatatanWelfare[0]?.bodyConditionalScore}
                    </Typography>
                    <Typography>Jumlah Feses : {dataCatatanWelfare[0]?.jumlahFeses} Kg</Typography>
                  </>
                ) : (
                  'Tidak ada Data Catatan Welfare'
                )}
              </Stack>
            </Card>

            {/* Surveilans Penyakit */}
            <Card sx={{ mt: 3 }}>
              <Stack
                sx={{ pl: 2, py: 1, backgroundColor: '#EAFFEA' }}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Button variant={'text'} color="inherit" size="large" sx={{ fontSize: 17 }}>
                  Surveilans Penyakit
                </Button>

                {/* <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="typcn:edit" />}
                  sx={{
                    mr: 2,
                  }}
                  disabled={!dataSurveilans[0] || fDate(currentDate) !== fDate(new Date())}
                  onClick={() => {
                    setStatus('surveilans');
                    setType('EDIT');
                  }}
                >
                  Edit
                </Button> */}
              </Stack>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                {loadingSurveilans ? (
                  <Iconify
                    icon="line-md:loading-loop"
                    sx={{
                      width: '40px',
                      height: '40px',
                    }}
                  />
                ) : dataSurveilans[0] ? (
                  <>
                    <Typography>
                      Gejala Muncul :
                      {dataSurveilans[0]?.gejalaMuncul.map((data, index) => (
                        <Fragment key={index}>
                          {index === dataSurveilans[0].gejalaMuncul.length - 1 ? (
                            <span>{data}</span>
                          ) : (
                            <span>&nbsp;{data}, </span>
                          )}
                        </Fragment>
                      ))}
                    </Typography>
                    <Typography>
                      Perkiraan Muncul Gejala : {fDateTime(dataSurveilans[0]?.perkiraanWaktu)}
                    </Typography>
                    <Typography>Foto Gejala : </Typography>
                    <Stack flexDirection={'row'} spacing={1} flexWrap={'wrap'}>
                      {IMAGE_URL?.map((url, index) => (
                        <Box
                          component="img"
                          alt="invite"
                          src={url}
                          sx={{
                            position: 'relative',
                            width: 150,
                            height: 'auto',
                            objectFit: 'contain',
                            my: 1,
                          }}
                          key={index}
                        />
                      ))}
                    </Stack>
                  </>
                ) : (
                  'Tidak ada Data Surveilans Penyakit'
                )}
              </Stack>
            </Card>
          </Card>
        </Grid>
      </Grid>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        // sx={{ width: 140 }}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === status}
            onClick={() => {
              popover.onClose();
              handleChangeStatus(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover> */}
    </Container>
  );
}
