'use client';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import KandangTableRow from '../kandang-table-row';
import KandangTableToolbar from '../kandang-table-toolbar';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { Box } from '@mui/system';
import { AddKandangModal } from 'src/components/modal/anak-kandang';
import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'namaKandang', label: 'Kandang' },
  { id: 'luasKandang', label: 'Luas' },
  { id: 'jumlahJantan', label: 'Jumlah Ternak Jantan', disabled : true },
  { id : 'jumlahBetina', label : 'Jumlah Ternak Betina', disabled : true},
  { id: 'limitKandang', label: 'Limit Kandang' },
  {},
];

export default function KandangView() {

  const settings = useSettingsContext();
  const user = useAuthContext();
  const openModal = useBoolean();


  const [selectedData, setSelectedData] = useState(null);
  const [type, setType] = useState(null);
  const [filters, setFilters] = useState('');
  const [refetch, setRefetch] = useState(false);

  const handleFilters = useCallback((name, value) => {
    setFilters(value);
  }, [])

  const collection = {
    name : 'kandang',
    searchFilter : 'namaKandang',
    filter : [
      `peternakan = "${user.user.createdBy}"`
    ]
  }


  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ typography : 'caption' }}>
        <Grid container spacing={3}>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            width={'100%'}
          >
            <Box flexGrow={1}>
              <KandangTableToolbar filters={filters} setFilters={setFilters} onFilters={handleFilters} />
            </Box>

            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                openModal.onTrue();
                setType("CREATE")
              }}
              size="large"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tambah Data
            </Button>
          </Stack>
          <TableAnitimeCustom
            label="Data Kandang"
            filters={filters}
            tableHead={TABLE_HEAD}
            collection={collection}
            expand={'ternak'}
            tableRowComponent={KandangTableRow}
            refetch={refetch}
            setSelectedData={setSelectedData}
            setType={setType}
            openModal={openModal}
          />
        </Grid>
      </Container>
      
      {openModal.value &&
        <AddKandangModal
          open={openModal.value}
          onClose={openModal.onFalse}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          type={type}
          setType={setType}
          setRefetch={setRefetch}
        />
      }
    </>
  );
}
