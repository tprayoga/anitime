'use client';

import { useCallback, useEffect, useState } from 'react';

import { useSettingsContext } from 'src/components/settings';

import {
  Collapse,
  Container,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import Label from 'src/components/label';
import TableAnitime from 'src/sections/wholesaler/components/tableAnitime';
import SearchFilter from 'src/sections/wholesaler/components/search';
import useListData from 'src/api/wholesaler/list';
import { useBoolean } from 'src/hooks/use-boolean';
// import FormPermintaan from '../form-permintaan';
import useListAllData from 'src/api/wholesaler/listAll';
import './style.css';
import useCreateData from 'src/api/wholesaler/create';
import { useAuthContext } from 'src/auth/hooks';
import { RouterLink } from 'src/routes/components';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const FILTER_OPTIONS = [
  {
    label: 'Permintaan Terkirim',
    color: 'warning',
    total: 20,
    filter: `status != "Diterima" && status != "Ditolak"`,
  },
  {
    label: 'Diterima',
    color: 'success',
    total: 10,
    filter: `status = "Diterima"`,
  },
  {
    label: 'Ditolak',
    color: 'error',
    total: 5,
    filter: `status = "Ditolak"`,
  },
];

const TABLE_HEAD = [
  { id: 'jenisBreed', label: 'Jenis Ternak' },
  { id: 'berat', label: 'Berat' },
  { id: 'jumlah', label: 'Jumlah Permintaan' },
  { id: 'status', label: 'Status' },
  { id: 'expand.peternakan.farmName', label: 'Peternakan' },
  { id: 'dueDate', label: 'Jatuh Tempo' },
  { id: 'popover', label: '' },
];

// ----------------------------------------------------------------------

export default function PermintaanTernakView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const loadingSubmit = useBoolean();

  const options = (status, customFilter) => {
    const filter = customFilter ? status : `status = "${status}"`;
    return {
      filter: `${filter} && createdBy = "${user.id}"`,
    };
  };

  const { total: totalPermintaanTerkirim } = useListData(
    'permintaanTernak',
    1,
    5,
    options(`status != "Diterima" && status != "Ditolak"`, true)
  );
  const { total: totalDiterima } = useListData('permintaanTernak', 1, 5, options('Diterima'));
  const { total: totalDitolak } = useListData('permintaanTernak', 1, 5, options('Ditolak'));

  const [search, setSearch] = useState('');
  const [statusOptions, setStatusOptions] = useState(FILTER_OPTIONS || []);

  const handleSearch = useCallback((e) => {
    const { value } = e.target;

    setSearch(value);
  }, []);

  useEffect(() => {
    if (statusOptions.length) {
      setStatusOptions((prev) => {
        let total = 0;
        const newStatusOptions = prev.map((item) => {
          if (item.filter === `status != "Diterima" && status != "Ditolak"`) {
            total = totalPermintaanTerkirim?.totalItems || 0;
          }
          if (item.filter === 'status = "Diterima"') {
            total = totalDiterima?.totalItems || 0;
          }
          if (item.filter === 'status = "Ditolak"') {
            total = totalDitolak?.totalItems || 0;
          }
          return {
            ...item,
            total,
          };
        });

        return newStatusOptions;
      });
    }
  }, [totalDiterima, totalDitolak, totalPermintaanTerkirim]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={4}>
          <SearchFilter
            onChange={handleSearch}
            titleSearch="Search Jenis Ternak .."
            href="/wholesaler/permintaan-ternak/tambah-permintaan"
            component={RouterLink}
          />

          <TableAnitime
            label="Pengajuan Permintaan"
            tableHead={TABLE_HEAD}
            collectionId="permintaanTernak"
            expand="peternakan,ternak,ternak.kandang"
            filter={search}
            statusOptions={statusOptions}
            onRefetchData={loadingSubmit.value}
            filterByUser
            customeTableRow={[
              {
                key: 'status',
                props: (value) => {
                  const rowStatus = value.toLocaleLowerCase();
                  const colorStatus =
                    rowStatus === 'ditolak'
                      ? 'error'
                      : rowStatus === 'diterima'
                        ? 'success'
                        : rowStatus === 'ditinjau'
                          ? 'info'
                          : rowStatus === 'diproses'
                            ? 'default'
                            : 'warning';
                  return (
                    <Label variant="soft" color={colorStatus}>
                      {value}
                    </Label>
                  );
                },
              },
              {
                key: 'dueDate',
                props: (value) => {
                  return fDate(value);
                },
              },
            ]}
            disabledDelete
            popoverDisabled={(row) => row}
            collapseDisabled={(row) => row.status !== 'Diterima'}
            propsCollapse={(row, collapse) => {
              return (
                <TableRow>
                  <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
                    <Collapse in={collapse.value} sx={{ bgcolor: 'background.neutral' }}>
                      <Paper
                        variant="outlined"
                        sx={{
                          py: 2,
                          m: 1,
                          borderRadius: 1.5,
                          ...(collapse.value && {
                            boxShadow: (theme) => theme.customShadows.z20,
                          }),
                        }}
                      >
                        <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
                          Rincian Ternak
                        </Typography>

                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>No</TableCell>
                              <TableCell>RFID</TableCell>
                              <TableCell>Berat</TableCell>
                              <TableCell>Kandang</TableCell>
                              <TableCell>Tanggal Lahir</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {row.ternak.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}
                                >
                                  {item.RFID}
                                </TableCell>
                                <TableCell
                                  sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}
                                >
                                  {item.berat} Kg
                                </TableCell>
                                <TableCell
                                  sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}
                                >
                                  {item.expand?.kandang?.namaKandang}
                                </TableCell>
                                <TableCell
                                  sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}
                                >
                                  <ListItemText
                                    primary={fDate(item.tanggalLahir)}
                                    // secondary={fTime(item.tanggalLahir)}
                                    primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                                    secondaryTypographyProps={{
                                      mt: 0.5,
                                      component: 'span',
                                      typography: 'caption',
                                    }}
                                    sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </Collapse>
                  </TableCell>
                </TableRow>
              );
            }}
          />
        </Stack>
      </Container>

      {/* <FormPermintaan
        open={openDialog.value}
        close={openDialog.onFalse}
        listJenisBreed={[
          ...listJenisBreed.map((item) => ({
            value: item.name,
            label: item.name,
          })),
          { value: 'Lainnya', label: 'Lainnya', type: 'input' },
        ]}
        onSubmitData={handleAddData}
        loadingSubmit={loadingSubmit.value}
      /> */}
    </>
  );
}
