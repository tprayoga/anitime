'use client';

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  Button,
  MenuItem,
  alpha,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { enqueueSnackbar } from 'notistack';

import { useTable } from 'src/components/table';
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
import { useGetData, useDeleteData } from 'src/api/custom-domba-api';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import ScanPakanModal from 'src/components/modal-domba/anak-kandang/scan-pakan-modal';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';
import { fDate, fTime } from 'src/utils/format-time';
import DataGridAnitime from 'src/components/dataGridAnitime';
import { PencatatanLaluLintasModal } from 'src/components/modal-domba/anak-kandang';

const KATEGORI_OPTIONS = [
  { value: 'antarKandang', label: 'Antar Kandang' },
  { value: 'luarKandang', label: 'Luar Kandang' },
];

export default function LaluLintasView() {
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const theme = useTheme();

  const table = useTable();
  const popover = usePopover();

  const {
    data: dataTernak,
    getData: getLaluLintas,
    loading: loadingTernak,
    totalData: totalTernak,
  } = useGetData();

  const { deleteData: deleteTernak } = useDeleteData();

  const confirm = useBoolean();
  const openModal = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [type, setType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [category, setCategory] = useState('antarKandang');
  const [dataGridTable, setDataGridTable] = useState({
    page: 0,
    pageSize: 5,
    orderBy: '',
    order: 'desc',
    filter: 'Pindah Antar Kandang',
  });

  const fetchData = useCallback(() => {
    getLaluLintas(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `ternak.kandang.peternakan = "${user.createdBy}"${
        dataGridTable.filter
          ? `&& (tujuan ${category === 'antarKandang' ? '=' : '!='} "${dataGridTable.filter}")`
          : ''
      }`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'laluLintasTernak',
      'ternak, pen, asalKandang, tujuanKandang, asalPen, tujuanPen, ternak.kandang'
    );
  }, [dataGridTable, getLaluLintas]);

  useEffect(() => {
    if (dataTernak) {
      setTableData(dataTernak);
    }
  }, [dataTernak]);

  useEffect(() => {
    fetchData();
  }, [dataGridTable, category]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [settings]);

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  const handleDelete = async () => {
    try {
      await deleteTernak(selectedRow.id);
      enqueueSnackbar('Success', { variant: 'success' });
      fetchData();
    } catch (error) {
      enqueueSnackbar('Failed', { variant: 'error' });
    } finally {
      popover.onClose();
      confirm.onFalse();
    }
  };

  const onDataGridChange = (page) => {
    setDataGridTable({ ...dataGridTable, ...page });
  };

  const columns = [
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

  const columnsLuarKandang = [
    {
      field: 'namaKandang',
      headerName: 'No FID Ternak',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
            typography: 'caption',
            py: 2,
          }}
          onClick={() => {
            window.open(`${paths.dombaAnakKandang.kandang.detail(params?.row?.id)}`, '_blank');
          }}
        >
          {params?.row?.expand?.ternak?.noFID}
        </Typography>
      ),
    },
    // {
    //   field: 'lokasi',
    //   headerName: 'Lokasi Kandang',
    //   flex: 1,
    //   minWidth: 160,
    //   renderCell: (params) => `${params?.row?.expand?.pen?.namaPen}`,
    //   // console.log(params?.row);
    //   // params?.row?.expand?.pen?.namaPen;
    // },
    {
      field: 'sertifikat',
      headerName: 'Sertifikat',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'petugas',
      headerName: 'Petugas',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'tujuan',
      headerName: 'Tujuan',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'lokasiTujuan',
      headerName: 'Lokasi Tujuan',
      flex: 1,
      minWidth: 160,
    },
  ];

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ p: 2 }}
              >
                <Typography variant="h4">Data Lalu Lintas</Typography>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    openModal.onTrue();
                    setType('CREATE');
                  }}
                >
                  + Tambah Data
                </Button>
              </Stack>
              <Tabs
                value={category}
                onChange={handleCategoryChange}
                sx={{
                  px: 2.5,
                  boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                }}
              >
                {KATEGORI_OPTIONS.map((tab) => (
                  <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
              </Tabs>
              <Box>
                <DataGridAnitime
                  data={tableData}
                  columns={category === 'antarKandang' ? columns : columnsLuarKandang}
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
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem
          onClick={() => {
            openModal.onTrue();
          }}
        >
          <Iconify icon="ph:barcode-bold" />
          Cetak Barcode
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ternak ${selectedRow?.RFID}?`}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            // loading={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        }
      />
      {openModal.value && (
        <PencatatanLaluLintasModal
          open={openModal.value}
          onClose={openModal.onFalse}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          type={type}
          setType={setType}
          refetch={fetchData}
        />
      )}
    </>
  );
}
