'use client';

import { paths } from 'src/routes/paths';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Divider, MenuItem, Typography } from '@mui/material';

import {
  _appAuthors,
  _appRelated,
  _appFeatured,
  _appInvoices,
  _appInstalled,
  _mock,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { Fragment, useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { CatatanWelfareModal, SurveilansPenyakitModal } from 'src/components/modal/anak-kandang';
import { fDate, fDateTime, fTime } from 'src/utils/format-time';
import { useGetData, useGetOneData } from 'src/api/custom-api';
import { DatePicker } from '@mui/x-date-pickers';
import { addDays } from 'date-fns';
import pb from 'src/utils/pocketbase';
import { FILES_API, FILES_DOMAIN, FILES_DOMAIN_API } from 'src/config-global';
import PemberianPakanModal from 'src/components/modal/anak-kandang/pemberian-pakan-modal';
import CarouselCustom from 'src/components/custom-carousel';

// ----------------------------------------------------------------------
export default function TernakDetailView({ id }) {
  const popover = usePopover();
  const theme = useTheme();
  const settings = useSettingsContext();

  const { data, loading, getOneData } = useGetOneData();
  const {
    data: dataPemberianPakan,
    loading: loadingPemberianPakan,
    getData: getPemberianPakan,
  } = useGetData();
  const {
    data: dataCatatanWelfare,
    loading: loadingCatatanWelfare,
    getData: getCatatanWelfare,
  } = useGetData();
  const { data: dataSurveilans, loading: loadingSurveilans, getData: getSurveilans } = useGetData();

  const statusOptions = [
    {
      value: 'pakan',
      label: 'Pemberian Pakan',
      disabled: dataPemberianPakan?.length > 2 ? true : false,
    },
    { value: 'welfare', label: 'Catatan Kondisi Ternak' },
    { value: 'surveilans', label: 'Surveilans Penyakit' },
  ];
  const [status, setStatus] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [type, setType] = useState('');

  const IMAGE_URL = dataSurveilans[0]?.fotoGejala.map((data) => {
    return {
      src: `${FILES_API}/${dataSurveilans[0]?.collectionId}/${dataSurveilans[0]?.id}/${data}?token=${pb.authStore.token}`,
    };
  });

  const [selectedPemberianPakan, setSelectedPemberianPakan] = useState('');

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

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
    getOneData(id, 'ternak');
  };
  const calculateAge = () => {
    if (data?.tanggalLahir) {
      const dateOfBirth = new Date(data?.tanggalLahir);
      const today = new Date();

      const ageDiffInMilliseconds = today - dateOfBirth;

      const ageDiffInSeconds = ageDiffInMilliseconds / 1000;

      const ageYears = Math.floor(ageDiffInSeconds / (365.25 * 24 * 60 * 60));
      const ageMonths = Math.floor(
        (ageDiffInSeconds % (365.25 * 24 * 60 * 60)) / (30.44 * 24 * 60 * 60)
      );
      const ageDays = Math.floor((ageDiffInSeconds % (30.44 * 24 * 60 * 60)) / (24 * 60 * 60));

      const totalAgeDays = ageYears * 365 + ageMonths * 30 + ageDays;

      return `${ageYears} tahun ${ageMonths} bulan ${ageDays} hari`;
    }
  };

  useEffect(() => {
    if (id) {
      getOneData(id, 'ternak');
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
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <AnitimeBreadcrumbs
              links={[
                { name: 'Data Ternak', href: paths.anakKandang.ternak.root },
                { name: `${data?.RFID} - ${data?.jenisHewan}` },
              ]}
              action={
                <Stack spacing={2} direction={'row'}>
                  <Button
                    color="primary"
                    variant="contained"
                    endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    onClick={popover.onOpen}
                  >
                    Rekam Aktivitas
                  </Button>
                </Stack>
              }
            />
          </Grid>

          <Grid xs={12} md={4}>
            <Stack spacing={3}>
              <Card>
                <Box sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}>
                  <Button
                    startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                    variant={'text'}
                    color="inherit"
                    size="large"
                    sx={{ fontSize: 17 }}
                  >
                    Informasi Dasar
                  </Button>
                </Box>
                <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                  <Typography variant="body2">Jenis Hewan : {data?.jenisHewan}</Typography>
                  <Typography variant="body2">
                    No Tag (FID) : {data?.noFID} ({data?.lokasi})
                  </Typography>
                  <Typography variant="body2">Medical History : N/A</Typography>
                  <Typography variant="body2">Lokasi Kandang : Kandang 1</Typography>
                </Stack>
              </Card>

              <Card>
                <Box sx={{ pl: 2, py: 1, backgroundColor: '#F9FCDB' }}>
                  <Button
                    startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                    variant={'text'}
                    color="inherit"
                    size="large"
                    sx={{ fontSize: 17 }}
                  >
                    Informasi Kelahiran
                  </Button>
                </Box>
                <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                  <Typography variant="body2">Umur : {calculateAge()}</Typography>
                  <Typography variant="body2">
                    Tanggal Lahir : {fDate(data?.tanggalLahir)}
                  </Typography>
                  <Typography variant="body2">Berat : {data?.berat} Kg</Typography>
                  <Typography variant="body2">Asal : {data?.asalPeternakan}</Typography>
                </Stack>
              </Card>

              <Card>
                <Box sx={{ pl: 2, py: 1, backgroundColor: '#EAFFEA' }}>
                  <Button
                    startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                    variant={'text'}
                    color="inherit"
                    size="large"
                    sx={{ fontSize: 17 }}
                  >
                    Informasi Tambahan
                  </Button>
                </Box>
                <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                  <Typography variant="body2">RFID : {data?.RFID}</Typography>
                  <Typography variant="body2">ID Indentik PKH : {data?.idPKH}</Typography>
                  <Typography variant="body2">Rata-rata Pakan/Hari : 200</Typography>
                </Stack>
              </Card>

              <Card>
                <Box sx={{ pl: 2, py: 1, backgroundColor: '#FFE8E8' }}>
                  <Button
                    startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                    variant={'text'}
                    color="inherit"
                    size="large"
                    sx={{ fontSize: 17 }}
                  >
                    Karakter Fisik
                  </Button>
                </Box>
                <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                  <Typography variant="body2">Jenis Kelamin : {data?.jenisKelamin}</Typography>
                  <Typography variant="body2">Breed : {data?.jenisBreed}</Typography>
                  <Typography variant="body2">Warna : {data?.warna}</Typography>
                  <Typography variant="body2">Berat : {data?.berat} Kg</Typography>
                  <Typography variant="body2">
                    Body Conditional Score (BCS): {data?.bodyConditionalScore}
                  </Typography>
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
                  ) : dataPemberianPakan.length ? (
                    <>
                      {dataPemberianPakan.map((item, index) => (
                        <Fragment key={index}>
                          <Stack flexDirection={'row'} alignItems={'start'}>
                            <Typography variant="body2">{fTime(item.created)}</Typography>
                            <Stack spacing={1} ml={3}>
                              <Typography variant="body2">
                                Tipe Pakan
                                {item.tipePakan?.map((data, dataIndex) => (
                                  <Fragment key={dataIndex}>
                                    <Stack flexDirection={'row'} sx={{ flex: 1 }} mt={1}>
                                      <Iconify icon="radix-icons:dot-filled" />
                                      <Typography variant="body2">{data.jenisPakan} : </Typography>
                                      <Typography variant="body2">
                                        {' '}
                                        &nbsp; {data.jumlah} kg
                                      </Typography>
                                    </Stack>
                                  </Fragment>
                                ))}
                              </Typography>
                              <Typography variant="body2">
                                Jumlah Pakan Konsentrat : {item.jumlahPakanKonsentrat} Kg
                              </Typography>
                              <Typography variant="body2">
                                Jumlah Pakan Pemberian Air : {item.jumlahPemberianAir} Liter
                              </Typography>
                            </Stack>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<Iconify icon="typcn:edit" />}
                              sx={{
                                ml: 'auto',
                              }}
                              disabled={!item || fDate(currentDate) !== fDate(new Date())}
                              onClick={() => {
                                setStatus('pakan');
                                setType('EDIT');
                                setSelectedPemberianPakan(item);
                              }}
                            >
                              Edit
                            </Button>
                          </Stack>
                          {index < dataPemberianPakan.length - 1 && <Divider />}
                        </Fragment>
                      ))}
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
                    Catatan Kondisi Ternak
                  </Button>

                  <Button
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
                  </Button>
                </Stack>
                <Stack sx={{ p: 3 }} spacing={1}>
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
                      <Typography variant="body2">
                        Berat : {dataCatatanWelfare[0]?.berat} Kg
                      </Typography>
                      <Typography variant="body2">
                        Body Conditional Score : {dataCatatanWelfare[0]?.bodyConditionalScore}
                      </Typography>
                      <Typography variant="body2">
                        Jumlah Feses : {dataCatatanWelfare[0]?.jumlahFeses} Kg
                      </Typography>
                    </>
                  ) : (
                    'Tidak ada Data Catatan Kondisi Ternak'
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

                  <Button
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
                  </Button>
                </Stack>
                <Stack sx={{ p: 3 }} spacing={1}>
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
                      <Typography variant="body2">
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
                        <span>{`, ${dataSurveilans[0]?.gejalaLain}`}</span>
                      </Typography>
                      <Typography variant="body2">
                        Perkiraan Muncul Gejala : {fDateTime(dataSurveilans[0]?.perkiraanWaktu)}
                      </Typography>
                      <Typography variant="body2">Foto Gejala</Typography>
                      {/* <Stack flexDirection={'row'} spacing={1} flexWrap={'wrap'}>
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
                      </Stack> */}
                      <CarouselCustom data={IMAGE_URL} />
                    </>
                  ) : (
                    'Tidak ada Data Surveilans Penyakit'
                  )}
                </Stack>
              </Card>
            </Card>
          </Grid>
        </Grid>

        <CustomPopover open={popover.open} onClose={popover.onClose} arrow="top-right">
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === status}
              onClick={() => {
                popover.onClose();
                setType('CREATE');
                handleChangeStatus(option.value);
              }}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </CustomPopover>
      </Container>
      {status === 'pakan' && (
        <PemberianPakanModal
          open={status === 'pakan'}
          onClose={() => handleChangeStatus('')}
          dataTernak={data}
          refetch={refetch}
          dataPemberianPakan={selectedPemberianPakan}
          type={type}
        />
      )}
      {status === 'welfare' && (
        <CatatanWelfareModal
          open={status === 'welfare'}
          onClose={() => handleChangeStatus('')}
          dataTernak={data}
          refetch={refetch}
          dataCatatanWelfare={dataCatatanWelfare}
          type={type}
        />
      )}
      {status === 'surveilans' && (
        <SurveilansPenyakitModal
          open={status === 'surveilans'}
          onClose={() => handleChangeStatus('')}
          dataTernak={data}
          refetch={refetch}
          dataSurveilans={dataSurveilans}
          type={type}
        />
      )}
    </>
  );
}
