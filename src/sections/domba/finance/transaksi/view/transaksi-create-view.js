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
import { useCreateData, useGetData, useGetFulLData } from 'src/api/custom-domba-api';
import { RHFRadioGroup, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { RHFFormattedTextField } from 'src/components/hook-form/rhf-text-field';
import { LoadingButton } from '@mui/lab';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuthContext } from 'src/auth/hooks';
import TableHeadAnitimeCustom from 'src/components/tableAnitimeCustom/table-head';
import TernakTableRow from '../ternak-table-row';
import JenisPakanTableRow from '../jenis-pakan-table-row';
import { useGetUser } from 'src/api/domba/manage-user';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TABLE_HEAD_TERNAK = [
  { id: 'noFID', label: 'noFID', disabled: true },
  { id: 'jenisTernak', label: 'Jenis Ternak', disabled: true },
  { id: 'kandang', label: 'Kandang', disabled: true },
  { id: 'berat', label: 'Berat', disabled: true },
  { id: 'harga', label: 'Harga', disabled: true },
  { disabled: true },
];
const TABLE_HEAD_PAKAN = [
  { id: 'name', label: 'Jenis Pakan', disabled: true },
  { id: 'jumlah', label: 'Jumlah', disabled: true },
  { disabled: true },
];

export default function TransaksiCreateView() {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const settings = useSettingsContext();
  const user = useAuthContext();
  const router = useRouter();

  const { data: dataJenisPemasukan, getFullData: getJenisPemasukan } = useGetFulLData();
  const { data: dataJenisPengeluaran, getFullData: getJenisPengeluaran } = useGetFulLData();
  const { data: dataSatuan, getFullData: getSatuan } = useGetFulLData();
  const { data: dataJenisPakan, getFullData: getJenisPakan } = useGetFulLData();
  const { data: dataTernak, loading: loadingTernak, getData: getTernak } = useGetData();
  // const { data: dataPlasma, loading: loadingPlasma, getData: getPlasma } = useGetData();
  const { data: dataPlasma, loading: loadingPlasma, getUser: getPlasma } = useGetUser();

  const { createData: createPemasukan } = useCreateData();
  const { createData: createPengeluaran } = useCreateData();

  const [dataTernakList, setDataTernakList] = useState([]);
  const [kategori, setKategori] = useState('pemasukan');
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [searchOption, setSearchOption] = useState([]);
  const [plasmaTrue, setPlasmaTrue] = useState(false);

  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search);

  const adminToken = sessionStorage.getItem('adminToken');

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
    plasma: plasmaTrue ? Yup.string().required(`Plasma ${kategori} wajib diisi`) : Yup.string(),
  });

  const defaultValues = {
    tipe: '',
    jumlah: 0,
    nilai: 0,
    satuan: '',
    plasma: '',
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

  const watchTipe = watch('tipe');

  useEffect(() => {
    getJenisPemasukan('listJenisPemasukan');
    getJenisPengeluaran('listJenisPengeluaran');
    getSatuan('listSatuan');
    getJenisPakan('registrasiPakan');
    getTernak(
      1,
      5,
      `noFID~"${search}" && pen.kandang.peternakan = "${user.user.createdBy}"`,
      '-created',
      'ternak',
      'kandang'
    );
    getPlasma(1, 5, `role = "peternakan"`, '-created', adminToken);
  }, []);

  useEffect(() => {
    toggleAdditionalForm();
  }, [watchTipe]);

  useEffect(() => {
    if (watchTipe === 'Penjualan Ternak' || watchTipe === 'Pembelian Ternak') {
      getTernak(
        1,
        5,
        `noFID~"${search}" && pen.kandang.peternakan = "${user.user.createdBy}"`,
        '-created',
        'ternak',
        'kandang'
      );
    }
  }, [searchDebounce]);

  useEffect(() => {
    if (watchTipe === 'Penjualan Ternak' || watchTipe === 'Pembelian Ternak') {
      const updatedData = dataTernak.map((item) => {
        return item.noFID;
      });
      setSearchOption(updatedData);
    }
  }, [dataTernak]);

  useEffect(() => {
    if (
      watchTipe === 'Penjualan Ternak' ||
      watchTipe === 'Pembelian Ternak' ||
      watchTipe === 'Penjualan Pakan'
    ) {
      setPlasmaTrue(true);
    } else {
      setPlasmaTrue(false);
    }
  }, [watchTipe]);

  const toggleAdditionalForm = () => {
    if (watchTipe === 'Penjualan Ternak' || watchTipe === 'Pembelian Ternak') {
      setShowAdditionalForm(true);
      const updatedData = dataTernak.map((item) => {
        return item.noFID;
      });
      setSearchOption(updatedData);
      setDataTernakList([]);
    } else if (watchTipe === 'Penjualan Pakan') {
      setShowAdditionalForm(true);
      const updatedData = dataJenisPakan.map((item) => {
        return item.nama;
      });
      setSearchOption(updatedData);
    } else {
      setShowAdditionalForm(false);
      setDataTernakList([]);
    }
  };

  const handleChangeSelect = (value) => {
    if (value) {
      if (watchTipe === 'Penjualan Ternak' || watchTipe === 'Pembelian Ternak') {
        const isExist = dataTernakList.find((e) => e.noFID === value);

        if (!isExist) {
          const findData = dataTernak.find((e) => e.noFID === value);
          const updatedData = {
            ...findData,
            harga: 0,
          };
          setDataTernakList([...dataTernakList, updatedData]);
        }
      } else if (watchTipe === 'Penjualan Pakan') {
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

    if (watchTipe === 'Penjualan Ternak' || watchTipe === 'Pembelian Ternak') {
      index = dataTernakList.findIndex((e) => e.noFID === identifier);
    } else if (watchTipe === 'Penjualan Pakan') {
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

    if (watchTipe === 'Penjualan Ternak' || watchTipe === 'Pembelian Ternak') {
      findData = dataTernakList.findIndex((e) => e.noFID === identifier);
    } else if (watchTipe === 'Penjualan Pakan') {
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
      watchTipe === 'Pembelian Ternak'
    ) {
      if (dataTernakList.length === 0) {
        alert('Minimal harus ada 1 item !');
        return;
      }
    }

    const detailPemasukan =
      watchTipe === 'Penjualan Ternak' || watchTipe === 'Pembelian Ternak'
        ? dataTernakList.map((item) => {
            return {
              noFID: item.noFID,
              kandang: item.kandang,
              jenisTernak: item.jenisTernak,
              berat: item.berat,
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
          plasma: data.plasma,
        };
        const responseData = await createPemasukan(body, 'pemasukan');
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      } finally {
        reset(defaultValues);
        router.push(paths.dombaIntiFinance.transaksi.root);
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
          plasma: data.plasma,
        };
        const responseData = await createPengeluaran(body, 'pengeluaran');
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      } finally {
        reset();
        router.push(paths.dombaIntiFinance.transaksi.root);
      }
    }
  });

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <Typography variant="subtitle2" ml={1}>
                    Kategori
                  </Typography>
                  <Stack
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    alignItems={'items-center'}
                    sx={{ width: '100%' }}
                  >
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={kategori}
                      onChange={(e) => {
                        setKategori(e.target.value);
                        reset();
                        setDataTernakList([]);
                      }}
                      sx={{
                        ml: 2,
                        mt: 1,
                      }}
                    >
                      <FormControlLabel value="pemasukan" control={<Radio />} label="Pemasukan" />
                      <FormControlLabel
                        value="pengeluaran"
                        control={<Radio />}
                        label="Pengeluaran"
                      />
                    </RadioGroup>
                  </Stack>
                  <Grid container spacing={3}>
                    <Grid item xs={6} mt={2}>
                      <RHFSelect
                        name="tipe"
                        label={`Tipe ${kategori}`}
                        InputLabelProps={{
                          style: { textTransform: 'capitalize' },
                        }}
                      >
                        {options?.map((option) => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </Grid>
                    <Grid item xs={6} mt={2}>
                      <RHFFormattedTextField
                        name="nilai"
                        label={`Nilai ${kategori}`}
                        sx={{ width: '100%' }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                        }}
                        InputLabelProps={{
                          style: { textTransform: 'capitalize' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <RHFTextField
                        name="jumlah"
                        label={`Jumlah ${kategori}`}
                        type="number"
                        InputLabelProps={{
                          style: { textTransform: 'capitalize' },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <RHFSelect
                        name="satuan"
                        label={`Satuan ${kategori}`}
                        InputLabelProps={{
                          style: { textTransform: 'capitalize' },
                        }}
                      >
                        {dataSatuan?.map((option) => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                    </Grid>
                    {(watchTipe === 'Penjualan Ternak' ||
                      watchTipe === 'Pembelian Ternak' ||
                      watchTipe === 'Penjualan Pakan') && (
                      <Grid item xs={6}>
                        <RHFSelect
                          name="plasma"
                          label={`Plasma`}
                          InputLabelProps={{
                            style: { textTransform: 'capitalize' },
                          }}
                        >
                          {dataPlasma?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                      </Grid>
                    )}
                  </Grid>
                  {showAdditionalForm && (
                    <>
                      <Stack
                        flexDirection={'row'}
                        alignItems={'start'}
                        justifyContent={'space-between'}
                        mt={4}
                        ml={2}
                      >
                        <Typography variant="subtitle1">
                          Data{' '}
                          {watchTipe === 'Penjualan Ternak' || watchTipe === 'Pembelian Ternak'
                            ? 'Ternak'
                            : 'Pakan'}
                        </Typography>
                        <Autocomplete
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
                        />
                      </Stack>
                      <TableContainer
                        sx={{ position: 'relative', overflow: 'unset', height: 400, mt: 1 }}
                      >
                        <Table size={'medium'} sx={{ minWidth: 960 }}>
                          <TableHeadAnitimeCustom
                            headLabel={
                              watchTipe === 'Penjualan Ternak' || watchTipe === 'Pembelian Ternak'
                                ? TABLE_HEAD_TERNAK
                                : TABLE_HEAD_PAKAN
                            }
                            data={dataTernakList}
                          />
                          <TableBody>
                            {(watchTipe === 'Penjualan Ternak' ||
                              watchTipe === 'Pembelian Ternak') &&
                              dataTernakList?.map((row, index) => (
                                <TernakTableRow
                                  key={index}
                                  row={row}
                                  handleChangeHarga={handleChangeHarga}
                                  handleDelete={handleDelete}
                                />
                              ))}
                            {watchTipe === 'Penjualan Pakan' &&
                              dataTernakList?.map((row, index) => (
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
                  )}
                  <Stack
                    flexDirection={'row'}
                    justifyContent={'end'}
                    alignItems={'center'}
                    spacing={1}
                    mt={5}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: (theme) => theme.palette.text.disabled,
                      }}
                      // onClick={onClose}
                    >
                      Batal
                    </Button>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      loading={isSubmitting}
                      type="submit"
                      size="large"
                    >
                      + Tambah
                    </LoadingButton>
                  </Stack>
                </FormProvider>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
