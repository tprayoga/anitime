'use client';

import { paths } from 'src/routes/paths';
import uuidv4 from 'src/utils/uuidv4';
import { RouterLink } from 'src/routes/components';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Avatar, Box, Card, Typography } from '@mui/material';

import { useTable } from 'src/components/table';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import { useGetOneData } from 'src/api/custom-api';
import { FILES_DOMAIN, FILES_DOMAIN_API, FILES_API } from 'src/config-global';
import pb from 'src/utils/pocketbase';

import './styles.css';

// ----------------------------------------------------------------------

export default function LaluLintasDetailView({ id }) {
  const { user } = useMockedUser();

  const table = useTable();

  const theme = useTheme();

  const settings = useSettingsContext();

  const denseHeight = table.dense ? 60 : 80;

  const { data, error, loading, getOneData } = useGetOneData();

  const confirm = useBoolean();

  const IMAGE_URL = `${FILES_API}/${data?.collectionId}/${data?.id}/${data?.fotoSertifikat}?token=`;

  useEffect(() => {
    if (id) {
      getOneData(id, 'laluLintasTernak', 'kandang, ternak');
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
              { name: 'Data Lalu Lintas Ternak', href: paths.peternakan.laluLintas.root },
              { name: `${data?.expand?.ternak?.RFID}` },
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
                  color="inherit"
                  size="large"
                  sx={{ fontSize: 17 }}
                >
                  Informasi Dasar
                </Button>
              </Box>
              <Stack sx={{ p: 3, px: 4 }} spacing={1}>
                <Typography>{`Kandang : ${data?.expand?.kandang?.namaKandang}`}</Typography>
                <Typography>{`Sertifikat Kesehatan : ${data?.sertifikat}`}</Typography>
                <Typography>{`Foto Sertifikat Kesehatan`}</Typography>
                {/* <Image src="https://ani-pocketbase.bodha.co.id/650I4ERK3MK_t5wsKy8Lc2.jpg" width={500} height={500}/> */}
                <Box
                  className="skeleton"
                  component="img"
                  alt="image"
                  src={IMAGE_URL}
                  sx={{
                    position: 'relative',
                    width: 150,
                    height: 'auto',
                    objectFit: 'contain',
                    my: 1,
                  }}
                />
                <Typography>{`Petugas / Dokter Hewan : ${data?.petugas}`}</Typography>
                <Typography>{`Tujuan Lalu Lintas : ${data?.tujuan}`}</Typography>
                <Typography>{`Body Conditional Score (BSC) : ${data?.expand?.ternak?.bodyConditionalScore}`}</Typography>
                <Typography>{`Berat : ${data?.expand.ternak.berat} Kg`}</Typography>
                <Typography>{`Lokasi Tujuan : ${data?.lokasiTujuan}`}</Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
