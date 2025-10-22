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
import { useGetFirstListItem, useGetOneData } from 'src/api/custom-api';
import { fDate } from 'src/utils/format-time';

import AccordionItem from '../../surveilans/accordion-item';


// ----------------------------------------------------------------------

export default function RegistrasiObatDetailView({ id }) {
    const popover = usePopover();


    const settings = useSettingsContext();


    const { data: dataPemeriksaanLengkap, getOneData: getPemeriksaanLengkap } = useGetOneData();



    const refetch = () => {
        getPemeriksaanLengkap(id, 'listObat', 'createdBy');
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
                                    { name: 'Registrasi Obat', href: paths.dokterHewan.surveilans.root },
                                    { name: `${dataPemeriksaanLengkap?.namaObat}` },
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
                                            Registrasi Obat
                                        </Button>
                                    </Box>
                                    <Grid container spacing={3} px={4} py={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Dibuat pada tanggal</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {fDate(dataPemeriksaanLengkap?.created)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Nama Obat</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.namaObat}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Jenis Obat</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.jenisObat}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Bahan Aktif</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.bahanAktif}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Konsentrasi Bahan Aktif</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.konsentrasiBahanAktif}%
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Merk Obat</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.merkObat}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2">Penyimpanan</Typography>
                                            <Typography variant="body2" fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.persyaratanPenyimpanan}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>Ukuran Kemasan</Typography>
                                            <Typography variant='body2' fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.ukuranKemasan}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>Dosis</Typography>
                                            <Typography variant='body2' fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.dosis} {dataPemeriksaanLengkap?.satuanDosis}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>Lama Pengobatan</Typography>
                                            <Typography variant='body2' fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.lamaPengobatan} {dataPemeriksaanLengkap?.satuanLamaPengobatan}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>Interval Pengobatan</Typography>
                                            <Typography variant='body2' fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.intervalPengobatan} {dataPemeriksaanLengkap?.satuanIntervalPengobatan}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>Cara Pemberian</Typography>
                                            <Typography variant='body2' fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.caraPemberian}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>Peringatan dan Kontradiksi</Typography>
                                            <Typography variant='body2' fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.peringatanKontradiksi}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant='body2'>Fungsi Spesifik</Typography>
                                            <Typography variant='body2' fontWeight={'bold'}>
                                                {dataPemeriksaanLengkap?.fungsiSpesifik}
                                            </Typography>
                                        </Grid>
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
