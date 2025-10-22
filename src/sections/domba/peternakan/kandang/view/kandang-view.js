'use client';

import uuidv4 from 'src/utils/uuidv4';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import DataGridAnitime from 'src/components/dataGridAnitime';
import { useGetData, useUpdateData, useCreateData } from 'src/api/custom-domba-api';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import CardOverview from '../card-overview';
import { useDebounce } from 'src/hooks/use-debounce';
import KandangTableToolbar from 'src/sections/peternakan/kandang/kandang-table-toolbar';
import { TablePaginationCustom, useTable } from 'src/components/table';
import { paths } from 'src/routes/paths';
import KandangGridView from '../kandang-grid-view';
import { collection } from 'firebase/firestore';
import { set } from 'lodash';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function KandangView({ data }) {
  const { user } = useAuthContext();

  const table = useTable();

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const {
    data: dataKandang,
    error,
    empty,
    loading: loadingKandang,
    totalData: totalKandang,
    getData: getKandang,
  } = useGetData();

  const {
    data: dataTernak,
    loading: loadingTernak,
    totalData: totalTernak,
    getData: getTernak,
  } = useGetData();

  const {
    data: dataPen,
    error: errorPen,
    empty: emptyPen,
    loading: loadingPen,
    totalData: totalPen,
    getData: getPen,
  } = useGetData();

  const { loading: updateLoading, error: updateError, updateData: updateTernak } = useUpdateData();

  const {
    loading: createLoading,
    error: createError,
    createData: createLaluLintas,
  } = useCreateData();

  const confirm = useBoolean();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [tableDataGrid, setTableDataGrid] = useState([]);
  const [view, setView] = useState('list');
  const [searchData, setSearchData] = useState('');

  const [totalGrid, setTotalGrid] = useState(0);
  const [penGrid, setPenGrid] = useState({});
  const [ternakGrid, setTernakGrid] = useState({});

  const [loadingMove, setLoadingMove] = useState(false);

  const debouncedSearch = useDebounce(searchData);

  const [dataGridTable, setDataGridTable] = useState({
    page: 0,
    pageSize: 10,
    orderBy: '',
    order: 'desc',
    filter: '',
  });

  const [dataGridManager, setDataGridManager] = useState({
    page: 0,
    pageSize: 10,
    orderBy: '',
    order: 'desc',
    filter: '',
  });

  const onDataGridChange = (page) => {
    setDataGridTable({ ...dataGridTable, ...page });
  };

  const onChangeRowsPerPage = useCallback((event) => {
    setDataGridManager({ ...dataGridManager, page: 0, pageSize: event.target.value });
  }, []);

  const onChangePage = useCallback((event, newPage) => {
    setDataGridManager({ ...dataGridManager, page: newPage });
  }, []);

  const resetPage = () => {
    setDataGridTable({ ...dataGridTable, page: 0 });
    setDataGridManager({ ...dataGridManager, page: 0 });
  };

  const handleChangeView = useCallback((event, newView) => {
    if (newView !== null) {
      setView(newView);
      resetPage();
    }
  }, []);

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
      field: 'namaKandang',
      headerName: 'Nama Kandang',
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
            pt: 2,
          }}
          onClick={() => {
            user.role === 'peternakan'
              ? window.open(`${paths.dombaPeternakan.kandang.detail(params?.row?.id)}`, '_blank')
              : window.open(
                  `${paths.dombaIntiPeternakan.kandang.detail(params?.row?.id)}`,
                  '_blank'
                );
          }}
        >
          {params?.row?.namaKandang}
        </Typography>
      ),
    },
    {
      field: 'luasKandang',
      headerName: 'Luas Kandang',
      flex: 1,
      renderCell: (params) => {
        const { satuanKandang, luasKandang } = params.row;
        const luas = satuanKandang === 'Ha' ? luasKandang / 10000 : luasKandang;
        return `${luas} ${satuanKandang}`;
      },
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
  ];

  const options = () => {
    return {
      filter: `peternakan = "${user.id}" ${
        dataGridTable?.filter || debouncedSearch
          ? `&& (deskripsi ~ "${dataGridTable?.filter || debouncedSearch}"
            || satuanKandang ~ "${dataGridTable?.filter || debouncedSearch}"
            || luasKandang ~ "${dataGridTable?.filter || debouncedSearch}"
            || namaKandang ~ "${dataGridTable?.filter || debouncedSearch}"
          )`
          : ''
      }`,
      sort: dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
    };
  };

  const optionPen = () => {
    return {
      filter: `kandang.peternakan = "${user.id}" && kandang.id = "${penGrid?.id}" ${
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
      collection: 'pen',
    };
  };

  const optionTernak = () => {
    return {
      filter: `pen.kandang.peternakan = "${user?.id}" && pen.id = "${ternakGrid?.id}" ${
        dataGridTable?.filter || debouncedSearch
          ? `&& (noFID ~ "${dataGridTable?.filter || debouncedSearch}"
            || jenisHewan ~ "${dataGridTable?.filter || debouncedSearch} "
            || jenisKelamin ~ "${dataGridTable?.filter || debouncedSearch}"
            || jenisBreed ~ "${dataGridTable?.filter || debouncedSearch}"
            || berat ~ "${dataGridTable?.filter || debouncedSearch}"
            || tanggalLahir ~ "${dataGridTable?.filter || debouncedSearch}"
            || asalPeternakan ~ "${dataGridTable?.filter || debouncedSearch}"
            || bodyConditionalScore.name ~ "${dataGridTable?.filter || debouncedSearch}"
            || bodyFatScore.name ~ "${dataGridTable?.filter || debouncedSearch}"
            || pen.kandang.namaKandang ~ "${dataGridTable?.filter || debouncedSearch}"
          )`
          : ''
      }`,
      sort: dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      expand: 'pen,pen.kandang,bodyConditionalScore',
      collection: 'ternak',
    };
  };

  const refetchTernak = () => {
    getTernak(
      dataGridManager?.page + 1,
      dataGridManager?.pageSize,
      optionTernak()?.filter,
      optionTernak()?.sort,
      optionTernak()?.collection,
      'pen,pen.kandang'
    );
  };

  // Fetch Data
  useEffect(() => {
    const fetchTernakKandang = async () => {
      const updatedData = await Promise.all(
        dataKandang.map(async (prev, index) => {
          let betina, jantan, jumlahTernak;
          try {
            const resJantan = await getTernak(
              1,
              5,
              `pen.kandang.peternakan = "${user.id}" && pen.kandang.id = "${prev.id}" && jenisKelamin = "Jantan"`,
              '-created',
              'ternak'
            );
            const resBetina = await getTernak(
              1,
              5,
              `pen.kandang.peternakan = "${user.id}" && pen.kandang.id = "${prev.id}" && jenisKelamin = "Betina"`,
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
      setTableDataGrid(updatedData);
      setTotalGrid(totalKandang);
    };

    const fetchTernakPen = async () => {
      const updatedData = await Promise.all(
        dataPen.map(async (prev, index) => {
          let betina, jantan, jumlahTernakPen;
          try {
            const resJantan = await getTernak(
              1,
              5,
              `pen.kandang.peternakan = "${user.id}" && pen.id = "${prev.id}" && jenisKelamin = "Jantan"`,
              '-created',
              'ternak'
            );
            const resBetina = await getTernak(
              1,
              5,
              `pen.kandang.peternakan = "${user.id}" && pen.kandang.id = "${prev.id}" && jenisKelamin = "Betina"`,
              '-created',
              'ternak'
            );
            jantan = resJantan?.totalItems;
            betina = resBetina?.totalItems;
            jumlahTernakPen = jantan + betina;
          } catch (error) {
            console.error('Error fetching ternak data:', error);
            jantan = 0;
            betina = 0;
            jumlahTernakPen = 0;
          }

          return {
            ...prev,
            no: dataGridTable?.page * dataGridTable?.pageSize + index + 1,
            jumlahTernakPen,
            betina,
            jantan,
          };
        })
      );

      setTableDataGrid(updatedData);
      setTotalGrid(totalPen);
    };

    if (penGrid?.id) {
      fetchTernakPen();
    } else {
      fetchTernakKandang();
    }
  }, [dataKandang, dataPen]);

  useEffect(() => {
    if (ternakGrid?.id) {
      setTableDataGrid(
        dataTernak.map((item, index) => ({
          ...item,
          no: dataGridTable?.page * dataGridTable?.pageSize + index + 1,
        }))
      );
      setTotalGrid(totalTernak);
    }
  }, [dataTernak]);

  // Fetch Filtered Data
  useEffect(() => {
    if (view === 'list') {
      setDataGridTable({ ...dataGridTable, page: 0 });

      getKandang(1, dataGridTable?.rowsPerPage, options()?.filter, options()?.sort, 'kandang');
    } else {
      setDataGridManager({ ...dataGridManager, page: 0 });

      getKandang(1, dataGridManager?.pageSize, options()?.filter, options()?.sort, 'kandang');
    }
  }, [dataGridTable?.filter, debouncedSearch]);

  useEffect(() => {
    getKandang(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      options()?.filter,
      options()?.sort,
      'kandang'
    );
  }, [dataGridTable?.page, dataGridTable?.pageSize, dataGridTable?.order, dataGridTable?.orderBy]);

  useEffect(() => {
    if (ternakGrid?.id) {
      getTernak(
        dataGridManager?.page + 1,
        dataGridManager?.pageSize,
        optionTernak()?.filter,
        optionTernak()?.sort,
        optionTernak()?.collection,
        'pen,pen.kandang'
      );
    } else if (penGrid?.id) {
      getPen(
        dataGridManager?.page + 1,
        dataGridManager?.pageSize,
        optionPen()?.filter,
        optionPen()?.sort,
        optionPen()?.collection
      );
    } else {
      getKandang(
        dataGridManager?.page + 1,
        dataGridManager?.pageSize,
        options()?.filter,
        options()?.sort,
        'kandang'
      );
    }
  }, [
    dataGridManager?.page,
    dataGridManager?.pageSize,
    dataGridManager?.order,
    dataGridManager?.orderBy,
    penGrid,
    ternakGrid,
  ]);

  const handleMoveTernak = async () => {
    setLoadingMove(true);
    await Promise.all(
      table.selected.map(async (item, index) => {
        try {
          await updateTernak(
            item.id,
            {
              pen: ternakGrid.id,
            },
            'ternak'
          );

          await createLaluLintas(
            {
              ternak: item.id,
              asalKandang: item.expand.pen.expand.kandang.id,
              tujuanKandang: penGrid.id,
              asalPen: item.expand.pen.id,
              tujuanPen: ternakGrid.id,
            },
            'laluLintasTernak'
          );
        } catch (error) {
          console.error('Error update ternak data:', error);
        }
      })
    );
    table.setSelected([]);
    setLoadingMove(false);
    confirm.onFalse();
    refetchTernak();
    enqueueSnackbar('Move Success', { variant: 'success' });
  };

  const openConfirm = () => {
    if (!ternakGrid?.id) {
      enqueueSnackbar('Cannot Move Here', { variant: 'error' });
    } else {
      confirm.onTrue();
    }
  };

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
                Data Kandang
              </Typography>

              <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
                <ToggleButton value="list">
                  <Iconify icon="solar:list-bold" />
                </ToggleButton>

                <ToggleButton value="grid">
                  <Iconify icon="mingcute:dot-grid-fill" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {view === 'list' && (
              <DataGridAnitime
                data={tableData}
                columns={columns}
                table={dataGridTable}
                totalData={totalKandang}
                loading={loadingKandang}
                onDataGridChange={onDataGridChange}
                disableRowSelectionOnClick
                disableColumnMenu
                disableMultipleRowSelection
              />
            )}

            {view === 'grid' && (
              <Box sx={{ my: 2 }}>
                <Box>
                  <Stack sx={{ mx: 3 }}>
                    <Breadcrumbs>
                      <Typography
                        sx={{
                          color: !penGrid?.id && !ternakGrid.id ? 'text.primary' : 'text.disabled',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setPenGrid({});
                          setTernakGrid({});
                          resetPage();
                        }}
                      >
                        Home
                      </Typography>

                      {penGrid?.namaKandang && (
                        <Typography
                          sx={{
                            color: penGrid?.id && !ternakGrid.id ? 'text.primary' : 'text.disabled',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setTernakGrid({});
                            resetPage();
                          }}
                        >
                          {penGrid?.namaKandang}
                        </Typography>
                      )}

                      {ternakGrid?.id && (
                        <Typography
                          sx={{
                            color: ternakGrid.id ? 'text.primary' : 'text.disabled',
                            cursor: 'pointer',
                          }}
                        >
                          {ternakGrid?.namaPen}
                        </Typography>
                      )}
                    </Breadcrumbs>
                  </Stack>
                  <KandangTableToolbar filters={searchData} setFilters={setSearchData} />

                  <Box sx={{ mx: 3 }}>
                    <KandangGridView
                      table={table}
                      dataFiltered={tableDataGrid}
                      resetPage={resetPage}
                      onOpenConfirm={() => openConfirm()}
                      setPenGrid={setPenGrid}
                      setTernakGrid={setTernakGrid}
                    />
                  </Box>

                  <TablePaginationCustom
                    count={totalGrid}
                    page={dataGridManager?.page}
                    rowsPerPage={dataGridManager?.pageSize}
                    onPageChange={onChangePage}
                    onRowsPerPageChange={onChangeRowsPerPage}
                  />
                </Box>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Pindah Ternak"
        content={
          <>
            Apakah Anda yakin ingin memindahkan <strong> {table.selected.length} </strong> ternak?
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={loadingMove}
            onClick={() => {
              handleMoveTernak();
            }}
          >
            Pindahkan
          </LoadingButton>
        }
      />
    </Container>
  );
}
