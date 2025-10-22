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
import { useGetData, useGetOneData } from 'src/api/custom-domba-api';

// ----------------------------------------------------------------------

export default function TernakView() {
  const { user } = useAuthContext();

  const popover = usePopover();
  const theme = useTheme();

  const settings = useSettingsContext();

  // const { data: dataTernak, getTernak, loadingTernak, totalData: totalTernak } = useGetTernak();

  const {
    data: dataTernak,
    getData: getTernak,
    loading: loadingTernak,
    totalData: totalTernak,
  } = useGetData();

  const { deleteTernak, isSubmitting } = useDeleteTernak();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState('');

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

  const hitungUmur = (lahir) => {
    let date1 = new Date(lahir);
    let date2 = new Date(Date.now());

    let Difference_In_Time = date2.getTime() - date1.getTime();
    let hari = Math.round(Difference_In_Time / (1000 * 3600 * 24));

    const tahun = Math.floor(hari / 365);
    const sisaHari = hari % 365;
    const bulan = Math.floor(sisaHari / 30);
    const hariSisa = sisaHari % 30;

    return `${tahun ? `${tahun} Tahun` : ''} ${bulan ? `${bulan} Bulan` : ''} ${
      hariSisa ? `${hariSisa} Hari` : ''
    }`;
  };

  const fetchData = () => {
    getTernak(
      dataGridTable?.page + 1,
      dataGridTable?.rowsPerPage,
      `kandang.peternakan = "${user.createdBy}"  ${
        dataGridTable?.filter ? `&& noFID ~ "${dataGridTable?.filter}"` : ''
      }`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'ternak',
      'pen, pen.kandang, bodyConditionalScore'
    );
  };

  const columns = [
    {
      field: 'noFID',
      headerName: 'No FID',
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
              ? window.open(`${paths.dombaAnakKandang.ternak.detail(params?.row?.id)}`, '_blank')
              : window.open(
                  `${paths.dombaIntiAnakKandang.ternak.detail(params?.row?.id)}`,
                  '_blank'
                );
          }}
        >
          {params?.row?.noFID}
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
      renderCell: (params) => `${hitungUmur(params?.row?.tanggalLahir)}`,
    },
    {
      field: 'berat',
      headerName: 'Berat',
      flex: 1,
      renderCell: (params) => `${params?.row?.berat} Kg`,
    },
    {
      field: 'pen',
      headerName: 'Lokasi',
      flex: 1,
      renderCell: (params) =>
        `${params?.row?.expand?.pen?.expand?.kandang?.namaKandang} || ${params?.row?.expand?.pen?.namaPen}`,
    },
    {
      field: 'kondisi',
      headerName: 'Kondisi',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        const score = params?.row?.expand?.bodyConditionalScore?.score;
        const status = params?.row?.expand?.bodyConditionalScore?.name;

        return (
          <Label variant="soft" color={score <= 2 ? 'error' : score === 3 ? 'warning' : 'success'}>
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
            setSelectedRow(params.row);
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

    if (dataGridTable?.orderBy !== 'no') {
      fetchData();
    }
  }, [dataGridTable?.filter]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    if (dataGridTable?.orderBy !== 'no') {
      fetchData();
    }
  }, [dataGridTable?.page, dataGridTable?.pageSize, dataGridTable?.order, dataGridTable?.orderBy]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card>
              <Stack direction="row" spacing={2} alignItems="center" width={'100%'}>
                <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                  Data Ternak
                </Typography>
                {/* <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    window.open(`${paths.anakKandang.ternak.importData}`);
                  }}
                  sx={{
                    ml: 'auto',
                  }}
                >
                  + Import Data
                </Button> */}

                <Button
                  color="primary"
                  variant="contained"
                  href={`${
                    user.role === 'anakKandang'
                      ? paths.dombaAnakKandang.ternak.create
                      : paths.dombaIntiAnakKandang.ternak.create
                  }`}
                  component={RouterLink}
                  sx={{
                    ml: 'auto',
                    mr: 2,
                  }}
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
        {/* <MenuItem href={`${paths.anakKandang.ternak.edit(selectedRow.id)}`} component={RouterLink}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem> */}

        {/* <MenuItem
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
    </>
  );
}
