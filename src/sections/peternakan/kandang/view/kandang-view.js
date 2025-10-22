'use client';

import uuidv4 from 'src/utils/uuidv4';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Card,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import KandangTableRow from '../kandang-table-row';
import KandangTableToolbar from '../kandang-table-toolbar';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import OverviewKandang from '../overview-kandang';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
import { useGetKandang } from 'src/api/peternakan/kandang';
import { useGetTernak } from 'src/api/peternakan/ternak';
import { useAuthContext } from 'src/auth/hooks';
import { useDebounce } from 'src/hooks/use-debounce';
import { orderBy } from 'lodash';

// ----------------------------------------------------------------------

export default function KandangView() {
  const { user } = useAuthContext();
  const {
    data: dataKandang,
    getKandang,
    getFullKandang,
    loadingKandang,
    totalData,
    empty,
    error,
    fullDataKandang,
  } = useGetKandang();

  const { data: dataTernak, getTernak, loadingTernak, totalData: totalTernak } = useGetTernak();

  const table = useTable();

  const theme = useTheme();

  const settings = useSettingsContext();

  const denseHeight = table.dense ? 60 : 80;

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [searchData, setSearchData] = useState('');

  const debouncedSearch = useDebounce(searchData);

  // const tableData = applyFilter({
  //   inputData: tableData,
  //   comparator: getComparator(table.order, table.orderBy),
  // });

  const sumArrayofObjects = (arr, key) => {
    const sum = arr.reduce((accumulator, object) => {
      return accumulator + (object[key] || 0);
    }, 0);

    return `${(sum / 10000).toFixed(1)}`;
  };

  const TABLE_HEAD = [
    { id: 'no', label: 'No', disabled: true },
    { id: 'namaKandang', label: 'Kandang' },
    { id: 'jantan', label: 'Total Jantan', disabled: true },
    { id: 'betina', label: 'Total Betina', disabled: true },
    { id: 'luasKandang', label: 'Luas' },
    { id: 'ternak', label: 'Jumlah Ternak', disabled: true },
    // { id: '' },
  ];

  const overviewKandang = [
    {
      title: 'Total Kandang',
      value: `${fullDataKandang.length}`,
      icon: '/assets/illustrations/kandang/check.png',
      type: 'success',
    },
    {
      title: 'Total Luas',
      value: sumArrayofObjects(fullDataKandang, 'luasKandang'),
      icon: '/assets/illustrations/kandang/check.png',
      type: 'success',
    },
    {
      title: 'Total Ternak',
      value: `${totalTernak}`,
      icon: '/assets/illustrations/kandang/check.png',
      type: 'success',
    },
  ];

  useEffect(() => {
    if (dataKandang) {
      setTableData(dataKandang);
    }
  }, [dataKandang]);

  useEffect(() => {
    table.onResetPage();
    if (table.orderBy !== 'no')
      getKandang(
        table.page + 1,
        table.rowsPerPage,
        `peternakan = "${user.id}" ${
          debouncedSearch ? `&& namaKandang ~ "${debouncedSearch}"` : ''
        }`,
        table.orderBy ? `${table.order === 'asc' ? '' : '-'}${table.orderBy}` : '-created'
      );
  }, [debouncedSearch]);

  useEffect(() => {
    if (table.orderBy !== 'no')
      getKandang(
        table.page + 1,
        table.rowsPerPage,
        `peternakan = "${user.id}" ${
          debouncedSearch ? `&& namaKandang ~ "${debouncedSearch}"` : ''
        }`,
        table.orderBy ? `${table.order === 'asc' ? '' : '-'}${table.orderBy}` : '-created'
      );
  }, [table.page, table.rowsPerPage, table.order, table.orderBy]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    getTernak(
      table.page + 1,
      table.rowsPerPage,
      `peternakan = "${user.id}"`,
      '-created',
      'kandang'
    );
    getFullKandang(`peternakan = "${user.id}"`);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {overviewKandang.map((item, index) => (
          <Grid key={index} xs={12} md={4}>
            <OverviewKandang price={item.value} title={item.title} img={item.icon} />
          </Grid>
        ))}

        <Grid xs={12} md={12}>
          <Card>
            <Typography variant="h4" sx={{ ml: 3, my: 3 }}>
              Data Kandang
            </Typography>

            <KandangTableToolbar filters={searchData} setFilters={setSearchData} />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    data={tableData}
                  />

                  <TableBody>
                    {loadingKandang ? (
                      [...Array(table.rowsPerPage)].map((i, index) => (
                        <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      ))
                    ) : (
                      <>
                        {tableData?.map((row, index) => (
                          <KandangTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            rowIndex={table.page * table.rowsPerPage + index + 1}
                          />
                        ))}
                      </>
                    )}

                    {/* <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                    /> */}

                    <TableNoData notFound={tableData.length === 0} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={totalData}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
