'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useMemo } from 'react';

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
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import StokTableRow from '../stok-table-row';
import StokTableToolbar from '../stok-table-toolbar';
import StokTableFiltersResult from '../stok-table-filters-result';
import { Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'pakan', label: 'Pakan' },
  { value: 'obat', label: 'Obat' },
  // { value: 'vitamin', label: 'Vitamin' },
];

const TABLE_HEAD_PAKAN = [
  { id: 'tipe', label: 'Tipe' },
  { id: 'jumlahStok', label: 'Jumlah Stok' },
];

const TABLE_HEAD_OBAT = [
  { id: 'tipe', label: 'Tipe' },
  { id: 'namaObat', label: 'Nama Obat' },
  { id: 'jenisObat', label: 'Jenis Obat' },
  { id: 'jumlahStock', label: 'Jumlah Stok' },
];

const defaultFilters = {
  kategori: 'pakan',
  keyword: '',
};

// ----------------------------------------------------------------------

export default function StokView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const dataPakan = [
    {
      tipe: 'Limosin',
      jumlahStok: '100 kg',
      kategori: 'pakan',
    },
    {
      tipe: 'Brahman',
      jumlahStok: '100 kg',
      kategori: 'obat',
    },
    {
      tipe: 'Angus',
      jumlahStok: '80 kg',
      kategori: 'pakan',
    },
  ];

  const dataObat = [
    {
      tipe: 'A',
      namaObat: 'Oxytetracycline',
      jenisObat: 'Injeksi',
      jumlahStock: '100',
    },
    {
      tipe: 'B',
      namaObat: 'Ivermectin',
      jenisObat: 'Injeksi',
      jumlahStock: '150',
    },
    {
      tipe: 'C',
      namaObat: 'Flunixin Meglumine',
      jenisObat: 'Injeksi',
      jumlahStock: '120',
    },
  ];

  const [tableData, setTableData] = useState(dataPakan);

  const [filters, setFilters] = useState(defaultFilters);

  // const dataFiltered = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(table.order, table.orderBy),
  //   filters,
  // });

  const dataFiltered = useMemo(() => {
    if (filters.kategori === 'obat') {
      return dataObat;
    } else {
      return dataPakan;
    }
  }, [filters.kategori]);

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  console.log(filters);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, enqueueSnackbar, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, enqueueSnackbar, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('kategori', newValue);
    },
    [handleFilters]
  );

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Tabs
            value={filters.kategori}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.kategori) && 'filled') ||
                      'soft'
                    }
                    color={
                      // (tab.value === 'obat' && 'success') ||
                      // (tab.value === 'pakan' && 'warning') ||
                      // (tab.value === 'vitamin' && 'error') ||
                      'default'
                    }
                  >
                    {/* {['obat', 'pakan', 'vitamin'].includes(tab.value)
                      ? tableData.filter((user) => user.kategori === tab.value).length
                      : tableData.length} */}
                    3
                  </Label>
                }
              />
            ))}
          </Tabs>

          <StokTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={_roles}
          />
        </Stack>

        <Card>
          <Typography variant="h4" sx={{ ml: 3, my: 3, textTransform: 'capitalize' }}>
            Stock {filters.kategori}
          </Typography>

          {/* {canReset && (
            )} */}
          <StokTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered.length}
            sx={{ p: 2.5, pt: 0 }}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset', height: 400 }}>
            <TableSelectedAction
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
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={filters.kategori === 'obat' ? TABLE_HEAD_OBAT : TABLE_HEAD_PAKAN}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <StokTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        keys={
                          filters.kategori === 'obat'
                            ? TABLE_HEAD_OBAT.map(({ id }) => id)
                            : TABLE_HEAD_PAKAN.map(({ id }) => id)
                        }
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { keyword, kategori } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (kategori) {
    inputData = inputData.filter(
      (user) => user.kategori.toLowerCase().indexOf(kategori.toLowerCase()) !== -1
    );
  }
  if (keyword) {
    inputData = inputData.filter(
      (data) => data.tipe.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    );
  }

  return inputData;
}
