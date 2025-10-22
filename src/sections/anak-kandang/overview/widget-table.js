'use client';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import LaluLintasTableRow from './dashboard-table-row';

import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { PencatatanLaluLintasModal } from 'src/components/modal/anak-kandang';
import { Box } from '@mui/system';

import TableAnitimeCustom from 'src/components/tableAnitimeCustom';
import { useAuthContext } from 'src/auth/hooks';
import { Card } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'ternak', label: 'RFID Ternak' },
  { id: 'kandang', label: 'Kandang' },
  { id: 'sertifikat', label: 'Sertifikat Kesehatan' },
  { id: 'petugas', label: 'Petugas' },
  { id: 'tujuan', label: 'Tujuan' },
];

export default function LaluLintasView() {
  const { user } = useAuthContext();
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
    filter: [`peternakan = "${user.id}"`],
  };

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Scrollbar>
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
          sx={{ height: '100%', overflow: 'auto' }}
        />
      </Scrollbar>
    </Box>
  );
}
