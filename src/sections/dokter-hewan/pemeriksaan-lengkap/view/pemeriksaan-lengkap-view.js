'use client';

import uuidv4 from 'src/utils/uuidv4';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import TernakTableToolbar from '../ternak-table-toolbar';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { Box } from '@mui/system';
import PemeriksaanLengkapModal from 'src/components/modal/dokter-hewan/pemeriksaan-lengkap-modal';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
import PemeriksaanLengkapTableRow from '../pemeriksaan-lengkap-table-row';
import PemeriksaanLengkapMandiriModal from 'src/components/modal/dokter-hewan/pemeriksaan-lengkap-mandiri-modal';

// ----------------------------------------------------------------------

export default function PemeriksaanLengkapView() {
  const openTransaksiModal = useBoolean();

  const settings = useSettingsContext();

  const [filters, setFilters] = useState('');
  const [refetch, setRefetch] = useState(true);

  const TABLE_HEAD = [
    { id: 'anamnesis.rfid', label: 'RFID' },
    { id: 'anamnesis.kandang', label: 'Kandang' },
    { id: 'anamnesis.jenisHewan', label: 'Jenis Hewan' },
    { id: 'anamnesis.jenisKelamin', label: 'Jenis Kelamin' },
    { id: 'anamnesis.warna', label: 'Warna' },
    { id: 'anamnesis.anamnesis', label: 'Anamnesis' },
    {},
  ];

  const collectionPemeriksaanLengkap = {
    name: 'pemeriksaanLengkap',
    searchFilter: 'anamnesis.rfid',
    filter: [
      'surveilans = null'
    ]
  }

  const handleFilters = useCallback((name, value) => {
    setFilters(value);
  }, [])



  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>

        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} spacing={2}>
          <Box flexGrow={1}>
            <TernakTableToolbar filters={filters} setFilters={setFilters} onFilters={handleFilters} />
          </Box>
          <Button
            color="primary"
            variant="contained"
            onClick={() => openTransaksiModal.onTrue()}
            size='large'

          >
            + Tambah Data
          </Button>
        </Stack>

        <TableAnitimeCustom
          label="Pemeriksaan Lengkap"
          filters={filters}
          tableHead={TABLE_HEAD}
          collection={collectionPemeriksaanLengkap}
          tableRowComponent={PemeriksaanLengkapTableRow}
          refetch={refetch}
        />
      </Container>
      <PemeriksaanLengkapMandiriModal
        open={openTransaksiModal.value}
        onClose={openTransaksiModal.onFalse}
        setRefetch={setRefetch}
      />
    </>
  );
}
