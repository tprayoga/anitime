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
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

// id must same with field name in database
const TABLE_HEAD = [
  { id: 'jenisHewan', label: 'Jenis Hewan' },
  { id: 'breed', label: 'Breed' },
  { id: 'jenisKelamin', label: 'Jenis Kelamin' },
  { id: 'tanggalLahir', label: 'Tanggal Lahir' },
  { id: 'umur', label: 'Umur' },
  { id: 'berat', label: 'Berat' },
  { id: 'kandang', label: 'Kandang' },
];

const defaultValueDataTernak = [
  {
    id: 'A0001-Domba',
    jenisHewan: 'Domba Garut',
    breed: 'Brangus',
    jenisKelamin: 'Jantan',
    tanggalLahir: '29/07/2023',
    umur: '1 Tahun 3 bulan',
    berat: '25 Kg',
    kandang: 'Kandang 1',
  },
  {
    id: 'A0002-Domba',
    jenisHewan: 'Domba Merino',
    breed: 'Brangus',
    jenisKelamin: 'Jantan',
    tanggalLahir: '29/07/2023',
    umur: '1 Tahun 3 bulan',
    berat: '25 Kg',
    kandang: 'Kandang 1',
  },
];

// ----------------------------------------------------------------------

export default function TernakView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const { user } = useAuthContext();

  const openDialogImport = useBoolean();

  const handleClickTambahData = () => {
    router.push('/domba/ternak/tambah-ternak');
  };

  const handleClickImportData = () => {
    router.push('/domba/ternak/import-data');
  };

  const handleClickDetail = (row) => {
    router.push(`/domba/ternak/${row.id}`);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="end" spacing={2}>
            <ButtonDomba
              startIcon={<Iconify icon="ion:open-outline" />}
              onClick={handleClickImportData}
            >
              Import Data
            </ButtonDomba>
            <ButtonDomba
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleClickTambahData}
            >
              Tambah Data
            </ButtonDomba>
          </Stack>

          <TableAnitime
            label="Data Ternak"
            tableHead={TABLE_HEAD}
            dataRows={defaultValueDataTernak}
            disabledDelete
            onClickedFirstColumn={handleClickDetail}
          />
        </Stack>
      </Container>
    </>
  );
}
