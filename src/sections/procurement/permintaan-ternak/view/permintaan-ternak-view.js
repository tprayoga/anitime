'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useMemo } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { _roles, _userList } from 'src/_mock';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import { Grid, Stack, Typography } from '@mui/material';

import { Box, useTheme } from '@mui/system';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
import PermintaanTableRow from '../permintaan-table-row';
import PermintaanTableToolbar from '../permintaan-table-toolbar';
import { useGetData } from 'src/api/custom-api';

// ----------------------------------------------------------------------

const KATEGORI_OPTIONS = [
  { value: 'Request', label: 'Request' },
  { value: 'Diproses', label: 'Diproses' },
  { value: 'Diterima', label: 'Diterima' },
  { value: 'Ditolak', label: 'Ditolak' },
];

const TABLE_HEAD_PERMINTAAN_TERNAK = [
  { id: 'jenisBreed', label: 'Jenis Breed' },
  { id: 'berat', label: 'Berat' },
  { id: 'jumlah', label: 'Jumlah Permintaan' },
  { id: 'status', label: 'Status' },
  {},
];

const TABLE_HEAD_PENGELUARAN = [
  { id: 'tanggal', label: 'Tanggal' },
  { id: 'jenisPengeluaran', label: 'Jenis Pengeluaran' },
  { id: 'jumlahPengeluaran', label: 'Jumlah' },
  { id: 'nilaiPengeluaran', label: 'Nilai Pengeluaran' },
  {},
];

// ----------------------------------------------------------------------

export default function PermintaanTernakView() {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [filters, setFilters] = useState('');
  const [category, setCategory] = useState('Request');

  const { totalData: totalRequestData, getData: getRequestData } = useGetData();
  const { totalData: totalDitolakData, getData: getDitolakData } = useGetData();
  const { totalData: totalDiterimaData, getData: getDiterimaData } = useGetData();
  const { totalData: totalDiprosesData, getData: getDiprosesData } = useGetData();

  const [refetch, setRefetch] = useState(false);

  const collectionRequest = {
    name: 'permintaanTernak',
    searchFilter: 'jenisBreed',
    filter: [`status = "Ditunda"`],
  };

  const collectionDiterima = {
    name: 'permintaanTernak',
    searchFilter: 'jenisBreed',
    filter: [`status = "Diterima"`],
  };

  const collectionDitolak = {
    name: 'permintaanTernak',
    searchFilter: 'jenisBreed',
    filter: [`status = "Ditolak"`],
  };
  const collectionDiproses = {
    name: 'permintaanTernak',
    searchFilter: 'jenisBreed',
    filter: [`status = "Diproses"`],
  };

  const fetchAllData = () => {
    getRequestData(1, 5, `status = "Ditunda"`, '-created', 'permintaanTernak');
    getDiterimaData(1, 5, `status = "Diterima"`, '-created', 'permintaanTernak');
    getDitolakData(1, 5, `status = "Ditolak"`, '-created', 'permintaanTernak');
    getDiprosesData(1, 5, `status = "Diproses"`, '-created', 'permintaanTernak');
  };

  const handleFilters = useCallback((name, value) => {
    setFilters(value);
  }, []);

  const toggleCategory = useCallback((value) => {
    setCategory(value);
  }, []);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack
          spacing={2}
          sx={{
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            alignItems: {
              xs: 'center',
            },
            justifyContent: 'space-between',
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
                onClick={() => toggleCategory(tab.value)}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'Request' && 'warning') ||
                      (tab.value === 'Diterima' && 'success') ||
                      (tab.value === 'Ditolak' && 'error') ||
                      (tab.value === 'Diproses' && 'info')
                    }
                  >
                    {tab.value === 'Request' && totalRequestData}
                    {tab.value === 'Diterima' && totalDiterimaData}
                    {tab.value === 'Ditolak' && totalDitolakData}
                    {tab.value === 'Diproses' && totalDiprosesData}
                  </Label>
                }
              />
            ))}
          </Tabs>
          <PermintaanTableToolbar
            filters={filters}
            onFilters={handleFilters}
            roleOptions={_roles}
          />
        </Stack>

        {category === 'Request' && (
          <TableAnitimeCustom
            label="Permintaan Ternak"
            filters={filters}
            tableHead={TABLE_HEAD_PERMINTAAN_TERNAK}
            collection={collectionRequest}
            tableRowComponent={PermintaanTableRow}
            category={category}
            fetch={fetchAllData}
            refetch={refetch}
            setRefetch={setRefetch}
            sx={{ marginTop: 2 }}
          />
        )}
        {category === 'Diproses' && (
          <TableAnitimeCustom
            label="Permintaan Ternak"
            filters={filters}
            tableHead={TABLE_HEAD_PERMINTAAN_TERNAK}
            collection={collectionDiproses}
            tableRowComponent={PermintaanTableRow}
            category={category}
            fetch={fetchAllData}
            refetch={refetch}
            setRefetch={setRefetch}
            sx={{ marginTop: 2 }}
          />
        )}

        {category === 'Diterima' && (
          <TableAnitimeCustom
            label="Permintaan Ternak"
            filters={filters}
            tableHead={TABLE_HEAD_PERMINTAAN_TERNAK}
            collection={collectionDiterima}
            tableRowComponent={PermintaanTableRow}
            sx={{ marginTop: 2 }}
          />
        )}
        {category === 'Ditolak' && (
          <TableAnitimeCustom
            label="Permintaan Ternak"
            filters={filters}
            tableHead={TABLE_HEAD_PERMINTAAN_TERNAK}
            collection={collectionDitolak}
            tableRowComponent={PermintaanTableRow}
            sx={{ marginTop: 2 }}
          />
        )}
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
