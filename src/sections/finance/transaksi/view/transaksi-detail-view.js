'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useMemo } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _userList } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';

import {
  Autocomplete,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box, useTheme } from '@mui/system';
import FormProvider from 'src/components/hook-form/form-provider';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateData, useGetData, useGetFulLData, useGetOneData } from 'src/api/custom-api';
import { RHFRadioGroup, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { RHFFormattedTextField } from 'src/components/hook-form/rhf-text-field';
import { LoadingButton } from '@mui/lab';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuthContext } from 'src/auth/hooks';
import TableHeadAnitimeCustom from 'src/components/tableAnitimeCustom/table-head';
import TransaksiDetailTableRow from '../transaksi-detail-table-row';
import JenisPakanTableRow from '../jenis-pakan-table-row';
import { FormatRupiah } from '@arismun/format-rupiah';
import GenerateDeliveryOrder from 'src/components/modal/finance/generate-delivery-order';
import useGetOne from 'src/api/wholesaler/getOne';
import DeliveryOrderDetail from 'src/components/deliveryOrderDetail';
import './style.css';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TABLE_HEAD_TERNAK = [
  { id: 'RFID', label: 'RFID' },
  { id: 'jenisTernak', label: 'Jenis Ternak' },
  { id: 'kandang', label: 'Kandang' },
  { id: 'berat', label: 'Berat' },
  { id: 'harga', label: 'Harga' },
];
const TABLE_HEAD_PAKAN = [
  { id: 'name', label: 'Jenis Pakan' },
  { id: 'jumlah', label: 'Jumlah' },
];

export default function TransaksiDetailView({ id }) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const settings = useSettingsContext();
  const user = useAuthContext();
  const router = useRouter();

  // const { data: dataPemasukan, error, loading, getOneData } = useGetOneData();

  const { data: dataJenisPemasukan, getFullData: getJenisPemasukan } = useGetFulLData();
  const { data: dataJenisPengeluaran, getFullData: getJenisPengeluaran } = useGetFulLData();
  const { data: dataSatuan, getFullData: getSatuan } = useGetFulLData();
  const { data: dataJenisPakan, getFullData: getJenisPakan } = useGetFulLData();
  const { data: dataTernak, loading: loadingTernak, getData: getTernak } = useGetData();
  const { createData: createPemasukan } = useCreateData();
  const { createData: createPengeluaran } = useCreateData();

  const [dataTernakList, setDataTernakList] = useState([]);
  const [kategori, setKategori] = useState('pemasukan');
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [searchOption, setSearchOption] = useState([]);

  const openModal = useBoolean();

  const [selectedData, setSelectedData] = useState(null);
  const [type, setType] = useState(null);

  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search);

  const adminToken = sessionStorage.getItem('adminToken');

  const {
    data: dataPemasukan,
    loading,
    refetch,
  } = useGetOne('pemasukan', id, {
    expand:
      'pembelianTernak.ternak.kandang, pembelianTernak , pembelianTernak.ternak , pembelianTernak.wholesaler , pembelianTernak.peternakan, deliveryOrder',
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const currentDataPemasukan = useMemo(() => {
    if (!dataPemasukan) return null;
    const inv = {
      invoiceNumber: dataPemasukan?.id || id,
      invoiceFrom: dataPemasukan?.expand?.pembelianTernak?.expand?.wholesaler,
      invoiceTo: dataPemasukan?.expand?.pembelianTernak?.expand?.peternakan,
      items: dataPemasukan?.expand?.pembelianTernak?.expand?.ternak,
      createdAt: dataPemasukan?.created,
      data: dataPemasukan,
      pembelian: dataPemasukan?.expand?.pembelianTernak,
      deliveryOrder: dataPemasukan?.expand?.deliveryOrder,
    };

    return inv;
  }, [dataPemasukan]);

  const options =
    kategori === 'pemasukan'
      ? dataJenisPemasukan
      : kategori === 'pengeluaran'
        ? dataJenisPengeluaran
        : [];

  const schema = Yup.object().shape({
    tipe: Yup.string().required(`Tipe ${kategori} wajib diisi`),
    jumlah: Yup.number()
      .required(`Jumlah ${kategori} wajib diisi`)
      .min(1, `Jumlah ${kategori} wajib lebih dari 0`),
    nilai: Yup.number()
      .required(`Nilai ${kategori} wajib diisi`)
      .min(1, `Nilai ${kategori} wajib lebih dari 0`),
    satuan: Yup.string().required(`Satuan ${kategori} wajib pilih salah 1`),
    // satuanLainnya: Yup.string()
    //   .when("satuan", {
    //     is: 'Lainnya',
    //     then: (schema) => schema.required('Satuan Lainnya wajib diisi'),
    //   })
  });

  const defaultValues = {
    tipe: dataPemasukan?.jenisPemasukan || '',
    jumlah: dataPemasukan?.jumlahPemasukan || 0,
    nilai: dataPemasukan?.nilaiPemasukan || 0,
    satuan: dataPemasukan?.satuanPemasukan || '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
    watch,
  } = methods;

  const watchTipe = dataPemasukan?.jenisPemasukan || 'Penjualan Ternak';

  useEffect(() => {
    getJenisPemasukan('listJenisPemasukan');
    getJenisPengeluaran('listJenisPengeluaran');
    getSatuan('listSatuan');
    getJenisPakan('listJenisPakan');
    getTernak(
      1,
      5,
      `RFID~"${search}" && peternakan = "${user.user.createdBy}"`,
      '-created',
      'ternak',
      'kandang'
    );
  }, []);

  useEffect(() => {
    toggleAdditionalForm();
  }, [watchTipe]);

  useEffect(() => {
    if (watchTipe === 'Penjualan Ternak') {
      getTernak(
        1,
        5,
        `RFID~"${search}" && peternakan = "${user.user.createdBy}"`,
        '-created',
        'ternak',
        'kandang'
      );
    }
  }, [searchDebounce]);

  useEffect(() => {
    if (watchTipe === 'Penjualan Ternak') {
      const updatedData = dataTernak.map((item) => {
        return item.RFID;
      });
      setSearchOption(updatedData);
    }
  }, [dataTernak]);

  const toggleAdditionalForm = () => {
    if (watchTipe === 'Penjualan Ternak') {
      setShowAdditionalForm(true);
      const updatedData = dataTernak.map((item) => {
        return item.RFID;
      });
      setSearchOption(updatedData);
      setDataTernakList([]);
    } else if (watchTipe === 'Penjualan Pakan' || watchTipe === 'Pembelian Pakan') {
      setShowAdditionalForm(true);
      const updatedData = dataJenisPakan.map((item) => {
        return item.name;
      });
      setSearchOption(updatedData);
    } else {
      setShowAdditionalForm(false);
      setDataTernakList([]);
    }
  };

  const handleChangeSelect = (value) => {
    if (value) {
      if (watchTipe === 'Penjualan Ternak') {
        const isExist = dataTernakList.find((e) => e.RFID === value);

        if (!isExist) {
          const findData = dataTernak.find((e) => e.RFID === value);
          const updatedData = {
            ...findData,
            harga: 0,
          };
          setDataTernakList([...dataTernakList, updatedData]);
        }
      } else if (watchTipe === 'Penjualan Pakan' || watchTipe === 'Pembelian Pakan') {
        console.log('this run');
        const isExist = dataTernakList.find((e) => e.name === value);

        if (!isExist) {
          const updatedData = {
            name: value,
            harga: 0,
          };
          setDataTernakList([...dataTernakList, updatedData]);
        }
      }
    }
  };

  const handleChangeHarga = (identifier, value) => {
    let index;

    if (watchTipe === 'Penjualan Ternak') {
      index = dataTernakList.findIndex((e) => e.RFID === identifier);
    } else if (watchTipe === 'Penjualan Pakan' || watchTipe === 'Pembelian Pakan') {
      index = dataTernakList.findIndex((e) => e.name === identifier);
    }

    if (index !== -1) {
      const updatedDataTernakList = [...dataTernakList];
      updatedDataTernakList[index] = {
        ...updatedDataTernakList[index],
        harga: value,
      };

      setDataTernakList(updatedDataTernakList);
    }
  };

  const handleDelete = (identifier) => {
    let findData;

    if (watchTipe === 'Penjualan Ternak') {
      findData = dataTernakList.findIndex((e) => e.RFID === identifier);
    } else if (watchTipe === 'Penjualan Pakan' || watchTipe === 'Pembelian Pakan') {
      findData = dataTernakList.findIndex((e) => e.name === identifier);
    }

    if (findData !== -1) {
      const updatedData = [...dataTernakList];
      updatedData.splice(findData, 1);
      setDataTernakList(updatedData);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (
      watchTipe === 'Penjualan Ternak' ||
      watchTipe === 'Penjualan Pakan' ||
      watchTipe === 'Pembelian Pakan'
    ) {
      if (dataTernakList.length === 0) {
        alert('Minimal harus ada 1 item !');
        return;
      }
    }

    const detailPemasukan =
      watchTipe === 'Penjualan Ternak'
        ? dataTernakList.map((item) => {
            return {
              RFID: item.RFID,
              harga: item.harga,
            };
          })
        : dataTernakList.map((item) => {
            return {
              jenisPakan: item.name,
              jumlah: item.harga,
            };
          });

    if (kategori === 'pemasukan') {
      try {
        const body = {
          jenisPemasukan: data.tipe,
          jumlahPemasukan: data.jumlah,
          nilaiPemasukan: data.nilai,
          satuanPemasukan: data.satuan === 'Lainnya' ? data.satuanLainnya : data.satuan,
          tanggal: new Date(),
          detailPemasukan: detailPemasukan.length > 0 ? detailPemasukan : null,
          peternakan: user.user.createdBy,
        };
        const responseData = await createPemasukan(body, 'pemasukan');
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      } finally {
        reset(defaultValues);
        router.push(paths.finance.transaksi.root);
      }
    } else {
      try {
        const body = {
          jenisPengeluaran: data.tipe,
          jumlahPengeluaran: data.jumlah,
          nilaiPengeluaran: data.nilai,
          satuanPengeluaran: data.satuan === 'Lainnya' ? data.satuanLainnya : data.satuan,
          tanggal: new Date(),
          detailPengeluaran: detailPemasukan.length > 0 ? detailPemasukan : null,
          peternakan: user.user.createdBy,
        };
        const responseData = await createPengeluaran(body, 'pengeluaran');
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      } finally {
        reset();
        router.push(paths.finance.transaksi.root);
      }
    }
  });

  const getStyles = () => {
    // Collect stylesheets from the original document
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch (e) {
          console.warn('Could not access cssRules from a stylesheet', e);
          return '';
        }
      })
      .join('\n');

    return `<style>${styles}</style>`;
  };

  const printDiv = (divId) => {
    console.log(divId);
    const printContents = document.getElementById(divId).outerHTML;
    const styles = getStyles();

    const iframeElement = document.createElement('iframe');
    document.body.appendChild(iframeElement);

    const iframeDocument = iframeElement.contentDocument;
    iframeDocument.open();
    iframeDocument.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Delivery Order</title>
        ${styles}
      </head>
      <body>${printContents}</body>
    </html>
  `);
    iframeDocument.close();

    iframeElement.contentWindow.print();

    document.body.removeChild(iframeElement);
  };

  const refetchData = () => {
    refetch('pemasukan', id, {
      expand:
        'pembelianTernak.ternak.kandang, pembelianTernak , pembelianTernak.ternak , pembelianTernak.wholesaler , pembelianTernak.peternakan, deliveryOrder',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  };

  const dataDetail =
    dataPemasukan?.expand?.pembelianTernak?.expand?.ternak || dataPemasukan?.detailPemasukan;

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h4" mb={3}>
                    Detail Pemasukan
                  </Typography>

                  {!dataPemasukan?.deliveryOrder && dataPemasukan?.pembelianTernak && (
                    <Button onClick={() => openModal.onTrue()} color="primary" variant="contained">
                      Generate Delivery Order
                    </Button>
                  )}
                </Stack>
                <Grid container spacing={3}>
                  <Grid item xs={6} mt={2} spacing={2}>
                    <Stack spacing={1}>
                      <Typography>{`Jumlah Pemasukan : `}</Typography>
                      <Typography>{dataPemasukan?.jumlahPemasukan}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} mt={2}>
                    <Stack spacing={1}>
                      <Typography>{`Satuan Pemasukan : `}</Typography>
                      <Typography>{dataPemasukan?.satuanPemasukan}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} mt={2}>
                    <Stack spacing={1}>
                      <Typography>{`Tipe Pemasukan : `}</Typography>
                      <Typography>{dataPemasukan?.jenisPemasukan}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack spacing={1} mt={2}>
                      <Typography>{`Nilai Pemasukan : `}</Typography>
                      <FormatRupiah value={dataPemasukan?.nilaiPemasukan} />
                    </Stack>
                  </Grid>
                </Grid>

                <>
                  <Stack
                    flexDirection={'row'}
                    alignItems={'start'}
                    justifyContent={'space-between'}
                    mt={8}
                    ml={2}
                  >
                    <Typography variant="subtitle1">
                      Data {watchTipe === 'Penjualan Ternak' ? 'Ternak' : 'Pakan'}
                    </Typography>
                    {/* <Autocomplete
                        sx={{ width: { xs: 1, sm: 260 } }}
                        autoHighlight
                        popupIcon={null}
                        options={searchOption}
                        loading={loadingTernak}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search..."
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Iconify
                                    icon="eva:search-fill"
                                    sx={{ ml: 1, color: 'text.disabled' }}
                                  />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <>
                                  {loadingTernak ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        onChange={(event, newInputValue) => {
                          handleChangeSelect(newInputValue);
                        }}
                        onInputChange={(event, newValue) => {
                          setSearch(newValue);
                        }}
                      /> */}
                  </Stack>
                  <TableContainer
                    sx={{ position: 'relative', overflow: 'unset', height: 400, mt: 2 }}
                  >
                    <Table size={'medium'} sx={{ minWidth: 960 }}>
                      <TableHeadAnitimeCustom
                        headLabel={
                          watchTipe === 'Penjualan Ternak' ? TABLE_HEAD_TERNAK : TABLE_HEAD_PAKAN
                        }
                        data={dataTernakList}
                      />
                      <TableBody>
                        {watchTipe === 'Penjualan Ternak' &&
                          dataDetail?.map((row, index) => (
                            <TransaksiDetailTableRow key={index} row={row} />
                          ))}
                        {(watchTipe === 'Penjualan Pakan' || watchTipe === 'Pembelian Pakan') &&
                          dataPemasukan?.detailPemasukan?.map((row, index) => (
                            <JenisPakanTableRow
                              key={index}
                              row={row}
                              handleChangeHarga={handleChangeHarga}
                              handleDelete={handleDelete}
                            />
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              </CardContent>
            </Card>

            {dataPemasukan?.deliveryOrder && (
              <Box mt={5}>
                <DeliveryOrderDetail deliveryOrder={currentDataPemasukan} handlePrint={printDiv} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {openModal.value && (
        <GenerateDeliveryOrder
          open={openModal.value}
          onClose={openModal.onFalse}
          pembelian={dataPemasukan?.pembelianTernak}
          pemasukan={dataPemasukan?.id}
          refetch={refetchData}
          ternak={dataPemasukan?.expand?.pembelianTernak?.expand?.ternak}
          wholesaler={dataPemasukan?.expand?.pembelianTernak?.expand?.wholesaler?.id}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------
