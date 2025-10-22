'use client';

import uuidv4 from 'src/utils/uuidv4';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import DataGridAnitime from 'src/components/dataGridAnitime';
import { useGetData, useGetOneData } from 'src/api/custom-domba-api';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import CardOverview from '../card-overview';
import { useDebounce } from 'src/hooks/use-debounce';
import KandangTableToolbar from 'src/sections/peternakan/kandang/kandang-table-toolbar';
import { TablePaginationCustom } from 'src/components/table';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
import { alpha } from '@mui/material/styles';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import QRCode from 'react-qr-code';
import { useBoolean } from 'src/hooks/use-boolean';
import GenerateBarcodeModal from 'src/components/modal-domba/anak-kandang/generate-barcode-modal';

// ----------------------------------------------------------------------

export default function KandangDetailView({ id }) {
  const { user } = useAuthContext();

  const {
    data: dataPen,
    error: errorPen,
    empty: emptyPen,
    loading: loadingPen,
    totalData: totalPen,
    getData: getPen,
  } = useGetData();

  const {
    data: dataTernak,
    loading: loadingTernak,
    totalData: totalTernak,
    getData: getTernak,
  } = useGetData();

  const { data: detailKandang, error, loading, getOneData } = useGetOneData();

  const theme = useTheme();

  const settings = useSettingsContext();
  const popover = usePopover();
  const openModal = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [view, setView] = useState('list');
  const [searchData, setSearchData] = useState('');
  const [category, setCategory] = useState('pen');
  const [selectedRow, setSelectedRow] = useState('');

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

  const toggleCategory = useCallback(() => {
    if (category === 'pen') {
      setCategory('kamera');
    } else {
      setCategory('pen');
    }
  }, [category]);

  const KATEGORI_OPTIONS = [
    { value: 'pen', label: 'Pen' },
    { value: 'kamera', label: 'Kamera' },
  ];

  const dummyCamera = [
    {
      id: uuidv4(),
      namaKamera: 'Kamera 1',
    },
    {
      id: uuidv4(),
      namaKamera: 'Kamera 2',
    },
    {
      id: uuidv4(),
      namaKamera: 'Kamera 3',
    },
    {
      id: uuidv4(),
      namaKamera: 'Kamera 4',
    },
  ];

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
      field: 'namaPen',
      headerName: 'Nama Pen',
      flex: 1,
      editable: true,
    },
    {
      field: 'jenisPen',
      headerName: 'Jenis Pen',
      flex: 1,
      renderCell: (params) => `${params?.row?.jenisPen}`,
    },
    {
      field: 'jantan',
      headerName: 'Total Jantan',
      sortable: false,
      flex: 1,
      renderCell: (params) => `${params?.row?.jantan} Ekor`,
    },
    {
      field: 'betina',
      headerName: 'Total Betina',
      sortable: false,
      flex: 1,
      renderCell: (params) => `${params?.row?.betina} Ekor`,
    },
    {
      field: 'jumlahTernak',
      headerName: 'Jumlah Ternak',
      sortable: false,
      flex: 1,
      renderCell: (params) => `${params?.row?.jumlahTernak} Ekor`,
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
    const fetchTernakData = async () => {
      const updatedData = await Promise.all(
        dataPen.map(async (prev, index) => {
          let betina, jantan, jumlahTernak;
          try {
            const resJantan = await getTernak(
              1,
              5,
              `pen.kandang.peternakan = "${user.createdBy}" && pen.kandang.id = "${id}" && pen.id = "${prev?.id}" && jenisKelamin = "Jantan"`,
              '-created',
              'ternak'
            );
            const resBetina = await getTernak(
              1,
              5,
              `pen.kandang.peternakan = "${user.createdBy}" && pen.kandang.id = "${id}" && pen.id = "${prev?.id}"  && jenisKelamin = "Betina"`,
              '-created',
              'ternak'
            );
            jantan = resJantan?.totalItems;
            betina = resBetina?.totalItems;
            jumlahTernak = jantan + betina;
          } catch (error) {
            console.error('Error fetching ternak data:', error);
            jantan = 0;
            betina = 0;
            jumlahTernak = 0;
          }

          return {
            ...prev,
            no: dataGridTable?.page * dataGridTable?.pageSize + index + 1,
            jumlahTernak,
            betina,
            jantan,
          };
        })
      );

      setTableData(updatedData);
    };

    fetchTernakData();
  }, [dataPen]);

  useEffect(() => {
    setDataGridTable({ ...dataGridTable, page: 0 });

    getPen(1, dataGridTable?.rowsPerPage, options()?.filter, options()?.sort, 'pen');
  }, [dataGridTable?.filter, debouncedSearch]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    getPen(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      options()?.filter,
      options()?.sort,
      'pen'
    );
  }, [dataGridTable?.page, dataGridTable?.pageSize, dataGridTable?.order, dataGridTable?.orderBy]);

  useEffect(() => {
    if (id) {
      getOneData(id, 'kandang');
    }
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Box sx={{ px: 2, py: 2 }}>
            <Button
              component={RouterLink}
              href={paths.dombaAnakKandang.kandang.root}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            >
              Back
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
                  <Typography fontWeight={'bold'}>{detailKandang?.namaKandang}</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography>Luas</Typography>
                  <Typography fontWeight={'bold'}>{`${
                    detailKandang?.satuanKandang === 'Ha'
                      ? detailKandang?.luasKandang / 10000
                      : detailKandang?.luasKandang
                  } ${detailKandang?.satuanKandang}`}</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography>Jumlah Ternak</Typography>
                  <Typography fontWeight={'bold'}>140 Ekor</Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography>Deskripsi</Typography>
                  <Typography fontWeight={'bold'}>{detailKandang?.deskripsi}</Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Tabs
            value={category}
            onChange={toggleCategory}
            sx={{
              mx: 2,
              my: 5,
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {KATEGORI_OPTIONS.map((tab) => (
              <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          {category === 'pen' && (
            <Grid xs={12} md={12}>
              <Card>
                <Stack
                  spacing={2}
                  direction={{ xs: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'center' }}
                >
                  <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                    Data Pen
                  </Typography>
                </Stack>

                <DataGridAnitime
                  data={tableData}
                  columns={columns}
                  table={dataGridTable}
                  totalData={totalPen}
                  loading={loadingPen}
                  onDataGridChange={onDataGridChange}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  disableMultipleRowSelection
                />
              </Card>
            </Grid>
          )}

          {category === 'kamera' && (
            <Grid xs={12} md={12}>
              <Card>
                <Stack
                  spacing={2}
                  direction={{ xs: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'center' }}
                >
                  <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                    Data Kamera
                  </Typography>
                </Stack>

                <Box sx={{ my: 2 }}>
                  {!dummyCamera?.length ? (
                    <EmptyContent
                      filled
                      title="No Data"
                      sx={{
                        py: 10,
                      }}
                    />
                  ) : (
                    <Box>
                      <KandangTableToolbar filters={searchData} setFilters={setSearchData} />

                      <Box sx={{ mx: 3, my: 2 }}>
                        <Grid container columns={12} spacing={{ xs: 1, md: 2, xl: 4 }}>
                          {dummyCamera.map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                              <Stack
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={1}
                                direction="row"
                                sx={{ mx: 4, mb: -5 }}
                              >
                                <Iconify icon="lucide:video" />

                                <Iconify icon="streamline:signal-full" />
                              </Stack>
                              <CardOverview title={`${item?.id} Ekor`} total={item?.namaKamera} />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>

                      <TablePaginationCustom
                        count={dummyCamera?.length}
                        page={dataGridTable?.page}
                        rowsPerPage={dataGridTable?.pageSize}
                        onPageChange={onChangePage}
                        onRowsPerPageChange={onChangeRowsPerPage}
                      />
                    </Box>
                  )}
                </Box>
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
      {openModal.value && (
        <GenerateBarcodeModal
          open={openModal.value}
          onClose={openModal.onFalse}
          data={selectedRow}
        />
      )}
    </>
  );
}
