'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import TransaksiToolbar from '../surveilans-table-toolbar';
import { Grid, Stack, Typography } from '@mui/material';
import AddTransaksiModal from 'src/components/modal/finance/add-transaksi-pendapatan-modal';
import InvoiceModal from 'src/components/modal/finance/invoice-modal';
import { Box, useTheme } from '@mui/system';
import SurveilansTableRow from '../surveilans-table-row';
import LaporanSurveilansTableRow from '../laporan-surveilans-table-row';
import DataLingkunganTableRow from '../data-lingkungan-table-row';
import SurveilansPenyakitModal from 'src/components/modal/dokter-hewan/surveilans-penyakit-modal';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
import TableAnitimeDombaCustom from 'src/components/tableAnitimeDombaCustom';
import DataLingkunganModal from 'src/components/modal-domba/dokter-hewan/data-lingkungan-modal';
import SurveilansMandiriModal from 'src/components/modal-domba/dokter-hewan/surveilans-mandiri-modal';

// ----------------------------------------------------------------------

const KATEGORI_OPTIONS = [
  { value: 'surveilans', label: 'Surveilans' },
  { value: 'laporanSurveilans', label: 'Laporan Surveilans' },
  { value: 'dataLingkungan', label: 'Data Lingkungan' },
];

const TABLE_HEAD_SURVEILANS = [
  { id: 'ternak.noFID', label: 'No FID Ternak' },
  { id: 'created', label: 'Waktu dan Tanggal' },
  { id: 'gejalaMuncul', label: 'Gejala' },
  { id: 'perkiraanWaktu', label: 'Waktu Pertama Muncul Gejala' },
  { id: 'ternak.kandang.namaKandang', label: 'Lokasi' },
];
const TABLE_HEAD_LAPORAN_SURVEILANS = [
  { id: 'ternak.noFID', label: 'No FID Ternak' },
  { id: 'created', label: 'Waktu dan Tanggal' },
  { id: 'gejalaMuncul', label: 'Gejala' },
  { id: 'perkiraanWaktu', label: 'Waktu Pertama Muncul Gejala' },
  { id: 'ternak.kandang.namaKandang', label: 'Lokasi' },
  { id: 'status', label: 'Status' },
];
const TABLE_HEAD_DATA_LINGKUNGAN = [
  { id: 'created', label: 'Waktu' },

  { id: 'kelembaban', label: 'Kelembaban' },
  { id: 'suhu', label: 'Suhu' },
  { id: 'kondisiVentilasi', label: 'Kondisi Ventilasi' },
  { id: 'kebersihan', label: 'Kebersihan' },

  { id: 'deskripsiKondisiSekitar', label: 'Deskripsi Kondisi Sekitar' },
];

// ----------------------------------------------------------------------

export default function SurveilansView() {
  const settings = useSettingsContext();
  const openLingkunganModal = useBoolean();
  const openSurveilansModal = useBoolean();

  const [filters, setFilters] = useState('');
  const [category, setCategory] = useState('surveilans');

  const [refetchLingkungan, setRefetchLingkungan] = useState(false);
  const [refetchSurveilans, setRefetchSurveilans] = useState('false');
  const [type, setType] = useState('CREATE');

  const collectionDataLingkungan = {
    name: 'dataLingkungan',
    searchFilter: 'created',
    filter: [],
  };

  const collectionLaporanSurveilans = {
    name: 'surveilansTernak',
    searchFilter: 'ternak.noFID',
    filter: [],
  };

  const collectionSurveilans = {
    name: 'surveilansDokter',
    searchFilter: 'ternak.noFID',
    filter: ['surveilans = null'],
  };

  const handleClick = () => {
    if (category === 'dataLingkungan') {
      openLingkunganModal.onTrue();
    } else {
      openSurveilansModal.onTrue();
    }
  };

  const handleFilters = useCallback((name, value) => {
    setFilters(value);
  }, []);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <TransaksiToolbar filters={filters} onFilters={handleFilters} roleOptions={_roles} />

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
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {KATEGORI_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                onClick={() => setCategory(tab.value)}
              />
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
          >
            {(category === 'surveilans' || category === 'dataLingkungan') && (
              <Button color="primary" variant="contained" onClick={handleClick} sx={{ ml: 'auto' }}>
                + Tambah Data
              </Button>
            )}
          </Box>
        </Stack>

        {category === 'surveilans' && (
          <TableAnitimeDombaCustom
            label="Surveilans"
            filters={filters}
            tableHead={TABLE_HEAD_SURVEILANS}
            collection={collectionSurveilans}
            tableRowComponent={SurveilansTableRow}
            expand={'ternak, ternak.kandang, ternak.pen'}
            refetch={refetchSurveilans}
            sx={{ marginTop: 2 }}
          />
        )}
        {category === 'dataLingkungan' && (
          <TableAnitimeDombaCustom
            label="Data Lingkungan"
            filters={filters}
            tableHead={TABLE_HEAD_DATA_LINGKUNGAN}
            collection={collectionDataLingkungan}
            tableRowComponent={DataLingkunganTableRow}
            refetch={refetchLingkungan}
            sx={{ marginTop: 2 }}
          />
        )}

        {category === 'laporanSurveilans' && (
          <TableAnitimeDombaCustom
            label="Laporan Surveilans"
            filters={filters}
            tableHead={TABLE_HEAD_LAPORAN_SURVEILANS}
            collection={collectionLaporanSurveilans}
            tableRowComponent={LaporanSurveilansTableRow}
            // refetch={refetchSurveilans}
            expand={'ternak, ternak.kandang, ternak.pen'}
            sx={{ marginTop: 2 }}
          />
        )}
      </Container>

      {openLingkunganModal.value && (
        <DataLingkunganModal
          open={openLingkunganModal.value}
          onClose={openLingkunganModal.onFalse}
          setRefetchLingkungan={setRefetchLingkungan}
          setCategory={setCategory}
        />
      )}
      {openSurveilansModal.value && (
        <SurveilansMandiriModal
          open={openSurveilansModal.value}
          onClose={openSurveilansModal.onFalse}
          setRefetchSurveilans={setRefetchSurveilans}
          type={type}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------
