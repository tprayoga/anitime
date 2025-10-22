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

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
import ComponentBlock from 'src/sections/_examples/component-block';
import Link from 'next/link';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import { RHFSelect } from 'src/components/hook-form';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useFindLaluLintasTernak } from 'src/api/anak-kandang/lalu-lintas-ternak';
import { FILES_API, FILES_DOMAIN_API } from 'src/config-global';
import pb from 'src/utils/pocketbase';
import { useGetOneData } from 'src/api/custom-api';
import Image from 'next/image';
import CarouselCustom from 'src/components/custom-carousel';

// ----------------------------------------------------------------------

export default function LaluLintasDetailView({ id }) {

  const popover = usePopover();
  const settings = useSettingsContext();


  const [status, setStatus] = useState('');

  const { data, error, loading, getOneData: findLaluLintasTernak } = useGetOneData();

  // const IMAGE_URL = `${FILES_DOMAIN_API}/${data?.collectionId}/${data?.id}/${data?.fotoSertifikat}?token=${pb.authStore.token}`;
  const IMAGE_URL = [
    { src: `${FILES_API}/${data?.collectionId}/${data?.id}/${data?.fotoSertifikat}?token=${pb.authStore.token}` }
  ]


  const statusOptions = [
    { value: 'pakan', label: 'Pemberian Pakan' },
    { value: 'welfare', label: 'Catatan Welfare' },
    { value: 'surveilans', label: 'Surveilans Penyakit' },
  ];

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  useEffect(() => {
    if (id) {
      findLaluLintasTernak(id, 'laluLintasTernak', 'kandang, ternak');
    }
  }, []);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AnitimeBreadcrumbs
            links={[
              { name: 'Data Lalu Lintas Ternak', href: paths.anakKandang.laluLintas.root },
              { name: `${data?.expand.ternak.RFID}` },
            ]}
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
              <Stack sx={{ p: 3, px: 4 }} spacing={1}>
                <Typography variant='body2'>{`Kandang : ${data?.expand.kandang.namaKandang}`}</Typography>
                <Typography variant='body2'>{`Sertifikat Kesehatan : ${data?.sertifikat}`}</Typography>
                <Typography variant='body2'>{`Foto Sertifikat Kesehatan`}</Typography>
                {/* <Box
                  component="img"
                  alt="invite"
                  src={IMAGE_URL}
                  sx={{
                    position: 'relative',
                    width: 150,
                    height: 'auto',
                    objectFit: 'contain',
                    my: 1,
                  }}
                /> */}
                <CarouselCustom data={IMAGE_URL} />

                <Typography variant='body2'>{`Petugas / Dokter Hewan : ${data?.petugas}`}</Typography>
                <Typography variant='body2'>{`Tujuan Lalu Lintas : ${data?.tujuan}`}</Typography>
                <Typography variant='body2'>{`Body Conditional Score (BSC) : ${data?.expand.ternak.bodyConditionalScore}`}</Typography>
                <Typography variant='body2'>{`Berat : ${data?.expand.ternak.berat}`}</Typography>
                <Typography variant='body2'>{`Lokasi Tujuan : ${data?.lokasiTujuan}`}</Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <CustomPopover
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
      </CustomPopover>
    </Container>
  );
}
