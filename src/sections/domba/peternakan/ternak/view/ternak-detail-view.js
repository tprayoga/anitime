'use client';

import { paths } from 'src/routes/paths';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme, alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Divider, MenuItem, Tab, Tabs, Typography } from '@mui/material';

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
import { useGetData, useGetOneData } from 'src/api/custom-domba-api';
import { DatePicker } from '@mui/x-date-pickers';
import { addDays } from 'date-fns';
import pbDomba from 'src/utils/pocketbase-domba';
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
  const [category, setCategory] = useState('pakan');

  const IMAGE_URL = dataSurveilans[0]?.fotoGejala.map((data) => {
    return {
      src: `${FILES_API}/${dataSurveilans[0]?.collectionId}/${dataSurveilans[0]?.id}/${data}?token=${pbDomba.authStore.token}`,
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
    getOneData(id, 'ternak', 'bodyConditionalScore,pen.kandang');
  };

  const hitungUmur = (lahir) => {
    let date1 = new Date(lahir);
    let date2 = new Date(Date.now());

    let Difference_In_Time = date2.getTime() - date1.getTime();
    let hari = Math.round(Difference_In_Time / (1000 * 3600 * 24));

    const tahun = Math.floor(hari / 365);
    const sisaHari = hari % 365;
    const bulan = Math.floor(sisaHari / 30);
    const hariSisa = sisaHari % 30;

    return `${tahun ? `${tahun} Tahun` : ''} ${bulan ? `${bulan} Bulan` : ''} ${
      hariSisa ? `${hariSisa} Hari` : ''
    }`;
  };

  const toggleCategory = useCallback(
    (event, newValue) => {
      setCategory(newValue);
    },
    [category]
  );

  const KATEGORI_OPTIONS = [
    { value: 'pakan', label: 'Pemberian Pakan' },
    { value: 'penyakit', label: 'Riwayat Penyakit' },
    { value: 'silsilah', label: 'Silsilah Keluarga' },
  ];

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
                { name: `${data?.noFID} - ${data?.jenisHewan}` },
              ]}
              // action={
              //   <Stack spacing={2} direction={'row'}>
              //     <Button
              //       color="primary"
              //       variant="contained"
              //       endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              //       onClick={popover.onOpen}
              //     >
              //       Rekam Aktivitas
              //     </Button>
              //   </Stack>
              // }
            />
          </Grid>

          <Grid xs={12} md={8}>
            <Tabs
              value={category}
              onChange={toggleCategory}
              sx={{
                mx: 2,
                mb: 3,
                px: 2.5,
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {KATEGORI_OPTIONS.map((tab) => (
                <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
              ))}
            </Tabs>

            {category === 'pakan' && (
              <Card sx={{ minHeight: '70vh', p: 3 }}>
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
                                        <Typography variant="body2">
                                          {data.jenisPakan} :{' '}
                                        </Typography>
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
              </Card>
            )}
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
                <Stack spacing={1} flexDirection="row">
                  <Stack sx={{ py: 3, pl: 6 }} spacing={2}>
                    <Box>
                      <Typography variant="body2">Jenis Hewan</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {data?.jenisHewan}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2">Jenis Breed</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {data?.jenisBreed}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2">Sertifikat</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {data?.sertifikat || '-'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ py: 3, pl: 6 }} spacing={2}>
                    <Box>
                      <Typography variant="body2">Jenis Kelamin</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {data?.jenisKelamin}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2">Lokasi</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {data?.expand?.pen?.expand?.kandang?.namaKandang}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Card>

              <Card>
                <Box sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}>
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
                <Stack spacing={1} flexDirection="row">
                  <Stack sx={{ py: 3, pl: 6 }} spacing={2}>
                    <Box>
                      <Typography variant="body2">Umur</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {hitungUmur(data?.tanggalLahir)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2">Berat</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {data?.berat} Kg
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2">Body Conditional Score</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {`${data?.expand?.bodyConditionalScore?.score} (${data?.expand?.bodyConditionalScore?.name})` ||
                          '-'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack sx={{ py: 3, pl: 6 }} spacing={2}>
                    <Box>
                      <Typography variant="body2">Tanggal Lahir</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {fDate(data?.tanggalLahir) || '-'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2">Asal</Typography>
                      <Typography fontWeight="bold" variant="body2" noWrap>
                        {data?.asalPeternakan || '-'}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
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
