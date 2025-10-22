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
  Tooltip,
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
import RegPakanModal from '../reg-pakan-modal';
import PemberianPakanModal from '../pemberian-pakan-modal';
import PreviewPhoto from '../preview-photo';

const KATEGORI_OPTIONS = [
  { value: 'stockPakan', label: 'Stock Pakan' },
  { value: 'pemberianPakan', label: 'Pemberian Pakan' },
];

export default function RegistrasiPakanView() {
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const theme = useTheme();

  const table = useTable();
  const popover = usePopover();

  const {
    data: dataPemberianPakan,
    getData: getPemberianPakan,
    loading: loadingPemberianPakan,
    totalData: totalPemberianPakan,
  } = useGetData();
  const {
    data: dataStockPakan,
    getData: getStockPakan,
    loading: loadingStockPakan,
    totalData: totalStockPakan,
  } = useGetData();

  const { deleteData: deleteTernak } = useDeleteData();

  const openModalPhoto = useBoolean();
  const confirm = useBoolean();
  const openModal = useBoolean();
  const openModalPemberianPakan = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [type, setType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [category, setCategory] = useState('stockPakan');
  const [dataGridTable, setDataGridTable] = useState({
    page: 0,
    pageSize: 5,
    orderBy: '',
    order: 'desc',
    filter: '',
  });

  const fetchPemberianPakanData = useCallback(() => {
    getPemberianPakan(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `${dataGridTable.filter}`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'pemberianPakan',
      'kandang, pen'
    );
  }, [dataGridTable, getPemberianPakan]);

  const fetchStockPakanData = useCallback(() => {
    getStockPakan(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `${dataGridTable.filter}`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'registrasiPakan'
    );
  }, [dataGridTable, getStockPakan]);

  useEffect(() => {
    if (category === 'pemberianPakan') {
      setTableData(dataPemberianPakan);
    } else {
      setTableData(dataStockPakan);
    }
  }, [dataPemberianPakan, dataStockPakan]);

  useEffect(() => {
    if (category === 'pemberianPakan') {
      fetchPemberianPakanData();
    } else {
      fetchStockPakanData();
    }
  }, [dataGridTable, category]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [settings]);

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
    // setDataGridTable({
    //   ...dataGridTable,
    //   filter: newValue === 'upcoming' ? 'true' : 'false',
    // });
  };

  const handleDelete = async () => {
    try {
      await deleteTernak(selectedRow.id);
      enqueueSnackbar('Success', { variant: 'success' });
      fetchPemberianPakanData();
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
      field: 'created',
      headerName: 'Tanggal',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => fDate(params?.row?.created),
    },
    {
      field: 'createdz',
      headerName: 'Waktu',
      flex: 1,
      renderCell: (params) => fTime(params?.row?.created),
    },
    {
      field: 'jenisPakan',
      headerName: 'Jenis Pakan',
      flex: 1,
      renderCell: (params) => {
        return `${params?.row?.jenisPakan?.map((item) => item.nama).join(', ')}`;
        // return params.row?.jenisPakan[0]?.nama;
      },
    },
    {
      field: 'bobotPakan',
      headerName: 'Bobot Pakan',
      flex: 1,
      renderCell: (params) => `${params?.row?.bobotPakan} kg`,
    },
    {
      field: 'kandang',
      headerName: 'Kandang',
      flex: 1,
      renderCell: (params) => `${params?.row?.expand?.kandang?.namaKandang}`,
    },
    // {
    //   field: 'pen',
    //   headerName: 'Pen',
    //   flex: 1,
    //   renderCell: (params) => `${params?.row?.expand?.pen?.namaPen}`,
    // },
    {
      field: 'pen',
      headerName: 'Pen',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const listPen = params?.row?.expand?.pen;
        return (
          <Stack spacing={1} flexDirection={'row'} flexWrap={'wrap'} py={'14px'}>
            {listPen?.map((pen) => (
              <Label key={pen.id} variant="soft">
                {pen.namaPen}
              </Label>
            ))}
          </Stack>
        );
      },
    },
    {
      field: 'given',
      headerName: 'Status',
      flex: 1,
      minWidth: 160,
      renderCell: (params) =>
        params.row.given ? (
          <Label variant="outlined" color="success">
            Completed
          </Label>
        ) : (
          <Label variant="outlined" color="warning">
            Pending
          </Label>
        ),
    },
    {
      field: 'petugas',
      headerName: 'Petugas',
      flex: 1,
    },
    {
      field: '',
      headerName: '',
      align: 'right',
      headerAlign: 'right',
      flex: 1,
      renderCell: (params) => {
        const title = 'Lihat Photo';
        const icon = 'tabler:photo';
        const isSuccesss = params.row.given;

        return (
          <IconButton
            onClick={(e) => {
              if (isSuccesss) {
                openModalPhoto.onTrue();
                setSelectedRow(params.row);
              }
            }}
            disabled={!isSuccesss}
          >
            <Tooltip title={title} placement="top" arrow>
              <Iconify icon={icon} />
            </Tooltip>
          </IconButton>
        );
      },
    },
  ];

  const columnsLuarKandang = [
    {
      field: 'name',
      headerName: 'Nama',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => `${params?.row?.nama}`,
    },
    {
      field: 'stok',
      headerName: 'Stok',
      flex: 1,
      renderCell: (params) => `10 Porsi`,
    },
    {
      field: 'komposisi',
      headerName: 'Komposisi',
      flex: 1,
      renderCell: (params) => {
        return `${params?.row?.komposisi?.map((item) => item.jenisPakan.jenis).join(', ')}`;
      },
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
                <Typography variant="h4">Data Pakan</Typography>
                {category === 'stockPakan' && (
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      ml: 'auto',
                    }}
                    onClick={() => openModal.onTrue()}
                  >
                    + Registrasi Pakan
                  </Button>
                )}
                {category === 'pemberianPakan' && (
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      ml: 'auto',
                    }}
                    onClick={() => openModalPemberianPakan.onTrue()}
                  >
                    + Tambah Pemberian Pakan
                  </Button>
                )}
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
                  columns={category === 'pemberianPakan' ? columns : columnsLuarKandang}
                  table={dataGridTable}
                  totalData={category === 'pemberianPakan' ? totalPemberianPakan : totalStockPakan}
                  loading={
                    category === 'pemberianPakan' ? loadingPemberianPakan : loadingStockPakan
                  }
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
        <RegPakanModal
          open={openModal.value}
          onClose={() => openModal.onFalse()}
          type="CREATE"
          refetch={fetchStockPakanData}
        />
      )}
      {openModalPemberianPakan.value && (
        <PemberianPakanModal
          open={openModalPemberianPakan.value}
          onClose={() => openModalPemberianPakan.onFalse()}
          type="CREATE"
          refetch={fetchPemberianPakanData}
        />
      )}

      {openModalPhoto.value && (
        <PreviewPhoto
          open={openModalPhoto.value}
          onClose={openModalPhoto.onFalse}
          data={selectedRow}
        />
      )}
    </>
  );
}
