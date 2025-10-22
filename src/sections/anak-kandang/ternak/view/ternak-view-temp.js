'use client';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import TernakTableRow from '../ternak-table-row';
import TernakTableToolbar from '../ternak-table-toolbar';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/system';
import { paths } from 'src/routes/paths';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
import { useAuthContext } from 'src/auth/hooks';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'RFID', label: 'RFID' },
  { id: 'jenisHewan', label: 'Jenis Hewan' },
  { id: 'jenisBreed', label: 'Breed' },
  { id: 'jenisKelamin', label: 'Jenis Kelamin' },
  // { id: 'tanggalLahir', label: 'Tanggal Lahir' },
  { id: 'umur', label: 'Umur' },
  { id: 'berat', label: 'Berat' },
  { id: 'kandang', label: 'Kandang' },
  // { id: 'asalPeternakan', label: 'Asal' },
  // { id: 'bodyConditionalScore', label: 'Kondisi' },
  {id : 'status', label : 'Status'},
  {},
];

export default function TernakView() {

  const settings = useSettingsContext();
  const user = useAuthContext();

  const [filters, setFilters] = useState('');
  const [refetch, setRefetch] = useState(false);


  const handleFilters = useCallback((name, value) => {
    setFilters(value);
  }, [])

  const collection = {
    name: 'ternak',
    searchFilter: 'RFID',
    filter: [
      `peternakan = "${user.user.createdBy}"`
    ]
  }

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          width={'100%'}
        >
          <Box flexGrow={1}>
            <TernakTableToolbar filters={filters} setFilters={setFilters} onFilters={handleFilters} />
          </Box>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              window.open(`${paths.anakKandang.ternak.importData}`);
            }}
            size='large'
          >
            + Import Data
          </Button>
          <Button
            color="primary"
            variant="contained"
            size='large'
            href={`${paths.anakKandang.ternak.create}`}
            component={RouterLink}
          >
            + Tambah Data
          </Button>

        </Stack>
 
        <TableAnitimeCustom
          label="Data Ternak"
          filters={filters}
          tableHead={TABLE_HEAD}
          expand="kandang"
          collection={collection}
          tableRowComponent={TernakTableRow}
          refetch={refetch}
          setRefetch={setRefetch}
        />
      </Grid>
    </Container>
  );
}
