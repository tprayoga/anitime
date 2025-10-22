'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { isBetween } from 'src/utils/format-time';

import { _orders } from 'src/_mock';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import PermintaanTableRow from '../permintaan-table-row';
import PermintaanTableToolbar from '../permintaan-table-toolbar';
import { Box, Stack, Typography } from '@mui/material';
import useListData from 'src/api/list';
import { useAuthContext } from 'src/auth/hooks';
import { useDebounce } from 'src/hooks/use-debounce';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'createdBy.email', label: 'Wholesaler' },
  { id: 'jenisBreed', label: 'Jenis Breed' },
  { id: 'berat', label: 'Berat', width: 120, align: 'center' },
  { id: 'jumlah', label: 'Jumlah Permintaan', width: 160, align: 'center' },
  { id: 'dueDate', label: 'Jatuh Tempo', width: 140 },
  { id: 'status', label: 'Status', width: 110 },
  { id: '', width: 88 },
];

const listOptions = [
  {
    value: 'all',
    label: 'All',
    total: 10,
  },
  // {
  //   value: 'Ditunda',
  //   label: 'Ditunda',
  //   total: 10,
  // },
  {
    value: 'Diproses',
    label: 'Diproses',
    total: 10,
  },
  {
    value: 'Ditinjau',
    label: 'Ditinjau',
    total: 10,
  },
  // {
  //   value: 'Diterima',
  //   label: 'Diterima',
  //   total: 10,
  // },
  // {
  //   value: 'Ditolak',
  //   label: 'Ditolak',
  //   total: 10,
  // },
];

const defaultFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
};

const options = (
  status,
  peternakanId,
  adminToken,
  option = {
    sort: '-created',
    filter: '',
  }
) => {
  const otherOption = {
    expand: 'createdBy, ternak, ternak.kandang',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    ...option,
  };
  if (status === 'all') {
    return {
      ...otherOption,
      filter: `peternakan = "${peternakanId}" && status != "Ditunda" && status != "Diterima" && status != "Ditolak" ${
        option.filter ? `&& ${option.filter}` : ''
      }`,
    };
  } else {
    return {
      ...otherOption,
      filter: `status = "${status}" && peternakan = "${peternakanId}" ${
        option.filter ? `&& (${option.filter})` : ''
      }`,
    };
  }
};

// ----------------------------------------------------------------------

export default function PermintaanTernakView() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const adminToken = sessionStorage.getItem('adminToken');
  const table = useTable({ defaultOrderBy: 'updated', defaultOrder: 'desc' });
  const settings = useSettingsContext();
  const router = useRouter();

  const denseHeight = table.dense ? 56 : 56 + 20;

  const {
    data: allData,
    total: totalAllData,
    refetch: refetchAllData,
    loading: loadingAllData,
  } = useListData('permintaanTernak', 1, 5, options('all', user.createdBy, adminToken));
  const {
    data: dataDitunda,
    total: totalDitundaData,
    refetch: refetchDataDitunda,
    loading: loadingDitundaData,
  } = useListData('permintaanTernak', 1, 5, options('Ditunda', user.createdBy, adminToken));
  const {
    data: dataDiproses,
    total: totalDiprosesData,
    refetch: refetchDataDiProses,
    loading: loadingDiprosesData,
  } = useListData('permintaanTernak', 1, 5, options('Diproses', user.createdBy, adminToken));
  const {
    data: dataDitinjau,
    total: totalDitinjauData,
    refetch: refetchDataDitinjau,
    loading: loadingDitinjauData,
  } = useListData('permintaanTernak', 1, 5, options('Ditinjau', user.createdBy, adminToken));
  const {
    data: dataDiterima,
    total: totalDiterimaData,
    refetch: refetchDataDiterima,
    loading: loadingDiterimaData,
  } = useListData('permintaanTernak', 1, 5, options('Diterima', user.createdBy, adminToken));
  const {
    data: dataDitolak,
    total: totalDitolakData,
    refetch: refetchDataDitolak,
    loading: loadingDitolakData,
  } = useListData('permintaanTernak', 1, 5, options('Ditolak', user.createdBy, adminToken));

  const [selectedOption, setSelectedOption] = useState('all');
  const [searchValue, setSearchValue] = useState('');

  const search = useDebounce(searchValue);

  const handleFilterStatus = useCallback((event, newValue) => {
    setSelectedOption(newValue);
    table.onResetPage();
  }, []);

  const handleAddTernak = useCallback(
    ({ id }) => {
      router.push(paths.procurement.permintaanTernak.addTernak(id));
    },
    [router]
  );

  const listOptionsData = useMemo(() => {
    const totalAll = totalAllData?.totalItems || 0;
    const totalDitunda = totalDitundaData?.totalItems || 0;
    const totalDiproses = totalDiprosesData?.totalItems || 0;
    const totalDitinjau = totalDitinjauData?.totalItems || 0;
    const totalDiterima = totalDiterimaData?.totalItems || 0;
    const totalDitolak = totalDitolakData?.totalItems || 0;

    return listOptions.map((item) => {
      let total = 0;
      if (item.value === 'all') {
        total = totalAll;
      }
      if (item.value === 'Ditunda') {
        total = totalDitunda;
      }
      if (item.value === 'Diproses') {
        total = totalDiproses;
      }
      if (item.value === 'Ditinjau') {
        total = totalDitinjau;
      }
      if (item.value === 'Diterima') {
        total = totalDiterima;
      }
      if (item.value === 'Ditolak') {
        total = totalDitolak;
      }
      return {
        ...item,
        total,
      };
    });
  }, [
    totalAllData,
    totalDitundaData,
    totalDiprosesData,
    totalDitinjauData,
    totalDiterimaData,
    totalDitolakData,
  ]);

  const tableData = useMemo(() => {
    if (selectedOption === 'all') {
      return allData;
    } else if (selectedOption === 'Ditunda') {
      return dataDitunda;
    } else if (selectedOption === 'Diproses') {
      return dataDiproses;
    } else if (selectedOption === 'Ditinjau') {
      return dataDitinjau;
    } else if (selectedOption === 'Diterima') {
      return dataDiterima;
    } else if (selectedOption === 'Ditolak') {
      return dataDitolak;
    }
  }, [selectedOption, allData, dataDitunda, dataDiproses, dataDitinjau, dataDiterima, dataDitolak]);

  const totalData = useMemo(() => {
    if (selectedOption === 'all') {
      return totalAllData?.totalItems || 0;
    } else if (selectedOption === 'Ditunda') {
      return totalDitundaData?.totalItems || 0;
    } else if (selectedOption === 'Diproses') {
      return totalDiprosesData?.totalItems || 0;
    } else if (selectedOption === 'Ditinjau') {
      return totalDitinjauData?.totalItems || 0;
    } else if (selectedOption === 'Diterima') {
      return totalDiterimaData?.totalItems || 0;
    } else if (selectedOption === 'Ditolak') {
      return totalDitolakData?.totalItems || 0;
    }
  }, [
    selectedOption,
    totalAllData,
    totalDitundaData,
    totalDiprosesData,
    totalDitinjauData,
    totalDiterimaData,
    totalDitolakData,
  ]);

  const notFound = !tableData.length;

  useEffect(() => {
    if (adminToken) {
      const page = table.page + 1;
      const rowsPerPage = table.rowsPerPage;

      const order = table.order === 'asc' ? '+' : '-';
      const orderBy = table.orderBy;

      const sort = `${order}${orderBy}`;
      const filter = search ? `jenisBreed ~ "${search}"` : '';
      // const filter = search ? `jenisBreed ~ "${search}" || berat ~ "${search}"` : '';

      const option = { sort, filter };

      switch (selectedOption) {
        case 'all':
          refetchAllData(
            'permintaanTernak',
            page,
            rowsPerPage,
            options('all', user.createdBy, adminToken, option)
          );
          break;
        case 'Ditunda':
          refetchDataDitunda(
            'permintaanTernak',
            page,
            rowsPerPage,
            options('Ditunda', user.createdBy, adminToken, option)
          );
          break;
        case 'Diproses':
          refetchDataDiProses(
            'permintaanTernak',
            page,
            rowsPerPage,
            options('Diproses', user.createdBy, adminToken, option)
          );
          break;
        case 'Ditinjau':
          refetchDataDitinjau(
            'permintaanTernak',
            page,
            rowsPerPage,
            options('Ditinjau', user.createdBy, adminToken, option)
          );
          break;
        case 'Diterima':
          refetchDataDiterima(
            'permintaanTernak',
            page,
            rowsPerPage,
            options('Diterima', user.createdBy, adminToken, option)
          );
          break;
        case 'Ditolak':
          refetchDataDitolak(
            'permintaanTernak',
            page,
            rowsPerPage,
            options('Ditolak', user.createdBy, adminToken, option)
          );
          break;
        default:
          break;
      }
    }
  }, [
    table.page,
    table.rowsPerPage,
    table.order,
    table.orderBy,
    adminToken,
    selectedOption,
    user,
    search,
  ]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Permintaan Ternak"
          links={[
            {
              name: 'Dashboard',
              href: '/procurement/',
            },
            { name: 'Permintaan Ternak' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Stack direction="row" justifyContent="space-between" spacing={4} alignItems="center">
            <Tabs
              value={selectedOption}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {listOptionsData.map((tab, index) => (
                <Tab
                  key={index}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === selectedOption) && 'filled') ||
                        'soft'
                      }
                      color={
                        (tab.value === 'Ditunda' && 'warning') ||
                        (tab.value === 'Diproses' && 'info') ||
                        (tab.value === 'Ditinjau' && 'secondary') ||
                        (tab.value === 'Diterima' && 'success') ||
                        (tab.value === 'Ditolak' && 'error') ||
                        'default'
                      }
                    >
                      {tab.total}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            <Box>
              <PermintaanTableToolbar onSearch={(event) => setSearchValue(event.target.value)} />
            </Box>
          </Stack>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {/* <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            /> */}

            {loadingAllData ||
            loadingDitundaData ||
            loadingDiprosesData ||
            loadingDitinjauData ||
            loadingDiterimaData ||
            loadingDiterimaData ? (
              <Stack direction="row" justifyContent="center" width={1}>
                <Typography textAlign="center" py={4}>
                  Loading...
                </Typography>
              </Stack>
            ) : (
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    // rowCount={dataFiltered.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {tableData.map((row, index) => (
                      <PermintaanTableRow key={index} row={row} onCreateTernak={handleAddTernak} />
                    ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, totalAllData)}
                    />

                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            )}
          </TableContainer>

          <TablePaginationCustom
            count={totalData || 0}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
