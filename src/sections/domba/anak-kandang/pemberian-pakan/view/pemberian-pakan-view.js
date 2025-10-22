'use client';

import React, { useState, useEffect, useCallback, Fragment, useMemo } from 'react';
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
import UploadPakan from '../upload-pakan';
import PreviewPhoto from '../preview-photo';

const KATEGORI_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

export default function PemberianPakanView() {
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const theme = useTheme();

  const table = useTable();
  const popover = usePopover();

  const {
    data: dataTernak,
    getData: getPemberianPakan,
    loading: loadingTernak,
    totalData: totalTernak,
  } = useGetData();

  const { deleteData: deleteTernak } = useDeleteData();

  const confirm = useBoolean();
  const openModal = useBoolean();
  const openModalUpload = useBoolean();
  const openModalPhoto = useBoolean();

  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [type, setType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [category, setCategory] = useState('upcoming');
  const [dataGridTable, setDataGridTable] = useState({
    page: 0,
    pageSize: 5,
    orderBy: '',
    order: 'desc',
    filter: 'false',
  });

  const fetchData = useCallback(() => {
    getPemberianPakan(
      dataGridTable.page + 1,
      dataGridTable.pageSize,
      // `${dataGridTable.filter ? `(given = ${dataGridTable?.filter})` : ''}`,
      `kandang.peternakan = "${user.createdBy}"  ${
        dataGridTable?.filter ? `&& given = ${dataGridTable?.filter}` : ''
      }`,
      dataGridTable.orderBy
        ? `${dataGridTable.order === 'asc' ? '' : '-'}${dataGridTable.orderBy}`
        : '-created',
      'pemberianPakan',
      'kandang, pen'
    );
  }, [dataGridTable, getPemberianPakan]);

  useEffect(() => {
    if (dataTernak) {
      setTableData(dataTernak);
    }
  }, [dataTernak]);

  useEffect(() => {
    fetchData();
  }, [dataGridTable]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [settings]);

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
    setDataGridTable({
      ...dataGridTable,
      filter: newValue === 'upcoming' ? 'false' : 'true',
    });
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
      field: 'tanggal',
      headerName: 'Tanggal',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => fDate(params.row.created),
    },
    {
      field: 'created',
      headerName: 'Waktu',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => fTime(params.row.created),
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
      minWidth: 160,
      renderCell: (params) => `${params.row.bobotPakan} kg`,
    },
    {
      field: 'kandang',
      headerName: 'Kandang',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => params.row.expand.kandang.namaKandang,
    },
    {
      field: 'pen',
      headerName: 'Pen',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const listPen = params.row.expand.pen;
        return (
          <Stack spacing={1} flexDirection={'row'} flexWrap={'wrap'} py={'14px'}>
            {listPen.map((pen) => (
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
      field: '',
      headerName: '',
      align: 'right',
      headerAlign: 'right',
      flex: 1,
      renderCell: (params) => {
        const title = params.row.given ? 'Lihat Photo' : 'Upload Data Pakan';
        const icon = params.row.given ? 'tabler:photo' : 'ri:upload-cloud-2-line';
        const isSuccesss = params.row.given;

        return (
          <IconButton
            color={popover.open ? 'primary' : 'default'}
            onClick={(e) => {
              // popover.onOpen(e);
              if (isSuccesss) {
                openModalPhoto.onTrue();
                setSelectedRow(params.row);
              } else {
                openModalUpload.onTrue();
                setSelectedRow(params.row);
              }
            }}
          >
            <Tooltip title={title} placement="top" arrow>
              <Iconify icon={icon} />
            </Tooltip>
          </IconButton>
        );
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
                <Typography variant="h4">Data Pemberian Pakan</Typography>
                {/* <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    openModal.onTrue();
                    setType('CREATE');
                  }}
                >
                  + Tambah Data
                </Button> */}
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
                  columns={columns}
                  table={dataGridTable}
                  totalData={totalTernak}
                  loading={loadingTernak}
                  onDataGridChange={onDataGridChange}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  disableMultipleRowSelection
                  getRowHeight={() => 'auto'}
                  sxCell={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
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
        {/* <MenuItem href={`${paths.anakKandang.ternak.edit(selectedRow?.id)}`} component={RouterLink}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem> */}
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
        <ScanPakanModal
          open={openModal.value}
          onClose={openModal.onFalse}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          type={type}
          setType={setType}
          refetch={fetchData}
        />
      )}
      {openModalUpload.value && (
        <UploadPakan
          open={openModalUpload.value}
          onClose={openModalUpload.onFalse}
          data={selectedRow}
          refetch={fetchData}
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
