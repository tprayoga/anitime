'use client';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import LaluLintasTableRow from '../lalulintas-table-row';
import LaluLintasToolbar from '../lalulintas-table-toolbar';

import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { PencatatanLaluLintasModal } from 'src/components/modal/anak-kandang';
import { Box } from '@mui/system';

import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'ternak', label: 'RFID Ternak' },
  { id: 'kandang', label: 'Kandang' },
  { id: 'sertifikat', label: 'Sertifikat Kesehatan' },
  { id: 'petugas', label: 'Petugas' },
  { id: 'tujuan', label: 'Tujuan' },
  { id: 'lokasiTujuan', label: 'Lokasi Tujuan' },
  {},
];

export default function LaluLintasView() {
  const user = useAuthContext();
  const settings = useSettingsContext();
  const openModal = useBoolean();

  const [filters, setFilters] = useState('');
  const [selectedData, setSelectedData] = useState('');
  const [type, setType] = useState('');
  const [refetch, setRefetch] = useState(false);

  const handleFilters = useCallback((name, value) => {
    setFilters(value);
  }, []);

  const collection = {
    name: 'laluLintasTernak',
    searchFilter: 'ternak.RFID',
    filter: [`peternakan = "${user.user.createdBy}"`],
  };

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center" width={'100%'}>
            <Box flexGrow={1}>
              <LaluLintasToolbar
                filters={filters}
                setFilters={setFilters}
                onFilters={handleFilters}
              />
            </Box>

            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                openModal.onTrue();
                setType('CREATE');
              }}
              size="large"
            >
              + Tambah Data
            </Button>
          </Stack>

          <TableAnitimeCustom
            label="Data Lalu Lintas Ternak"
            filters={filters}
            tableHead={TABLE_HEAD}
            expand="kandang, ternak"
            collection={collection}
            tableRowComponent={LaluLintasTableRow}
            setSelectedData={setSelectedData}
            setType={setType}
            openModal={openModal}
            refetch={refetch}
          />
        </Grid>
      </Container>
      {openModal.value && (
        <PencatatanLaluLintasModal
          open={openModal.value}
          onClose={openModal.onFalse}
          openModal={openModal}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          type={type}
          setType={setType}
          setRefetch={setRefetch}
        />
      )}
    </>
  );
}
