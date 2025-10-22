'use client';

import { paths } from 'src/routes/paths';
import uuidv4 from 'src/utils/uuidv4';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Breadcrumbs,
  Card,
  IconButton,
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
import KandangTableRow from '../kandang-table-row';
import KandangTableToolbar from '../kandang-table-toolbar';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import OverviewKandang from '../overview-kandang';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
import ComponentBlock from 'src/sections/_examples/component-block';
import Link from 'next/link';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import RiwayatTableRow from '../riwayat-table-row';
import { useGetKandang } from 'src/api/peternakan/kandang';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';

// ----------------------------------------------------------------------

export default function KandangDetailView({ id }) {
  const { user } = useMockedUser();

  const {
    data: dataKandang,
    getKandang,
    getFullKandang,
    loadingKandang,
    totalData,
    empty,
    error,
    fullDataKandang,
    getDetailKandang,
    detailDataKandang,
  } = useGetKandang();

  const table = useTable();

  const theme = useTheme();

  const settings = useSettingsContext();

  const denseHeight = table.dense ? 60 : 80;

  const confirm = useBoolean();

  const [filters, setFilters] = useState('');

  const TABLE_HEAD = [
    { id: 'created', label: 'Tanggal' },
    { id: 'ternak.jenisHewan', label: 'Jenis Hewan' },
    { id: 'status', label: 'Status' },
    { id: 'tujuan', label: 'Tujuan' },
    {},
  ];

  const collection = {
    name: 'laluLintasTernak',
    searchFilter: 'tujuan',
    filter: [`kandang = "${id}"`],
  };

  const luas =
    detailDataKandang?.satuanKandang === 'Ha'
      ? detailDataKandang?.luasKandang / 10000
      : detailDataKandang?.luasKandang;

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    getDetailKandang(id);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AnitimeBreadcrumbs
            links={[
              { name: 'Data Kandang', href: paths.peternakan.kandang.root },
              { name: detailDataKandang?.namaKandang },
            ]}
            // sx={{ mb: { xs: 3, md: 5 } }}
          />
        </Grid>

        <Grid xs={12} md={12}>
          <Card>
            <Stack spacing={2} direction={'row'} p={2} alignItems={'center'}>
              <Label
                color="info"
                sx={{
                  px: 2,
                  py: 2.5,
                  fontSize: 16,
                  borderRadius: '20px',
                  color: '#000000',
                }}
                startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'info.main' }} />}
              >
                Informasi Dasar
              </Label>

              <Typography>
                <b>
                  Nama Kandang :{' '}
                  <span
                    style={{ fontWeight: 'normal' }}
                  >{`${detailDataKandang?.namaKandang}`}</span>
                </b>
              </Typography>

              <Typography>
                <b>
                  Luas Kandang :{' '}
                  <span
                    style={{ fontWeight: 'normal' }}
                  >{`${luas} ${detailDataKandang?.satuanKandang}`}</span>
                </b>
              </Typography>

              <Typography>
                <b>
                  Jumlah Ternak :{' '}
                  <span style={{ fontWeight: 'normal' }}>{`${
                    detailDataKandang?.ternak?.length || 0
                  }`}</span>
                </b>
              </Typography>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={12}>
          <Card>
            {/* <KandangTableToolbar
              filters={filters}
              setFilters={setFilters}
              onFilters={handleFilters}
            /> */}

            <TableAnitimeCustom
              label="History Lalu Lintas Ternak"
              filters={filters}
              tableHead={TABLE_HEAD}
              // collectionName="laluLintasTernak"
              // searchLabel="tujuan"
              collection={collection}
              expand="kandang, ternak"
              tableRowComponent={RiwayatTableRow}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
