'use client';

import { paths } from 'src/routes/paths';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Card,
  Typography,
} from '@mui/material';



import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import RiwayatTableRow from '../riwayat-table-row';
import { useGetOneData } from 'src/api/custom-api';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'created', label: 'Tanggal' },
  { id: 'ternak.jenisHewan', label: 'Jenis Hewan', disabled : true },
  { id: 'lokasiTujuan', label: 'Lokasi Tujuan', disabled : true },
  { id: 'tujuan', label: 'Tujuan', disabled : true },
  {},
];

export default function KandangDetailView({ id }) {

  const settings = useSettingsContext();

  const {
    data,
    error,
    loading,
    getOneData
  } = useGetOneData();

  const collection = {
    name: 'laluLintasTernak',
    searchFilter: 'tujuan',
    filter: [
      `kandang = "${id}"`
    ]
  }

  useEffect(() => {
    if (id) {
      getOneData(id, 'kandang')
    }
  }, []);


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        
        <Grid xs={12}>
          <Card>
            <Stack spacing={2} direction={'row'} p={1} alignItems={'center'}>
              <Label
                color="info"
                sx={{
                  px: 2,
                  py: 2.5,
                  fontSize: 16,
                  borderRadius: '20px',
                  color: '#000000'
                }}
                startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'info.main' }} />}
              >
                Informasi Dasar
              </Label>

              <Typography>
                <b>
                  Nama Kandang :{' '}
                  <span style={{ fontWeight: 'normal' }}>{`${data?.namaKandang}`}</span>
                </b>
              </Typography>

              <Typography>
                <b>
                  Luas Kandang :{' '}
                  <span style={{ fontWeight: 'normal' }}>{`${data?.satuanKandang === 'Ha' ? data?.luasKandang / 10000 : data?.luasKandang} ${data?.satuanKandang}`}</span>
                </b>
              </Typography>

              <Typography>
                <b>
                  Jumlah Ternak :{' '}
                  <span
                    style={{ fontWeight: 'normal' }}
                  >{`${data?.ternak.length}`}</span>
                </b>
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12}>
          <TableAnitimeCustom
            label="History Lalu Lintas Ternak"
            filters={''}
            tableHead={TABLE_HEAD}
            collection={collection}
            expand="kandang, ternak"
            tableRowComponent={RiwayatTableRow}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
