'use client';

import uuidv4 from 'src/utils/uuidv4';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import TernakTableToolbar from '../ternak-table-toolbar';
import RegistrasiObatTableRow from '../registrasi-obat-table-row';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
import { Box, alpha } from '@mui/system';
import PemantauanRutinModal from 'src/components/modal/dokter-hewan/pemantauan-rutin-modal';
import PemantauanRutinModal2 from 'src/components/modal/dokter-hewan/pemantauan-rutin-modal2';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
// import RegistrasiObatModal from 'src/components/modal/dokter-hewan/registrasi-obat-modal';
import { Tab, Tabs } from '@mui/material';
import Label from 'src/components/label';
import RegistrasiObatModal from 'src/components/modal-domba/dokter-hewan/registrasi-obat-modal';
import TableAnitimeDombaCustom from 'src/components/tableAnitimeDombaCustom';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'namaObat', label: 'Nama Obat' },
  { id: 'jenisObat', label: 'Jenis Obat' },
  { id: 'merkObat', label: 'Merk Obat' },
  { id: 'stok', label: 'Stok' },
];

const KATEGORI_OPTIONS = [
  { value: 'Obat', label: 'Obat' },
  { value: 'Vaksin', label: 'Vaksin' },
];

export default function RegistrasiObatView() {
  const openRegistrasiObatModal = useBoolean();

  const settings = useSettingsContext();

  const [filters, setFilters] = useState('');
  const [category, setCategory] = useState('Obat');
  const [refetch, setRefetch] = useState(true);

  const collectionObat = {
    name: 'listObat',
    searchFilter: 'namaObat',
    filter: [`jenisObat != "Vaksin"`],
  };

  const collectionVaksin = {
    name: 'listObat',
    searchFilter: 'namaObat',
    filter: [`jenisObat = "Vaksin"`],
  };

  const toggleCategory = useCallback((value) => {
    setCategory(value);
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters(value);
  }, []);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          spacing={2}
        >
          <Box flexGrow={1}>
            <TernakTableToolbar
              filters={filters}
              setFilters={setFilters}
              onFilters={handleFilters}
            />
          </Box>
          <Button
            color="primary"
            variant="contained"
            onClick={() => openRegistrasiObatModal.onTrue()}
            size="large"
          >
            + Tambah Data
          </Button>
        </Stack>
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
            />
          ))}
        </Tabs>
        {category === 'Obat' && (
          <TableAnitimeDombaCustom
            label="Obat"
            filters={filters}
            tableHead={TABLE_HEAD}
            collection={collectionObat}
            tableRowComponent={RegistrasiObatTableRow}
            refetch={refetch}
          />
        )}
        {category === 'Vaksin' && (
          <TableAnitimeDombaCustom
            label="Vaksin"
            filters={filters}
            tableHead={TABLE_HEAD}
            collection={collectionVaksin}
            tableRowComponent={RegistrasiObatTableRow}
            refetch={refetch}
          />
        )}
      </Container>

      <RegistrasiObatModal
        open={openRegistrasiObatModal.value}
        onClose={openRegistrasiObatModal.onFalse}
        setRefetch={setRefetch}
      />
    </>
  );
}
