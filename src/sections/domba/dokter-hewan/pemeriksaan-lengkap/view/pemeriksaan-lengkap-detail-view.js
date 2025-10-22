'use client';

import { paths } from 'src/routes/paths';
import uuidv4 from 'src/utils/uuidv4';
import { RouterLink } from 'src/routes/components';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, MenuItem, Typography } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import { RHFSelect } from 'src/components/hook-form';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import SurveilansPenyakitModal from 'src/components/modal/dokter-hewan/surveilans-penyakit-modal';
import { useGetFirstListItem, useGetOneData } from 'src/api/custom-domba-api';
import { fDate } from 'src/utils/format-time';

import AccordionItem from '../../surveilans/accordion-item';

// ----------------------------------------------------------------------

export default function PemeriksaanLengkapDetailView({ id }) {
  const popover = usePopover();

  const settings = useSettingsContext();

  const { data: dataPemeriksaanLengkap, getOneData: getPemeriksaanLengkap } = useGetOneData();

  const refetch = () => {
    getPemeriksaanLengkap(id, 'pemeriksaanLengkap', 'createdBy');
  };

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, []);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <AnitimeBreadcrumbs
                links={[
                  { name: 'Pemeriksaan Lengkap', href: paths.dokterHewan.surveilans.root },
                  { name: `${dataPemeriksaanLengkap?.anamnesis?.noFID}` },
                ]}
              />
            </Stack>
          </Grid>

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
                      <Typography variant="body2">No FID Ternak</Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {dataPemeriksaanLengkap?.anamnesis?.noFID}
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
                      <Typography variant="body2">Berat</Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {/* {dataPemeriksaanLengkap?.anamnesis?.warna} */}
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
                      <Typography variant="body2">Petugas</Typography>
                      <Typography
                        variant="body2"
                        fontWeight={'bold'}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {dataPemeriksaanLengkap?.expand?.createdBy?.name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} px={4} py={2}>
                    <Typography variant="body2" ml={2}>
                      Pemeriksaan Lengkap
                    </Typography>
                    {dataPemeriksaanLengkap?.kondisiUmum && (
                      <AccordionItem
                        title={'Kondisi Umum'}
                        data={dataPemeriksaanLengkap?.kondisiUmum}
                      />
                    )}
                    {dataPemeriksaanLengkap?.pemeriksaanFisik && (
                      <AccordionItem
                        title={'Pemeriksaan Fisik'}
                        data={dataPemeriksaanLengkap?.pemeriksaanFisik}
                      />
                    )}

                    {dataPemeriksaanLengkap?.kulitBulu && (
                      <AccordionItem
                        title={'Kulit Bulu'}
                        data={dataPemeriksaanLengkap?.kulitBulu}
                      />
                    )}
                    {dataPemeriksaanLengkap?.membranMukosa && (
                      <AccordionItem
                        title={'Membran Mukosa'}
                        data={dataPemeriksaanLengkap?.membranMukosa}
                      />
                    )}
                    {dataPemeriksaanLengkap?.kelenjarLimfa && (
                      <AccordionItem
                        title={'Kelenjar Limfa'}
                        data={dataPemeriksaanLengkap?.kelenjarLimfa}
                      />
                    )}
                    {dataPemeriksaanLengkap?.muskulosketal && (
                      <AccordionItem
                        title={'Muskuloskeletal'}
                        data={dataPemeriksaanLengkap?.muskulosketal}
                      />
                    )}
                    {dataPemeriksaanLengkap?.sistemSirkulasi && (
                      <AccordionItem
                        title={'Sistem Sirkulasi'}
                        data={dataPemeriksaanLengkap?.sistemSirkulasi}
                      />
                    )}
                    {dataPemeriksaanLengkap?.sistemRespirasi && (
                      <AccordionItem
                        title={'Sistem Respirasi'}
                        data={dataPemeriksaanLengkap?.sistemRespirasi}
                      />
                    )}
                    {dataPemeriksaanLengkap?.sistemDigesti && (
                      <AccordionItem
                        title={'Sistem Digesti'}
                        data={dataPemeriksaanLengkap?.sistemDigesti}
                      />
                    )}
                    {dataPemeriksaanLengkap?.sistemUrogenital && (
                      <AccordionItem
                        title={'Sistem Urogenital'}
                        data={dataPemeriksaanLengkap?.sistemUrogenital}
                      />
                    )}
                    {dataPemeriksaanLengkap?.sistemSyaraf && (
                      <AccordionItem
                        title={'Sistem Syaraf'}
                        data={dataPemeriksaanLengkap?.sistemSyaraf}
                      />
                    )}
                    {dataPemeriksaanLengkap?.mataDanTelinga && (
                      <AccordionItem
                        title={'Mata Dan Telinga'}
                        data={dataPemeriksaanLengkap?.mataDanTelinga}
                      />
                    )}
                    {dataPemeriksaanLengkap?.diagnosaSementara && (
                      <AccordionItem
                        title={'Diagnosa Sementara'}
                        data={dataPemeriksaanLengkap?.diagnosaSementara}
                      />
                    )}
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
    </>
  );
}
