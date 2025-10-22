'use client';

import React, { useCallback, useState } from 'react';

import { _roles, _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { Container, Stack, Typography } from '@mui/material';
import TableAnitime from 'src/sections/domba/components/tableAnitime';
import SearchFilter from 'src/sections/wholesaler/components/search';
import { useBoolean } from 'src/hooks/use-boolean';
import useListAllData from 'src/api/wholesaler/listAll';
import useCreateData from 'src/api/wholesaler/create';
import { useAuthContext } from 'src/auth/hooks';
import { ButtonDomba } from '../../components/button';
import Iconify from 'src/components/iconify';
import AddDataKandangModal from '../addDataKandang';

// ----------------------------------------------------------------------

// id must same with field name in database
const TABLE_HEAD = [
  { id: 'kandang', label: 'Kandang' },
  { id: 'luas', label: 'Luas' },
  { id: 'jumlahTernak', label: 'Jumlah Ternak' },
];

const defaultValueDataKandang = [
  {
    kandang: 'Kandang 1',
    jumlahTernak: 200,
    luas: 100,
  },
  {
    kandang: 'Kandang 2',
    jumlahTernak: 300,
    luas: 100,
  },
  {
    kandang: 'Kandang 3',
    jumlahTernak: 400,
    luas: 100,
  },
  {
    kandang: 'Kandang 4',
    jumlahTernak: 500,
    luas: 100,
  },
];

// ----------------------------------------------------------------------

export default function KandangView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const [data, setData] = useState(defaultValueDataKandang);

  const openDialog = useBoolean();

  const handleAddData = useCallback((data, reset) => {
    const { namaKandang, luasKandang, jumlahHewan } = data;
    const newData = {
      kandang: namaKandang,
      luas: luasKandang,
      jumlahTernak: jumlahHewan,
    };
    setData((prev) => [...prev, newData]);
    openDialog.onFalse();
    reset();
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="end">
            <ButtonDomba startIcon={<Iconify icon="eva:plus-fill" />} onClick={openDialog.onTrue}>
              Tambah Data
            </ButtonDomba>
          </Stack>

          <TableAnitime
            label="Data Kandang"
            tableHead={TABLE_HEAD}
            dataRows={data}
            disabledDelete
          />
        </Stack>
      </Container>

      <AddDataKandangModal
        open={openDialog.value}
        close={openDialog.onFalse}
        onSubmitData={handleAddData}
      />
    </>
  );
}
