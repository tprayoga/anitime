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

import OverviewKandang from '../overview-kandang';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
// import RiwayatTableRow from '../riwayat-table-row';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuthContext } from 'src/auth/hooks';
import { useGetTernak } from 'src/api/peternakan/ternak';
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
  const popover = usePopover();
  const theme = useTheme();

  const settings = useSettingsContext();

  const denseHeight = table.dense ? 60 : 80;

  const { data: dataTernak, getTernak, loadingTernak, totalData: totalTernak } = useGetTernak();
  const { deleteTernak, isSubmitting } = useDeleteTernak();


  const confirm = useBoolean();


  const [tableData, setTableData] = useState([]);
  const [searchData, setSearchData] = useState('');
  const [selectedRow, setSelectedRow] = useState('');

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

    return `${tahun ? `${tahun} Tahun` : ''} ${bulan ? `${bulan} Bulan` : ''} ${hariSisa ? `${hariSisa} Hari` : ''
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

  const handleDelete = async () => {

    try {
      await deleteTernak(selectedRow.id);
      enqueueSnackbar('Success', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed', { variant: 'error' });
    } finally {
      popover.onClose();
      confirm.onFalse();
      // setRefetch((x) => !x)
      // refetch
      getTernak(
        dataGridTable?.page + 1,
        dataGridTable?.pageSize,
        `peternakan = "${user.createdBy}" ${dataGridTable?.filter
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

  }

  const columns = [
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
            typography: 'caption'
          }}
          onClick={() => {
            window.location.replace(`${paths.anakKandang.ternak.detail(params?.row?.id)}`, '_blank');
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
    {
      field: '',
      headerName: '',
      align: 'right',
      headerAlign: 'right',
      flex: 1,
      renderCell: (params) => (

        <IconButton
          color={popover.open ? 'primary' : 'default'}
          onClick={(e) => {
            popover.onOpen(e);
            setSelectedRow(params.row)
          }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      ),
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
        `peternakan = "${user.createdBy}" ${dataGridTable?.filter
          ? `&& (RFID ~ "${dataGridTable?.filter}" 
            || jenisKelamin ~ "${dataGridTable?.filter}"
            || jenisBreed ~ "${dataGridTable?.filter}"
            || jenisHewan ~ "${dataGridTable?.filter}"
            || kandang.namaKandang ~ "${dataGridTable?.filter}"
            || umur ~ "${dataGridTable?.filter}"
            || berat ~ "${dataGridTable?.filter}"
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
        `peternakan = "${user.createdBy}" ${dataGridTable?.filter
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
  }, [dataGridTable?.page, dataGridTable?.pageSize, dataGridTable?.order, dataGridTable?.orderBy]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>

          <Grid xs={12} md={12}>
            <Card>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                width={'100%'}
              >
                <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                  Data Ternak
                </Typography>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    window.open(`${paths.anakKandang.ternak.importData}`);
                  }}
                  sx={{
                    ml: 'auto'
                  }}
                >
                  + Import Data
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  href={`${paths.anakKandang.ternak.create}`}
                  component={RouterLink}
                >
                  + Tambah Data
                </Button>

              </Stack>
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
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >

        <MenuItem
          href={`${paths.anakKandang.ternak.edit(selectedRow.id)}`}
          component={RouterLink}
        >
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
    </>
  );
}
