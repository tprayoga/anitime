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
  Card,
  MenuItem,
  Typography,
} from '@mui/material';


import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import { RHFSelect } from 'src/components/hook-form';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import SurveilansPenyakitModal from 'src/components/modal/dokter-hewan/surveilans-penyakit-modal';
import { useGetFirstListItem, useGetOneData } from 'src/api/custom-api';
import { fDate } from 'src/utils/format-time';
import pb from 'src/utils/pocketbase';
import { FILES_API, FILES_DOMAIN_API } from 'src/config-global';
import PemeriksaanLengkapModal from 'src/components/modal/dokter-hewan/pemeriksaan-lengkap-modal';
import AccordionItem from '../accordion-item';
import Label from 'src/components/label';
import DiagnosisModal from 'src/components/modal/dokter-hewan/diagnosis-modal';
import DiagnosisModal2 from 'src/components/modal/dokter-hewan/diagnosis2-modal';
import CarouselBasic1 from 'src/sections/_examples/extra/carousel-view/carousel-basic-1';
import CarouselCustom from 'src/components/custom-carousel';

// ----------------------------------------------------------------------

export default function LaporanSurveilansDetailView({ id }) {
  const popover = usePopover();

  const openSurveilansModal = useBoolean();
  const openPemeriksaanLengkapModal = useBoolean();
  const openDiagnosisModal1 = useBoolean();
  const openDiagnosisModal2 = useBoolean();

  const settings = useSettingsContext();

  const { data: dataSurveilansTernak, error, loading: loadingSurveilansTernak, getOneData: getSurveilans } = useGetOneData();
  const { data: dataSurveilansDokter, getFirstListItem: getSurveilansDokter } = useGetFirstListItem();
  const { data: dataPemeriksaanLengkap, getFirstListItem: getPemeriksaanLengkap } = useGetFirstListItem();

  const [type, setType] = useState('CREATE');

  const statusOptions = [
    { value: 'evaluasi', label: 'Evaluasi', disabled: dataSurveilansDokter ? true : false },
    { value: 'recordAnamnesis', label: 'Record Anamnesis', disabled: dataPemeriksaanLengkap || !dataSurveilansDokter ? true : false },
    { value: 'diagnosis', label: 'Diagnosis', disabled: !dataPemeriksaanLengkap || !dataSurveilansDokter ? true : false },
  ];

  const refetch = () => {
    getSurveilans(id, 'surveilansTernak', 'ternak, ternak.kandang, createdBy');
    getSurveilansDokter('surveilansDokter', `surveilans = "${id}"`, 'ternak, createdBy');
    getPemeriksaanLengkap('pemeriksaanLengkap', `surveilans = "${id}"`, 'createdBy');
  };

  const handleNext = () => {
    openDiagnosisModal1.onFalse();
    openDiagnosisModal2.onTrue();
  }

  const handleBack = () => {
    openDiagnosisModal1.onTrue();
    openDiagnosisModal2.onFalse();
  }

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, []);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  const IMAGE_URL = dataSurveilansTernak?.fotoGejala.map((image) => {
    return {
      src: `${FILES_API}/${dataSurveilansTernak?.collectionId}/${dataSurveilansTernak?.id}/${image}?token=${pb.authStore.token}`
    }
  });

  const DOKTER_GEJALA_IMAGE_URL = dataSurveilansDokter?.fotoGejala.map((image) => {
    return {
      src: `${FILES_API}/${dataSurveilansDokter?.collectionId}/${dataSurveilansDokter?.id}/${image}?token=${pb.authStore.token}`
    }
  });

  const DOKTER_SAMPLE_IMAGE_URL = dataSurveilansDokter?.jenisSample.map((image) => {
    return {
      src: `${FILES_API}/${dataSurveilansDokter?.collectionId}/${dataSurveilansDokter?.id}/${image}?token=${pb.authStore.token}`
    }
  });


  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <AnitimeBreadcrumbs
                links={[
                  { name: 'Laporan Surveilans', href: paths.dokterHewan.surveilans.root },
                  { name: `${dataSurveilansTernak?.expand?.ternak?.RFID}` },
                ]}
              />
              <Stack spacing={2} direction={'row'}>
                <Button
                  color="primary"
                  variant="contained"
                  endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  onClick={popover.onOpen}
                >
                  Aksi
                </Button>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%' }}>

              <Box sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  color="inherit"
                  size="large"
                  sx={{ fontSize: 17 }}
                >
                  Surveilans Gejala Anak Kandang
                </Button>
              </Box>
              <Grid container spacing={3} px={4} py={2}>
                <Grid item xs={6}>
                  <Typography variant='body2'>RFID Ternak</Typography>
                  <Typography variant='body2' fontWeight={'bold'}>{dataSurveilansTernak?.expand?.ternak?.RFID}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2'>Tanggal Laporan</Typography>
                  <Typography variant='body2' fontWeight={'bold'}>{fDate(dataSurveilansTernak?.created)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body2'>Perkiraan Waktu Munculnya Gejala Pertama Kali</Typography>
                  <Typography variant='body2' fontWeight={'bold'}>{fDate(dataSurveilansTernak?.perkiraanWaktu)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2'>Petugas</Typography>
                  <Typography variant='body2' fontWeight={'bold'} sx={{ textTransform: 'capitalize' }}>{dataSurveilansTernak?.expand?.createdBy?.name}</Typography>
                </Grid>
                <Grid item xs={15}>
                  <Typography variant='body2'>Gejala</Typography>

                  <Stack flexDirection={'row'} flexWrap={'wrap'} spacing={1} mt={1}>
                    {dataSurveilansTernak?.gejalaMuncul.map((dataSurveilansTernak, index) => (
                      <Label
                        variant="soft"
                        color={'primary'}
                        key={index}
                      >
                        {dataSurveilansTernak}
                      </Label>
                    ))}
                    {dataSurveilansTernak?.gejalaLain &&
                      <Label
                        variant="soft"
                        color={'primary'}
                      >
                        {dataSurveilansTernak?.gejalaLain}
                      </Label>
                    }
                  </Stack>

                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body2'>Foto Gejala</Typography>
                  <Stack flexDirection={'row'} spacing={1} flexWrap={'wrap'} mt={1}>
                    <CarouselCustom data={IMAGE_URL} />
                  </Stack>
                </Grid>
              </Grid>

            </Card>
          </Grid>

          {dataSurveilansDokter &&
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%' }}>
                <Box sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}>
                  <Button
                    startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                    variant={'text'}
                    color="inherit"
                    size="large"
                    sx={{ fontSize: 17 }}
                  >
                    Surveilans Gejala Dokter
                  </Button>
                </Box>
                <Grid container spacing={3} px={4} py={2}>
                  <Grid item xs={6}>
                    <Typography variant='body2'>RFID Ternak</Typography>
                    <Typography variant='body2' fontWeight={'bold'}>{dataSurveilansDokter?.expand?.ternak?.RFID}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='body2'>Tanggal Laporan</Typography>
                    <Typography variant='body2' fontWeight={'bold'}>{fDate(dataSurveilansDokter?.created)}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2'>Perkiraan Waktu Munculnya Gejala Pertama Kali</Typography>
                    <Typography variant='body2' fontWeight={'bold'}>{fDate(dataSurveilansDokter?.perkiraanWaktu)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant='body2'>Petugas</Typography>
                    <Typography variant='body2' fontWeight={'bold'} sx={{ textTransform: 'capitalize' }}>{dataSurveilansDokter?.expand?.createdBy?.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2'>Gejala</Typography>

                    <Stack flexDirection={'row'} flexWrap={'wrap'} spacing={1} mt={1}>
                      {dataSurveilansDokter?.gejalaMuncul.map((dataSurveilansDokter, index) => (
                        <Label
                          variant="soft"
                          color={'primary'}
                          key={index}
                        >
                          {dataSurveilansDokter}
                        </Label>
                      ))}
                      {dataSurveilansDokter?.gejalaLain &&
                        <Label
                          variant="soft"
                          color={'primary'}
                        >
                          {dataSurveilansDokter?.gejalaLain}
                        </Label>
                      }
                    </Stack>

                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2'>{`Foto Gejala : ${DOKTER_GEJALA_IMAGE_URL.length === 0 ? ' - ' : ''}`}</Typography>
                    <Stack flexDirection={'row'} spacing={1} flexWrap={'wrap'} mt={1}>
                      {/* {DOKTER_GEJALA_IMAGE_URL?.map((url, index) => (
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
                      ))} */}
                      <CarouselCustom data={DOKTER_GEJALA_IMAGE_URL} />
                    </Stack>

                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2'>{`Jenis Sample : ${DOKTER_SAMPLE_IMAGE_URL.length === 0 ? ' - ' : ''}`}</Typography>
                    <Stack flexDirection={'row'} spacing={1} flexWrap={'wrap'} mt={1}>
                      {/* {DOKTER_SAMPLE_IMAGE_URL?.map((url, index) => (
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
                      ))} */}
                      <CarouselCustom data={DOKTER_SAMPLE_IMAGE_URL} />

                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2'>Catatan : </Typography>
                    <Typography variant='body2' fontWeight={'bold'}>{dataSurveilansDokter?.catatan}</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          }
          {dataPemeriksaanLengkap && (
            <>
              <Grid item xs={12} sm={12}>
                <Card sx={{ height: '100%' }}>
                  <Box sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}>
                    <Button
                      startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                      variant={'text'}
                      color="inherit"
                      size="large"
                      sx={{ fontSize: 17 }}
                    >
                      Anamnesis
                    </Button>
                  </Box>
                  <Grid container spacing={3} px={4} py={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">RFID Ternak</Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {dataPemeriksaanLengkap?.anamnesis?.rfid}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Tanggal Laporan</Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {fDate(dataPemeriksaanLengkap?.created)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Jenis Hewan</Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {dataPemeriksaanLengkap?.anamnesis?.jenisHewan}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Jenis Kelamin</Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {dataPemeriksaanLengkap?.anamnesis?.jenisBreed}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Warna Bulu</Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {dataPemeriksaanLengkap?.anamnesis?.warna}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Jenis Breed</Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {dataPemeriksaanLengkap?.anamnesis?.jenisKelamin}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Anamnesis</Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {dataPemeriksaanLengkap?.anamnesis?.anamnesis}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='body2'>Petugas</Typography>
                      <Typography variant='body2' fontWeight={'bold'} sx={{ textTransform: 'capitalize' }}>{dataPemeriksaanLengkap?.expand?.createdBy?.name}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} px={4} py={2}>
                    <Typography variant='body2' ml={2} >Pemeriksaan Lengkap</Typography>
                    {dataPemeriksaanLengkap?.kondisiUmum && <AccordionItem title={'Kondisi Umum'} data={dataPemeriksaanLengkap?.kondisiUmum} />}
                    {dataPemeriksaanLengkap?.pemeriksaanFisik && <AccordionItem title={'Pemeriksaan Fisik'} data={dataPemeriksaanLengkap?.pemeriksaanFisik} />}

                    {dataPemeriksaanLengkap?.kulitBulu && <AccordionItem title={'Kulit Bulu'} data={dataPemeriksaanLengkap?.kulitBulu} />}
                    {dataPemeriksaanLengkap?.membranMukosa && <AccordionItem title={'Membran Mukosa'} data={dataPemeriksaanLengkap?.membranMukosa} />}
                    {dataPemeriksaanLengkap?.kelenjarLimfa && <AccordionItem title={'Kelenjar Limfa'} data={dataPemeriksaanLengkap?.kelenjarLimfa} />}
                    {dataPemeriksaanLengkap?.muskulosketal && <AccordionItem title={'Muskuloskeletal'} data={dataPemeriksaanLengkap?.muskulosketal} />}
                    {dataPemeriksaanLengkap?.sistemSirkulasi && <AccordionItem title={'Sistem Sirkulasi'} data={dataPemeriksaanLengkap?.sistemSirkulasi} />}
                    {dataPemeriksaanLengkap?.sistemRespirasi && <AccordionItem title={'Sistem Respirasi'} data={dataPemeriksaanLengkap?.sistemRespirasi} />}
                    {dataPemeriksaanLengkap?.sistemDigesti && <AccordionItem title={'Sistem Digesti'} data={dataPemeriksaanLengkap?.sistemDigesti} />}
                    {dataPemeriksaanLengkap?.sistemUrogenital && <AccordionItem title={'Sistem Urogenital'} data={dataPemeriksaanLengkap?.sistemUrogenital} />}
                    {dataPemeriksaanLengkap?.sistemSyaraf && <AccordionItem title={'Sistem Syaraf'} data={dataPemeriksaanLengkap?.sistemSyaraf} />}
                    {dataPemeriksaanLengkap?.mataDanTelinga && <AccordionItem title={'Mata Dan Telinga'} data={dataPemeriksaanLengkap?.mataDanTelinga} />}
                    {dataPemeriksaanLengkap?.diagnosaSementara && <AccordionItem title={'Diagnosa Sementara'} data={dataPemeriksaanLengkap?.diagnosaSementara} />}

                  </Grid>
                </Card>

              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <Card sx={{ height: '100%' }}>
                  <Box sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}>
                    <Button
                      startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                      variant={'text'}
                      color="inherit"
                      size="large"
                      sx={{ fontSize: 17 }}
                    >
                      Hasil Pemeriksaan
                    </Button>
                  </Box>
                  <Grid container spacing={3} px={4} py={2}>
                    {dataPemeriksaanLengkap?.kondisiUmum && <AccordionItem title={'Kondisi Umum'} data={dataPemeriksaanLengkap?.kondisiUmum} />}
                    {dataPemeriksaanLengkap?.kulitBulu && <AccordionItem title={'Kulit Bulu'} data={dataPemeriksaanLengkap?.kulitBulu} />}
                    {dataPemeriksaanLengkap?.membranMukosa && <AccordionItem title={'Membran Mukosa'} data={dataPemeriksaanLengkap?.membranMukosa} />}
                    {dataPemeriksaanLengkap?.kelenjarLimfa && <AccordionItem title={'Kelenjar Limfa'} data={dataPemeriksaanLengkap?.kelenjarLimfa} />}
                    {dataPemeriksaanLengkap?.muskulosketal && <AccordionItem title={'Muskuloskeletal'} data={dataPemeriksaanLengkap?.muskulosketal} />}
                    {dataPemeriksaanLengkap?.sistemSirkulasi && <AccordionItem title={'Sistem Sirkulasi'} data={dataPemeriksaanLengkap?.sistemSirkulasi} />}
                    {dataPemeriksaanLengkap?.sistemRespirasi && <AccordionItem title={'Sistem Respirasi'} data={dataPemeriksaanLengkap?.sistemRespirasi} />}
                    {dataPemeriksaanLengkap?.sistemDigesti && <AccordionItem title={'Sistem Digesti'} data={dataPemeriksaanLengkap?.sistemDigesti} />}
                    {dataPemeriksaanLengkap?.sistemUrogenital && <AccordionItem title={'Sistem Urogenital'} data={dataPemeriksaanLengkap?.sistemUrogenital} />}
                    {dataPemeriksaanLengkap?.sistemSyaraf && <AccordionItem title={'Sistem Syaraf'} data={dataPemeriksaanLengkap?.sistemSyaraf} />}
                    {dataPemeriksaanLengkap?.mataDanTelinga && <AccordionItem title={'Mata Dan Telinga'} data={dataPemeriksaanLengkap?.mataDanTelinga} />}

                  </Grid>
                </Card>
              </Grid> */}
            </>
          )}



        </Grid>
      </Container>
      {openSurveilansModal.value && (
        <SurveilansPenyakitModal
          open={openSurveilansModal.value}
          onClose={openSurveilansModal.onFalse}
          type={type}
          dataSurveilansTernak={dataSurveilansTernak}
          refetch={refetch}
        />
      )}
      {openPemeriksaanLengkapModal.value && (
        <PemeriksaanLengkapModal
          open={openPemeriksaanLengkapModal.value}
          onClose={openPemeriksaanLengkapModal.onFalse}
          type={type}
          refetch={refetch}
          dataSurveilans={dataSurveilansTernak}
        />
      )}
      <DiagnosisModal
        open={openDiagnosisModal1.value}
        onClose={openDiagnosisModal1.onFalse}
        handleNext={handleNext}
        diagnosisData={dataPemeriksaanLengkap?.diagnosaSementara?.diagnosaPenyakit}
      />

      <DiagnosisModal2
        open={openDiagnosisModal2.value}
        onClose={openDiagnosisModal2.onFalse}
        handleBack={handleBack}
        diagnosisData={dataPemeriksaanLengkap?.diagnosaSementara?.diagnosaPenyakit}
      />

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="top-right">
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              popover.onClose();
              { option.value === 'evaluasi' && openSurveilansModal.onTrue() }
              { option.value === 'recordAnamnesis' && openPemeriksaanLengkapModal.onTrue(); }
              { option.value === 'diagnosis' && openDiagnosisModal1.onTrue(); }
            }}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
