'use client';

import uuidv4 from 'src/utils/uuidv4';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Card,
  CardHeader,
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
import TernakTableRow from '../ternak-table-row';
import TernakTableToolbar from '../ternak-table-toolbar';
import TernakTableHead from '../ternak-table-head';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import {
  _appAuthors,
  _appRelated,
  _appFeatured,
  _appInvoices,
  _appInstalled,
  _mock,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import OverviewKandang from '../overview-kandang';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
import RiwayatTableRow from '../riwayat-table-row';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuthContext } from 'src/auth/hooks';
import { useGetTernak } from 'src/api/peternakan/ternak';
import DataGridTernak from '../data-grid-ternak';
import Label from 'src/components/label';
import { paths } from 'src/routes/paths';
import DataGridAnitime from 'src/components/dataGridAnitime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'RFID', label: 'RFID' },
  { id: 'jenisHewan', label: 'Jenis Hewan' },
  { id: 'jenisBreed', label: 'Breed' },
  { id: 'jenisKelamin', label: 'Jenis Kelamin' },
  { id: 'umur', label: 'Umur' },
  { id: 'berat', label: 'Berat' },
  { id: 'kandang', label: 'Kandang' },
  { id: 'bodyConditionalScore', label: 'Kondisi' },
  { id: 'status', label: 'Status' },
];

export default function TernakView() {
  const { user } = useAuthContext();

  const table = useTable();

  const theme = useTheme();

  const settings = useSettingsContext();

  const denseHeight = table.dense ? 60 : 80;

  const { data: dataTernak, getTernak, loadingTernak, totalData: totalTernak } = useGetTernak();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [searchData, setSearchData] = useState('');

  const [dataGridTable, setDataGridTable] = useState({
    page: 0,
    pageSize: 5,
    orderBy: '',
    order: 'desc',
    filter: '',
  });

  const debouncedSearch = useDebounce(dataGridTable?.filter, 1000);

  const hitungWaktu = (hari) => {
    const tahun = Math.floor(hari / 365);
    const sisaHari = hari % 365;
    const bulan = Math.floor(sisaHari / 30);
    const hariSisa = sisaHari % 30;

    return `${tahun ? `${tahun} Tahun` : ''} ${bulan ? `${bulan} Bulan` : ''} ${
      hariSisa ? `${hariSisa} Hari` : ''
    }`;
  };

  const hitungScore = (score) => {
    const scoreValue = score?.split('(')[0];

    if (scoreValue == 1 || scoreValue == 2) {
      return {
        status: 'Buruk',
        color: 'error',
      };
    } else if (scoreValue == 3) {
      return {
        status: 'Sedang',
        color: 'warning',
      };
    } else {
      return {
        status: 'Baik',
        color: 'success',
      };
    }
  };

  const onDataGridChange = (page) => {
    setDataGridTable({ ...dataGridTable, ...page });
  };

  const columns = [
    //   {
    //     field: 'id',
    //     headerName: 'Id',
    //     filterable: false,
    //   },
    {
      field: 'RFID',
      headerName: 'RFID',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        <Typography
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
            typography: 'caption',
          }}
          onClick={() => {
            window.open(`${paths.peternakan.ternak.detail(params?.row?.id)}`, '_blank');
          }}
        >
          {params?.row?.RFID}
        </Typography>
      ),
    },
    {
      field: 'jenisHewan',
      headerName: 'Jenis Hewan',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'jenisBreed',
      headerName: 'Breed',
      minWidth: 200,
    },
    {
      field: 'jenisKelamin',
      headerName: 'Jenis Kelamin',
      flex: 1,
    },
    {
      field: 'umur',
      headerName: 'Umur',
      minWidth: 200,
      renderCell: (params) => `${hitungWaktu(params?.row?.umur)}`,
    },
    {
      field: 'berat',
      headerName: 'Berat',
      flex: 1,
      renderCell: (params) => `${params?.row?.berat} Kg`,
    },
    {
      field: 'kandang',
      headerName: 'Kandang',
      flex: 1,
      renderCell: (params) => `${params?.row?.expand?.kandang?.namaKandang}`,
    },
    {
      field: 'kondisi',
      headerName: 'Kondisi',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => (
        <Label variant="soft" color={hitungScore(params?.row?.bodyConditionalScore)?.color}>
          {hitungScore(params?.row?.bodyConditionalScore)?.status}
        </Label>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        const status = params?.row?.status;

        return (
          <Label
            variant="soft"
            color={
              status === 'aktif'
                ? 'success'
                : status === 'proses'
                  ? 'warning'
                  : status === 'terjual'
                    ? 'info'
                    : status === 'mati'
                      ? 'error'
                      : 'default'
            }
          >
            {status}
          </Label>
        );
      },
    },
  ];

  useEffect(() => {
    if (dataTernak) {
      setTableData(dataTernak);
    }
  }, [dataTernak]);

  useEffect(() => {
    setDataGridTable({ ...dataGridTable, page: 0 });

    if (dataGridTable?.orderBy !== 'no')
      getTernak(
        1,
        dataGridTable?.rowsPerPage,
        `peternakan = "${user.id}" ${
          dataGridTable?.filter
            ? `&& (RFID ~ "${dataGridTable?.filter}" 
            || jenisKelamin ~ "${dataGridTable?.filter}"
            || jenisBreed ~ "${dataGridTable?.filter}"
            || jenisHewan ~ "${dataGridTable?.filter}"
            || kandang.namaKandang ~ "${dataGridTable?.filter}"
            || umur ~ "${dataGridTable?.filter}"
            || berat ~ "${dataGridTable?.filter}"
            || status ~ "${dataGridTable?.filter}"
            || bodyConditionalScore ~ "${dataGridTable?.filter}"
            )`
            : ''
        }`,
        dataGridTable?.orderBy
          ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
          : '-created'
      );
  }, [dataGridTable?.filter]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    if (dataGridTable?.orderBy !== 'no') {
      getTernak(
        dataGridTable?.page + 1,
        dataGridTable?.pageSize,
        `peternakan = "${user.id}" ${
          dataGridTable?.filter
            ? `&& (RFID ~ "${dataGridTable?.filter}" 
            || jenisKelamin ~ "${dataGridTable?.filter}"
            || jenisBreed ~ "${dataGridTable?.filter}"
            || jenisHewan ~ "${dataGridTable?.filter}"
            || kandang.namaKandang ~ "${dataGridTable?.filter}"
            || umur ~ "${dataGridTable?.filter}"
            || berat ~ "${dataGridTable?.filter}"
            || status ~ "${dataGridTable?.filter}"
            || bodyConditionalScore ~ "${dataGridTable?.filter}"
          )`
            : ''
        }`,
        dataGridTable?.orderBy
          ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
          : '-created'
      );
    }
  }, [dataGridTable?.page, dataGridTable?.pageSize, dataGridTable?.order, dataGridTable?.orderBy]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={12}>
          <TernakTableToolbar filters={searchData} setFilters={setSearchData} />
        </Grid> */}

        {/* <Grid xs={12} md={12}>
          <Card>
            <Typography variant="h4" sx={{ ml: 3, my: 3 }}>
              Data Ternak
            </Typography>

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
                    {loadingTernak ? (
                      [...Array(table.rowsPerPage)].map((i, index) => (
                        <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      ))
                    ) : (
                      <>
                        {tableData?.map((row, index) => (
                          <TernakTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            rowIndex={table.page * table.rowsPerPage + index + 1}
                          />
                        ))}
                      </>
                    )}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                    />

                    <TableNoData notFound={tableData.length === 0} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={totalTernak}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Card>
        </Grid> */}

        <Grid xs={12} md={12}>
          <Card>
            <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
              Data Ternak
            </Typography>
            <Box>
              <DataGridAnitime
                data={tableData}
                columns={columns}
                table={dataGridTable}
                totalData={totalTernak}
                loading={loadingTernak}
                onDataGridChange={onDataGridChange}
                disableRowSelectionOnClick
                disableColumnMenu
                disableMultipleRowSelection
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
