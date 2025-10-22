'use client';

import { paths } from 'src/routes/paths';
import uuidv4 from 'src/utils/uuidv4';
import { RouterLink } from 'src/routes/components';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Typography } from '@mui/material';

import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import { RHFSelect } from 'src/components/hook-form';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import SurveilansPenyakitModal from 'src/components/modal/dokter-hewan/surveilans-penyakit-modal';
import { useGetOneData } from 'src/api/custom-domba-api';
import { fDate } from 'src/utils/format-time';
import pb from 'src/utils/pocketbase';
import { FILES_API, FILES_DOMAIN_API } from 'src/config-global';
import Label from 'src/components/label';
import { useAuthContext } from 'src/auth/hooks';
import CarouselCustom from 'src/components/custom-carousel';

// ----------------------------------------------------------------------

export default function SurveilansDetailView({ id }) {
  const openTransaksiModal = useBoolean();
  const settings = useSettingsContext();
  const user = useAuthContext();

  const { data, error, loading, getOneData } = useGetOneData();

  const [type, setType] = useState('CREATE');

  useEffect(() => {
    if (id) {
      getOneData(id, 'surveilansDokter', 'ternak, createdBy');
    }
  }, []);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  const IMAGE_URL = data?.fotoGejala?.map((image) => {
    return {
      src: `${FILES_API}/${data?.collectionId}/${data?.id}/${image}?token=${pb.authStore.token}`,
    };
  });

  const SAMPLE_IMAGE_URL = data?.jenisSample?.map((image) => {
    return {
      src: `${FILES_API}/${data?.collectionId}/${data?.id}/${image}?token=${pb.authStore.token}`,
    };
  });

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid
            xs={6}
            // md={12}
          >
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <AnitimeBreadcrumbs
                links={[
                  { name: 'Data Surveilans', href: paths.dokterHewan.surveilans.root },
                  { name: `${id}` },
                ]}
              />
            </Stack>
            <Card sx={{ mt: 1 }}>
              <Box sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  color="inherit"
                  size="large"
                  sx={{ fontSize: 17 }}
                >
                  Informasi
                </Button>
              </Box>
              <Grid container spacing={3} px={4} py={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">No FID Ternak</Typography>
                  <Typography variant="body2" fontWeight={'bold'}>
                    {data?.expand?.ternak?.noFID}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Tanggal Laporan</Typography>
                  <Typography variant="body2" fontWeight={'bold'}>
                    {fDate(data?.created)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    Perkiraan Waktu Munculnya Gejala Pertama Kali
                  </Typography>
                  <Typography variant="body2" fontWeight={'bold'}>
                    {fDate(data?.perkiraanWaktu)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Petugas</Typography>
                  <Typography
                    variant="body2"
                    fontWeight={'bold'}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {data?.expand?.createdBy?.name}
                  </Typography>
                </Grid>
                <Grid item xs={15}>
                  <Typography variant="body2">Gejala</Typography>

                  <Stack flexDirection={'row'} flexWrap={'wrap'} spacing={1} mt={1}>
                    {data?.gejalaMuncul.map((dataSurveilansTernak, index) => (
                      <Label variant="soft" color={'primary'} key={index}>
                        {dataSurveilansTernak}
                      </Label>
                    ))}
                    {data?.gejalaLain && (
                      <Label variant="soft" color={'primary'}>
                        {data?.gejalaLain}
                      </Label>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Foto Gejala</Typography>
                  <Stack flexDirection={'row'} spacing={1} flexWrap={'wrap'}>
                    {/* {IMAGE_URL?.map((url, index) => (
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
                    <CarouselCustom data={IMAGE_URL} />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">{`Jenis Sample : ${
                    SAMPLE_IMAGE_URL?.length === 0 ? ' - ' : ''
                  }`}</Typography>
                  <Stack flexDirection={'row'} spacing={1} flexWrap={'wrap'}>
                    {/* {SAMPLE_IMAGE_URL?.map((url, index) => (
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
                    <CarouselCustom data={SAMPLE_IMAGE_URL} />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">Catatan : </Typography>
                  <Typography variant="body2" fontWeight={'bold'}>
                    {data?.catatan}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
      {openTransaksiModal.value && (
        <SurveilansPenyakitModal
          open={openTransaksiModal.value}
          onClose={openTransaksiModal.onFalse}
          type={type}
          dataTernak={data}
        />
      )}
    </>
  );
}
