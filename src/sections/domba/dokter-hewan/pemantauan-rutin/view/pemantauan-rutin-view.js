'use client';

import uuidv4 from 'src/utils/uuidv4';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import TernakTableToolbar from '../ternak-table-toolbar';
import PemantauanRutinTableRow from '../pemantauan-rutin-table-row';
import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
import { Box } from '@mui/system';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
import TableAnitimeDombaCustom from 'src/components/tableAnitimeDombaCustom';
import PemantauanRutinModal from 'src/components/modal-domba/dokter-hewan/pemantauan-rutin-modal';
import PemantauanRutinModal2 from 'src/components/modal-domba/dokter-hewan/pemantauan-rutin-modal2';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'ternak.noFID', label: 'No FID' },
  { id: 'ternak.kandang.namaKandang', label: 'Kandang' },
  { id: 'ternak.jenisHewan', label: 'Jenis Hewan' },
  { id: 'anamnesis', label: 'Anamnesis' },
  { id: 'asesmen', label: 'Asesmen' },
  { id: 'plan', label: 'Plan' },

  // { id: 'anamnesis.warna', label: 'Warna' },
  // { id: 'anamnesis.anamnesis', label: 'Anamnesis' },
];

export default function PemantauanRutinView() {
  const openPemantauanRutinModal1 = useBoolean();
  const openPemantauanRutinModal2 = useBoolean();

  const settings = useSettingsContext();

  const [filters, setFilters] = useState('');
  const [formData, setFormData] = useState([]);
  const [refetch, setRefetch] = useState(true);

  const collectionPemantauanRutin = {
    name: 'pemantauanRutin',
    searchFilter: 'ternak.noFID',
    filter: [],
  };

  const handleNext = () => {
    openPemantauanRutinModal1.onFalse();
    openPemantauanRutinModal2.onTrue();
  };

  const handleBack = () => {
    openPemantauanRutinModal1.onTrue();
    openPemantauanRutinModal2.onFalse();
  };

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
            onClick={() => openPemantauanRutinModal1.onTrue()}
            size="large"
          >
            + Tambah Data
          </Button>
        </Stack>
        <TableAnitimeDombaCustom
          label="Pemantauan Rutin"
          filters={filters}
          tableHead={TABLE_HEAD}
          collection={collectionPemantauanRutin}
          tableRowComponent={PemantauanRutinTableRow}
          expand={'ternak, ternak.kandang, ternak.pen'}
          refetch={refetch}
        />
      </Container>

      <PemantauanRutinModal
        open={openPemantauanRutinModal1.value}
        onClose={openPemantauanRutinModal1.onFalse}
        handleNext={handleNext}
        formData={formData}
        setFormData={setFormData}
      />
      <PemantauanRutinModal2
        open={openPemantauanRutinModal2.value}
        onClose={openPemantauanRutinModal2.onFalse}
        handleBack={handleBack}
        formData={formData}
        setFormData={setFormData}
        setRefetch={setRefetch}
      />
    </>
  );
}
