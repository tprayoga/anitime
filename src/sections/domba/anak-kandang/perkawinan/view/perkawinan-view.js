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
  MenuItem,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Tooltip,
  Typography,
  alpha,
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
// import TernakTableRow from '../ternak-table-row';
// import TernakTableToolbar from '../ternak-table-toolbar';
// import TernakTableHead from '../ternak-table-head';

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

import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
// import RiwayatTableRow from '../riwayat-table-row';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuthContext } from 'src/auth/hooks';
// import DataGridTernak from './data-grid-ternak';
import DataGridTernak from '../data-grid-ternak';
import Label from 'src/components/label';
import { paths } from 'src/routes/paths';
import DataGridAnitime from 'src/components/dataGridAnitime';
import { RouterLink } from 'src/routes/components';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useDeleteTernak } from 'src/api/anak-kandang/ternak';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { useGetData, useGetOneData } from 'src/api/custom-domba-api';
import { fDate } from 'src/utils/format-time';
import AddPerkawinanModal from 'src/components/modal-domba/anak-kandang/add-perkawinan-modal';
import AddBirahiModal from 'src/components/modal-domba/anak-kandang/add-birahi-modal';

// ----------------------------------------------------------------------

const KATEGORI_OPTIONS = [
  { value: 'birahi', label: 'Birahi' },
  { value: 'perkawinan', label: 'Perkawinan' },
  // { value: 'kebuntingan', label: 'Kebuntingan' },
  // { value: 'kelahiran', label: 'Kelahiran' },
  // { value: 'penyapihan', label: 'Penyapihan' },
];

export default function PerkawinanView() {
  const { user } = useAuthContext();

  const table = useTable();
  const popover = usePopover();
  const theme = useTheme();

  const settings = useSettingsContext();

  const {
    data: dataPerkawinan,
    getData: getPerkawinan,
    loading: loadingPerkawinan,
    totalData: totalPerkawinan,
  } = useGetData();

  const {
    data: dataBirahi,
    getData: getBirahi,
    loading: loadingBirahi,
    totalData: totalBirahi,
  } = useGetData();

  const {
    data: dataKelahiran,
    getData: getKelahiran,
    loading: loadingKelahiran,
    totalData: totalKelahiran,
  } = useGetData();

  const {
    data: dataPenyapihan,
    getData: getPenyapihan,
    loading: loadingPenyapihan,
    totalData: totalPenyapihan,
  } = useGetData();

  const { deleteTernak, isSubmitting } = useDeleteTernak();

  const confirm = useBoolean();
  const openModal = useBoolean();
  const openModalPerkawinan = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState('');
  const [type, setType] = useState(null);
  const [selectedData, setSelectedData] = useState('');
  const [category, setCategory] = useState('birahi');

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

  const handleDelete = async () => {
    try {
      await deleteTernak(selectedRow.id);
      enqueueSnackbar('Success', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed', { variant: 'error' });
    } finally {
      popover.onClose();
      confirm.onFalse();
      getPerkawinan(
        dataGridTable?.page + 1,
        dataGridTable?.pageSize,
        `${
          dataGridTable?.filter
            ? `&& (RFID ~ "${dataGridTable?.filter}" 
            || jenisKelamin ~ "${dataGridTable?.filter}"
            || jenisBreed ~ "${dataGridTable?.filter}"
            || jenisHewan ~ "${dataGridTable?.filter}"
            || kandang.namaKandang ~ "${dataGridTable?.filter}"
            || umur ~ "dataGridTable?.filter"
            || berat ~ "dataGridTable?.filter"
          )`
            : ''
        }`,
        dataGridTable?.orderBy
          ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
          : '-created'
      );
    }
  };

  const fetchPerkawinan = () => {
    getPerkawinan(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `peternakan = "${user.createdBy}"  ${
        dataGridTable?.filter ? `&& id ~ "${dataGridTable?.filter}"` : ''
      }`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'perkawinan',
      'ternakBetina, ternakJantan'
    );
  };

  // const roleFilter =
  //   user.role === 'Inti Peternakan'
  //     ? (`peternakan = "${user.id}"`)
  //     : (`peternakan = "${user.createdBy}"`);
  const fetchBirahi = () => {
    getBirahi(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `peternakan = "${user.createdBy}"  ${
        dataGridTable?.filter ? `&& id ~ "${dataGridTable?.filter}"` : ''
      }`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'birahi',
      'ternak'
    );
  };

  const fetchKelahiran = () => {
    getKelahiran(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `perkawinan.peternakan = "${user.createdBy}"  ${
        dataGridTable?.filter ? `&& id ~ "${dataGridTable?.filter}"` : ''
      }`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'kelahiran',
      'ternakBetina, ternakAnakan'
    );
  };

  const fetchPenyapihan = () => {
    getPenyapihan(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `${dataGridTable?.filter ? `id ~ "${dataGridTable?.filter}"` : ''}`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'penyapihan',
      'ternak'
    );
  };

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  const columnsPerkawinan = [
    {
      field: 'created',
      headerName: 'Tanggal',
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
            user.role === 'anakKandang'
              ? window.open(
                  `${paths.dombaAnakKandang.perkawinan.detail(params?.row?.id)}`,
                  '_blank'
                )
              : window.open(
                  `${paths.dombaIntiAnakKandang.perkawinan.detail(params?.row?.id)}`,
                  '_blank'
                );
          }}
        >
          {fDate(params?.row?.created)}
        </Typography>
      ),
    },
    {
      field: 'ternakJantan',
      headerName: 'Ternak Jantan',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => `${params?.row?.expand?.ternakJantan?.[0]?.noFID ?? ''}`,
    },
    {
      field: 'ternakBetina',
      headerName: 'Ternak Betina',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => `${params?.row?.expand?.ternakBetina?.length} ekor`,
    },
    {
      field: 'metodePengkawinan',
      headerName: 'Metode Pengkawinan',
      flex: 1,
      minWidth: 160,
    },
  ];

  const columnsBirahi = [
    {
      field: 'created',
      headerName: 'Tanggal',
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
            user.role === 'anakKandang'
              ? window.open(
                  `${paths.dombaAnakKandang.birahi.detail(params?.row?.ternak)}`,
                  '_blank'
                )
              : window.open(
                  `${paths.dombaIntiAnakKandang.birahi.detail(params?.row?.ternak)}`,
                  '_blank'
                );
          }}
        >
          {fDate(params?.row?.created)}
        </Typography>
      ),
    },
    {
      field: 'ternak',
      headerName: 'Ternak',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => `${params?.row?.expand?.ternak?.noFID}`,
    },
    {
      field: 'gejalaBirahi',
      headerName: 'Gejala Birahi',
      flex: 1,
      minWidth: 160,
    },
  ];

  const columnsKelahiran = [
    {
      field: 'created',
      headerName: 'Tanggal',
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
          // onClick={() => {
          //   user.role === 'anakKandang'
          //     ? window.open(
          //         `${paths.dombaAnakKandang.perkawinan.detail(params?.row?.id)}`,
          //         '_blank'
          //       )
          //     : window.open(
          //         `${paths.dombaIntiAnakKandang.perkawinan.detail(params?.row?.id)}`,
          //         '_blank'
          //       );
          // }}
        >
          {fDate(params?.row?.created)}
        </Typography>
      ),
    },
    {
      field: 'jumlahAnak',
      headerName: 'Jumlah Anak',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => `${params?.row?.jumlahAnak} ekor`,
    },
    {
      field: 'ternakBetina',
      headerName: 'Ternak Betina',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => `${params?.row?.expand?.ternakBetina?.noFID ?? ''}`,
    },
    {
      field: 'ternakAnakan',
      headerName: 'Ternak Anakan',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        const anakanList = params?.row?.expand?.ternakAnakan ?? [];
        return anakanList
          .map((anakan) => anakan?.noFID)
          .filter(Boolean)
          .join(', ');
      },
    },
  ];

  const columnsPenyapihan = [
    {
      field: 'created',
      headerName: 'Tanggal',
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
          // onClick={() => {
          //   user.role === 'anakKandang'
          //     ? window.open(
          //         `${paths.dombaAnakKandang.perkawinan.detail(params?.row?.id)}`,
          //         '_blank'
          //       )
          //     : window.open(
          //         `${paths.dombaIntiAnakKandang.perkawinan.detail(params?.row?.id)}`,
          //         '_blank'
          //       );
          // }}
        >
          {fDate(params?.row?.created)}
        </Typography>
      ),
    },
    {
      field: 'ternak',
      headerName: 'Ternak',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => `${params?.row?.expand?.ternak?.noFID ?? ''}`,
    },
    {
      field: 'bobot',
      headerName: 'Bobot',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => `${params?.row?.bobot} kg`,
    },
  ];

  useEffect(() => {
    if (category === 'birahi') {
      setTableData(dataBirahi);
    } else if (category === 'perkawinan') {
      setTableData(dataPerkawinan);
    } else if (category === 'kebuntingan') {
      setTableData(dataPerkawinan);
    } else if (category === 'kelahiran') {
      setTableData(dataKelahiran);
    } else if (category === 'penyapihan') {
      setTableData(dataPenyapihan);
    }
  }, [dataPerkawinan, dataBirahi, dataKelahiran, dataPenyapihan]);

  // useEffect(() => {
  //   setDataGridTable({ ...dataGridTable, page: 0 });

  //   if (dataGridTable?.orderBy !== 'no') {
  //     fetchPerkawinan();
  //   }
  // }, [dataGridTable?.filter]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    if (category === 'birahi') {
      fetchBirahi();
    } else if (category === 'perkawinan') {
      fetchPerkawinan();
    } else if (category === 'kebuntingan') {
      fetchPerkawinan();
    } else if (category === 'kelahiran') {
      fetchKelahiran();
    } else if (category === 'penyapihan') {
      fetchPenyapihan();
    }
  }, [
    dataGridTable?.page,
    dataGridTable?.pageSize,
    dataGridTable?.order,
    dataGridTable?.orderBy,
    dataGridTable?.filter,
    category,
  ]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                width={'100%'}
              >
                <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                  Data Pembiakan
                </Typography>

                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    if (category === 'birahi') {
                      openModal.onTrue();
                    }
                    if (category === 'perkawinan') {
                      openModalPerkawinan.onTrue();
                    }
                    setType('CREATE');
                  }}
                  sx={{
                    mr: 2,
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
                {category === 'birahi' && (
                  <DataGridAnitime
                    data={tableData}
                    columns={columnsBirahi}
                    table={dataGridTable}
                    totalData={totalBirahi}
                    loading={loadingBirahi}
                    onDataGridChange={onDataGridChange}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    disableMultipleRowSelection
                  />
                )}
                {category === 'perkawinan' && (
                  <DataGridAnitime
                    data={tableData}
                    columns={columnsPerkawinan}
                    table={dataGridTable}
                    totalData={totalPerkawinan}
                    loading={loadingPerkawinan}
                    onDataGridChange={onDataGridChange}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    disableMultipleRowSelection
                  />
                )}
                {category === 'kelahiran' && (
                  <DataGridAnitime
                    data={tableData}
                    columns={columnsKelahiran}
                    table={dataGridTable}
                    totalData={totalKelahiran}
                    loading={loadingKelahiran}
                    onDataGridChange={onDataGridChange}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    disableMultipleRowSelection
                  />
                )}
                {category === 'penyapihan' && (
                  <DataGridAnitime
                    data={tableData}
                    columns={columnsPenyapihan}
                    table={dataGridTable}
                    totalData={totalPenyapihan}
                    loading={loadingPenyapihan}
                    onDataGridChange={onDataGridChange}
                    disableRowSelectionOnClick
                    disableColumnMenu
                    disableMultipleRowSelection
                  />
                )}
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
        <MenuItem href={`${paths.anakKandang.ternak.edit(selectedRow.id)}`} component={RouterLink}>
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
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ternak ${selectedRow.RFID}?`}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        }
      />
      {openModalPerkawinan.value && (
        <AddPerkawinanModal
          open={openModalPerkawinan.value}
          onClose={openModalPerkawinan.onFalse}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          type={type}
          setType={setType}
          refetch={fetchPerkawinan}
          // setRefetch={setRefetch}
        />
      )}
      {openModal.value && (
        <AddBirahiModal
          open={openModal.value}
          onClose={openModal.onFalse}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          type={type}
          setType={setType}
          refetch={fetchBirahi}
          // setRefetch={setRefetch}
        />
      )}
    </>
  );
}
