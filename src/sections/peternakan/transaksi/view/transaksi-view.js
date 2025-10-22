'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useMemo } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';

import TransaksiToolbar from '../transaksi-table-toolbar';
import { Grid, Stack, Typography } from '@mui/material';
import OverviewTransaksi from '../overview-transaksi';
import { Box, useTheme } from '@mui/system';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
import TransaksiPemasukanTableRow from '../transaksi-pendapatan-table-row';
import TransaksiPengeluaranTableRow from '../transaksi-pengeluaran-table-row';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const KATEGORI_OPTIONS = [
  { value: 'pemasukan', label: 'Pemasukan' },
  { value: 'pengeluaran', label: 'Pengeluaran' },
];

const TABLE_HEAD_PEMASUKAN = [
  { id: 'tanggal', label: 'Tanggal' },
  { id: 'jenisPemasukan', label: 'Jenis Pemasukan' },
  { id: 'jumlahPemasukan', label: 'Jumlah' },
  { id: 'nilaiPemasukan', label: 'Nilai Pemasukan' },
  {},
];

const TABLE_HEAD_PENGELUARAN = [
  { id: 'tanggal', label: 'Tanggal' },
  { id: 'jenisPengeluaran', label: 'Jenis Pengeluaran' },
  { id: 'jumlahPengeluaran', label: 'Jumlah' },
  { id: 'nilaiPengeluaran', label: 'Nilai Pengeluaran' },
  {},
];

const overviewData = [
  {
    title: 'Daging Sapi Tingkat Pemotongan/RPH',
    price: 120900,
    icon: '/assets/illustrations/kandang/check.png',
    wilayah: 'Wilayah Nasional',
  },
  {
    title: 'Daging Sapi Tingkat Pemotongan/RPH',
    price: 135000,
    icon: '/assets/illustrations/kandang/pending.svg',
    wilayah: 'Wilayah Lampung',
  },
];

// ----------------------------------------------------------------------

export default function TransaksiView() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [refetchPemasukan, setRefetchPemasukan] = useState(false);
  const [refetchPengeluaran, setRefetchPengeluaran] = useState(false);

  const [filters, setFilters] = useState('');
  const [category, setCategory] = useState('pemasukan');

  const collectionPemasukan = {
    name: 'pemasukan',
    searchFilter: 'jenisPemasukan',
    filter: [`peternakan = "${user.id}"`],
  };

  const collectionPengeluaran = {
    name: 'pengeluaran',
    searchFilter: 'jenisPengeluaran',
    filter: [`peternakan = "${user.id}"`],
  };

  const handleFilters = useCallback((name, value) => {
    setFilters(value);
  }, []);

  const toggleCategory = useCallback(() => {
    if (category === 'pemasukan') {
      setCategory('pengeluaran');
    } else {
      setCategory('pemasukan');
    }
  }, [category]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Grid container spacing={2}>
          {overviewData.map((item, index) => (
            <Grid item key={index} xs={12} md={6}>
              <OverviewTransaksi
                price={item.price}
                title={item.title}
                img={item.icon}
                type={item.type}
                wilayah={item.wilayah}
                chart={{
                  colors: [theme.palette.info.light, theme.palette.info.main],
                  series: [56, 47, 40, 62, 73, 30, 23, 54, 67, 68],
                }}
              />
            </Grid>
          ))}
        </Grid>
        <TransaksiToolbar onFilters={handleFilters} filters={filters} />
        <Stack
          spacing={2}
          sx={{
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            alignItems: {
              xs: 'start',
              sm: 'end',
            },
          }}
        >
          <Tabs
            value={category}
            onChange={toggleCategory}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {KATEGORI_OPTIONS.map((tab) => (
              <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
            ))}
          </Tabs>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              marginLeft: {
                xs: 2,
                sm: 'auto',
              },
            }}
          ></Box>
        </Stack>

        {category === 'pemasukan' && (
          <TableAnitimeCustom
            label="Data Pemasukan"
            filters={filters}
            tableHead={TABLE_HEAD_PEMASUKAN}
            collection={collectionPemasukan}
            tableRowComponent={TransaksiPemasukanTableRow}
            refetch={refetchPemasukan}
            sx={{ marginTop: 2 }}
          />
        )}

        {category === 'pengeluaran' && (
          <TableAnitimeCustom
            label="Data Pengeluaran"
            filters={filters}
            tableHead={TABLE_HEAD_PENGELUARAN}
            collection={collectionPengeluaran}
            tableRowComponent={TransaksiPengeluaranTableRow}
            refetch={refetchPengeluaran}
            sx={{ marginTop: 2 }}
          />
        )}
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
