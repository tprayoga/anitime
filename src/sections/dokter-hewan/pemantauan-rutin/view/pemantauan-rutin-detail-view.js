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
import AccordionItem from '../../surveilans/accordion-item';


// ----------------------------------------------------------------------

export default function PemantauanRutinDetailView({ id }) {
    const popover = usePopover();


    const settings = useSettingsContext();


    const { data: dataPemantauanRutin, getOneData: getPemeriksaanLengkap } = useGetOneData();



    const refetch = () => {
        getPemeriksaanLengkap(id, 'pemantauanRutin', 'ternak, createdBy');
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
                                    { name: 'Pemantauan Rutin', href: paths.dokterHewan.surveilans.root },
                                    { name: `${dataPemantauanRutin?.expand?.ternak?.RFID}` },
                                ]}
                            />
                        </Stack>
                    </Grid>

                    {dataPemantauanRutin && (
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
                                            Pemantauan Rutin
                                        </Button>
                                    </Box>
                                    <Grid container spacing={3} px={4} py={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">RFID Ternak</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemantauanRutin?.expand?.ternak?.RFID}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Tanggal Laporan</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {fDate(dataPemantauanRutin?.created)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Jenis Hewan</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemantauanRutin?.expand?.ternak?.jenisHewan}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Jenis Kelamin</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemantauanRutin?.expand?.ternak?.jenisKelamin}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Warna Bulu</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemantauanRutin?.expand?.ternak?.warna}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Jenis Breed</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemantauanRutin?.expand?.ternak?.jenisBreed}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>Petugas</Typography>
                                            <Typography variant='body2' fontWeight={'bold'} sx={{ textTransform: 'capitalize' }}>{dataPemantauanRutin?.expand?.createdBy?.name}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Anamnesis</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemantauanRutin?.anamnesis}
                                            </Typography>
                                        </Grid>

                                    </Grid>
                                    <Grid container spacing={3} px={4} py={2}>
                                        <Typography variant='body2' ml={2} >Formulir SOAP</Typography>
                                        <AccordionItem title={'Subjektif'} data={dataPemantauanRutin?.subjektif} />
                                        <AccordionItem title={'Objektif'} data={dataPemantauanRutin?.objektif} />
                                        <AccordionItem title={'Asesmen'} data={dataPemantauanRutin?.asesmen} />
                                        <AccordionItem title={'Plan'} data={dataPemantauanRutin?.plan} />
                                        <AccordionItem title={'Pemeriksaan'} data={dataPemantauanRutin?.pemeriksaan} />
                                    </Grid>
                                </Card>

                            </Grid>
                        </>
                    )}

                </Grid>
            </Container>

        </>
    );
}
