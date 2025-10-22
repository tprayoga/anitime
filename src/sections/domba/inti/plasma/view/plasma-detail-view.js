'use client';

import uuidv4 from 'src/utils/uuidv4';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import DataGridAnitime from 'src/components/dataGridAnitime';
import { useGetData, useGetOneData } from 'src/api/custom-domba-api';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import QRCode from 'react-qr-code';
import { useBoolean } from 'src/hooks/use-boolean';
import GenerateBarcodeModal from 'src/components/modal-domba/anak-kandang/generate-barcode-modal';
import AddPenModal from 'src/components/modal-domba/anak-kandang/add-pen-modal';
import { useDebounce } from 'src/hooks/use-debounce';
import { TablePaginationCustom } from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { alpha } from '@mui/material/styles';
import KandangTableToolbar from 'src/sections/peternakan/kandang/kandang-table-toolbar';
import Label from 'src/components/label';
import Chart, { useChart } from 'src/components/chart';
import ScatterChartView from '../scatter-chart-view';
import ChartColumnMultiple from 'src/sections/_examples/extra/chart-view/chart-column-multiple';
import ChartBar from 'src/sections/_examples/extra/chart-view/chart-bar';
import ChartLine from 'src/sections/_examples/extra/chart-view/chart-line';

// ----------------------------------------------------------------------

export default function PlasmaDetailView({ id }) {
  const { user } = useAuthContext();

  //   const {
  //     data: dataPen,
  //     error: errorPen,
  //     empty: emptyPen,
  //     loading: loadingPen,
  //     totalData: totalPen,
  //     getData: getTernak,
  //   } = useGetData();

  const {
    data: dataTernak,
    loading: loadingTernak,
    totalData: totalTernak,
    getData: getTernak,
  } = useGetData();

  const {
    data: dataStockPakan,
    loading: loadingStockPakan,
    totalData: totalStockPakan,
    getData: getStockPakan,
  } = useGetData();

  const { data: detailKandang, error, loading, getOneData } = useGetOneData();

  const theme = useTheme();

  const settings = useSettingsContext();
  const popover = usePopover();
  const openModal = useBoolean();
  const openPenModal = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [view, setView] = useState('list');
  const [searchData, setSearchData] = useState('');
  const [category, setCategory] = useState('overview');
  const [selectedRow, setSelectedRow] = useState('');
  const [type, setType] = useState('CREATE');

  const debouncedSearch = useDebounce(searchData);

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

  const onChangeRowsPerPage = useCallback((event) => {
    setDataGridTable({ ...dataGridTable, page: 0, pageSize: event.target.value });
  }, []);

  const onChangePage = useCallback((event, newPage) => {
    setDataGridTable({ ...dataGridTable, page: newPage });
  }, []);

  const handleChangeView = useCallback((event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  }, []);

  const toggleCategory = useCallback((event, newValue) => {
    if (newValue !== null) {
      setCategory(newValue);
    }
  }, []);

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

  const fetchTernak = () => {
    getTernak(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `kandang.peternakan = "${id}"`,
      options()?.sort,
      'ternak',
      'kandang, pen, bodyConditionalScore'
    );
  };

  const fetchPakan = () => {
    getStockPakan(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `${dataGridTable.filter}`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'registrasiPakan'
    );
  };

  const KATEGORI_OPTIONS = [
    { value: 'overview', label: 'Overview' },
    { value: 'dataTernak', label: 'Data Ternak' },
    { value: 'stockPakan', label: 'Data Stock Pakan' },
  ];

  //   const columns = [
  //     {
  //       field: 'no',
  //       headerName: 'No',
  //       width: 100,
  //       align: 'center',
  //       headerAlign: 'center',
  //       hideable: false,
  //       sortable: false,
  //     },
  //     {
  //       field: 'namaPen',
  //       headerName: 'Nama Pen',
  //       flex: 1,
  //       editable: true,
  //     },
  //     {
  //       field: 'jenisPen',
  //       headerName: 'Jenis Pen',
  //       flex: 1,
  //       renderCell: (params) => `${params?.row?.jenisPen}`,
  //     },
  //     {
  //       field: 'jantan',
  //       headerName: 'Total Jantan',
  //       sortable: false,
  //       flex: 1,
  //       renderCell: (params) => `${params?.row?.jantan} Ekor`,
  //     },
  //     {
  //       field: 'betina',
  //       headerName: 'Total Betina',
  //       sortable: false,
  //       flex: 1,
  //       renderCell: (params) => `${params?.row?.betina} Ekor`,
  //     },
  //     {
  //       field: 'jumlahTernak',
  //       headerName: 'Jumlah Ternak',
  //       sortable: false,
  //       flex: 1,
  //       renderCell: (params) => `${params?.row?.jumlahTernak} Ekor`,
  //     },
  //     {
  //       field: '',
  //       headerName: '',
  //       align: 'right',
  //       headerAlign: 'right',
  //       flex: 1,
  //       renderCell: (params) => (
  //         <IconButton
  //           color={popover.open ? 'primary' : 'default'}
  //           onClick={(e) => {
  //             popover.onOpen(e);
  //             setSelectedRow(params.row);
  //           }}
  //         >
  //           <Iconify icon="eva:more-vertical-fill" />
  //         </IconButton>
  //       ),
  //     },
  //   ];

  const columns = [
    {
      field: 'noFID',
      headerName: 'No FID',
      flex: 1,
      minWidth: 160,
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
      renderCell: (params) => `${hitungUmur(params?.row?.tanggalLahir)}`,
    },
    {
      field: 'berat',
      headerName: 'Berat',
      flex: 1,
      renderCell: (params) => `${params?.row?.berat} Kg`,
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
  ];

  const columnsStockPakan = [
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
  const options = () => {
    return {
      filter: `kandang.peternakan = "${user.createdBy}" && kandang.id = "${id}" ${
        dataGridTable?.filter || debouncedSearch
          ? `&& (namaPen ~ "${dataGridTable?.filter || debouncedSearch}" 
            || jenisPen ~ "${dataGridTable?.filter || debouncedSearch}"
            || jenisHewan ~ "${dataGridTable?.filter || debouncedSearch}"
            || deskripsi ~ "${dataGridTable?.filter || debouncedSearch}"
          )`
          : ''
      }`,
      sort: dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
    };
  };

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    if (category === 'dataTernak') {
      fetchTernak();
    } else if (category === 'stockPakan') {
      fetchPakan();
    }
  }, [
    dataGridTable?.page,
    dataGridTable?.pageSize,
    dataGridTable?.order,
    dataGridTable?.orderBy,
    category,
  ]);

  useEffect(() => {
    if (id) {
      getOneData(id, 'users');
    }
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Box
            sx={{
              px: 2,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Button
              component={RouterLink}
              href={paths.dombaAnakKandang.kandang.root}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            >
              Back
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                openPenModal.onTrue();
              }}
            >
              + Tambah Data
            </Button>
          </Box>

          <Grid xs={12}>
            <Card
              sx={{
                px: 4,
                py: 2,
                borderRadius: 1,
              }}
            >
              <Stack flexDirection={'row'} spacing={10}>
                <Stack spacing={1}>
                  <Typography>Nama</Typography>
                  <Typography fontWeight={'bold'}>{detailKandang?.name}</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography>No Handhpone</Typography>
                  <Typography fontWeight={'bold'}>+62 {detailKandang?.phone}</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography>Alamat</Typography>
                  <Typography fontWeight={'bold'}>{detailKandang?.alamat}</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography>Jumlah Ternak</Typography>
                  <Typography fontWeight={'bold'}>140 Ekor</Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Tabs
            value={category}
            onChange={toggleCategory}
            sx={{
              px: 2.5,
              my: 3,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {KATEGORI_OPTIONS.map((tab) => (
              <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          {category === 'overview' && (
            <Grid xs={12} md={12}>
              <Typography variant="h5" gutterBottom>
                Analisis Pertumbuhan ADG
              </Typography>
              <Card sx={{ width: '100%' }}>
                <CardHeader />
                <Box sx={{ mx: 3 }}>
                  <ScatterChartView />
                </Box>
              </Card>
              <Typography variant="h5" gutterBottom mt={4}>
                Analisis Pertumbuhan Operasional Cost dan Estimasi Harga Jual Ternak
              </Typography>
              <Card sx={{ width: '100%' }}>
                <CardHeader />
                <Box sx={{ mx: 3 }}>
                  <ChartLine
                    series={[
                      {
                        name: 'Operasional Costs',
                        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
                      },
                      {
                        name: 'Harga Jual',
                        data: [28, 74, 81, 91, 100, 102, 120, 135, 158],
                      },
                    ]}
                  />
                </Box>
              </Card>
            </Grid>
          )}
          {category === 'dataTernak' && (
            <Grid xs={12} md={12}>
              <Card>
                <Stack
                  spacing={2}
                  direction={{ xs: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'center' }}
                >
                  <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                    Data Ternak
                  </Typography>
                </Stack>

                <DataGridAnitime
                  data={dataTernak}
                  columns={columns}
                  table={dataGridTable}
                  totalData={totalTernak}
                  loading={loadingTernak}
                  onDataGridChange={onDataGridChange}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  disableMultipleRowSelection
                />
              </Card>
            </Grid>
          )}

          {category === 'stockPakan' && (
            <Grid xs={12} md={12}>
              <Card>
                <Stack
                  spacing={2}
                  direction={{ xs: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'center' }}
                >
                  <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                    Data Pakan
                  </Typography>
                </Stack>

                <DataGridAnitime
                  data={dataStockPakan}
                  columns={columnsStockPakan}
                  table={dataGridTable}
                  totalData={totalStockPakan}
                  loading={loadingStockPakan}
                  onDataGridChange={onDataGridChange}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  disableMultipleRowSelection
                />
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            openModal.onTrue();
          }}
        >
          <Iconify icon="ph:barcode-bold" />
          Cetak Barcode
        </MenuItem>
      </CustomPopover>
    </>
  );
}
