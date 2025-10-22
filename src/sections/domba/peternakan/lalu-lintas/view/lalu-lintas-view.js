'use client';

import uuidv4 from 'src/utils/uuidv4';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import DataGridAnitime from 'src/components/dataGridAnitime';
import { useGetData } from 'src/api/custom-domba-api';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useDebounce } from 'src/hooks/use-debounce';
import { TablePaginationCustom } from 'src/components/table';
import { paths } from 'src/routes/paths';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function LaluLintasView() {
  const { user } = useAuthContext();

  const {
    data: dataLaluLintas,
    loading: loadingLaluLintas,
    totalData: totalLaluLintas,
    getData: getLaluLintas,
  } = useGetData();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [dataGridTable, setDataGridTable] = useState({
    page: 0,
    pageSize: 5,
    orderBy: '',
    order: 'desc',
    filter: '',
  });

  const onDataGridChange = (page) => {
    setDataGridTable({ ...dataGridTable, ...page });
  };

  const columns = [
    {
      field: 'no',
      headerName: 'No',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      hideable: false,
      sortable: false,
    },
    {
      field: 'noFID',
      headerName: 'No FID Ternak',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => `${params?.row?.expand?.ternak?.noFID}`,
    },
    {
      field: 'asalKandang',
      headerName: 'Asal Kandang',
      flex: 1,
      renderCell: (params) => `${params?.row?.expand?.asalKandang?.namaKandang}`,
    },
    {
      field: 'tujuanKandang',
      headerName: 'Tujuan Kandang',
      flex: 1,
      renderCell: (params) => `${params?.row?.expand?.tujuanKandang?.namaKandang}`,
    },
    {
      field: 'asalPen',
      headerName: 'Asal Pen',
      flex: 1,
      renderCell: (params) => `${params?.row?.expand?.asalPen?.namaPen}`,
    },
    {
      field: 'tujuanPen',
      headerName: 'Tujuan Pen',
      flex: 1,
      renderCell: (params) => `${params?.row?.expand?.tujuanPen?.namaPen}`,
    },
  ];

  const options = () => {
    return {
      filter: `ternak.pen.kandang.peternakan = "${user?.id}" ${
        dataGridTable?.filter
          ? `&& (ternak.noFID ~ "${dataGridTable?.filter}"
            || asalKandang.namaKandang ~ "${dataGridTable?.filter}"
            || tujuanKandang.namaKandang ~ "${dataGridTable?.filter}"
            || asalPen.namaPen ~ "${dataGridTable?.filter}"
            || tujuanPen.namaPen  ~ "${dataGridTable?.filter}"
          )`
          : ''
      }`,
      sort: dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      expand: 'ternak,asalKandang,tujuanKandang,asalPen,tujuanPen',
      collection: 'laluLintasTernak',
    };
  };

  useEffect(() => {
    setTableData(dataLaluLintas.map((item, index) => ({ ...item, no: index + 1 })));
  }, [dataLaluLintas]);

  useEffect(() => {
    setDataGridTable({ ...dataGridTable, page: 0 });

    getLaluLintas(
      1,
      dataGridTable?.rowsPerPage,
      options()?.filter,
      options()?.sort,
      options()?.collection,
      options()?.expand
    );
  }, [dataGridTable?.filter]);

  useEffect(() => {
    getLaluLintas(
      dataGridTable?.page + 1,
      dataGridTable?.rowsPerPage,
      options()?.filter,
      options()?.sort,
      options()?.collection,
      options()?.expand
    );
  }, [dataGridTable?.page, dataGridTable?.pageSize, dataGridTable?.order, dataGridTable?.orderBy]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card>
            <Stack
              spacing={2}
              direction={{ xs: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'center' }}
            >
              <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                Data Lalu Lintas Ternak
              </Typography>
            </Stack>

            <DataGridAnitime
              data={tableData}
              columns={columns}
              table={dataGridTable}
              totalData={totalLaluLintas}
              loading={loadingLaluLintas}
              onDataGridChange={onDataGridChange}
              disableRowSelectionOnClick
              disableColumnMenu
              disableMultipleRowSelection
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
