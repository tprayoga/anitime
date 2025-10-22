import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFRadioGroup, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../scrollbar';
import { useGetJenisPemasukan } from 'src/api/finance/jenis-pemasukan';
import { useEffect, useState } from 'react';
// import { QrReader } from "react-qr-reader";
import { useGetJenisPengeluaran } from 'src/api/finance/jenis-pengeluaran';
import { useCreatePemasukan } from 'src/api/finance/pemasukan';
import { enqueueSnackbar } from 'notistack';
import { useGetSatuan } from 'src/api/finance/satuan';
import { useCreatePengeluaran } from 'src/api/finance/pengeluaran';
import { useTheme } from '@emotion/react';
import { RHFFormattedTextField } from 'src/components/hook-form/rhf-text-field';
import { useGetFulLData } from 'src/api/custom-api';
import { Scanner } from '@yudiel/react-qr-scanner';
import Iconify from 'src/components/iconify';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 800 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function AddTransaksiPendapatanModal({
  open,
  onClose,
  openPenjualanModal,
  setRefetchPemasukan,
  setRefetchPengeluaran,
  category,
  setCategory,
  openInvoiceModal,
  setScannedData,
  ...other
}) {

  const theme = useTheme();

  const { data: dataJenisPemasukan, getFullData: getJenisPemasukan } = useGetFulLData();
  const { data: dataJenisPengeluaran, getFullData: getJenisPengeluaran } = useGetFulLData();
  const { data: dataSatuan, getFullData: getSatuan } = useGetFulLData();
  const { createPemasukan } = useCreatePemasukan();
  const { createPengeluaran } = useCreatePengeluaran();

  const [openCam, setOpenCam] = useState(false);
  const [kategori, setKategori] = useState('');

  const options = kategori === 'pemasukan' ? dataJenisPemasukan : kategori === 'pengeluaran' ? dataJenisPengeluaran : [];


  const handleChangeOptions = (event) => {
    setKategori(event.target.value);
  };


  const schema = Yup.object().shape({
    tipe: Yup.string().required(`Tipe ${kategori} wajib diisi`),
    jumlah: Yup.number().required(`Jumlah ${kategori} wajib diisi`).min(1, `Jumlah ${kategori} wajib lebih dari 0`),
    nilai: Yup.number().required(`Nilai ${kategori} wajib diisi`).min(1, `Nilai ${kategori} wajib lebih dari 0`),
    satuan: Yup.string().required(`Satuan ${kategori} wajib pilih salah 1`),
    satuanLainnya: Yup.string()
      .when("satuan", {
        is: 'Lainnya',
        then: (schema) => schema.required('Satuan Lainnya wajib diisi'),
      })
  });

  const defaultValues = {
    tipe: '',
    jumlah: 0,
    nilai: 0,
    satuan: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    getValues,
  } = methods;

  useEffect(() => {
    getJenisPemasukan('listJenisPemasukan');
    getJenisPengeluaran('listJenisPengeluaran');
    getSatuan('listSatuan');
    setKategori(category)
  }, []);

  useEffect(() => {

  }, [])

  const showAdditionalForm = watch('satuan') === 'Lainnya';

  const onSubmit = handleSubmit(async (data) => {
    if (kategori === 'pemasukan') {
      try {
        const body = {
          jenisPemasukan: data.tipe,
          jumlahPemasukan: data.jumlah,
          nilaiPemasukan: data.nilai,
          satuanPemasukan: data.satuan === 'Lainnya' ? data.satuanLainnya : data.satuan,
          tanggal: new Date(),
        };
        const responseData = await createPemasukan(body);
        enqueueSnackbar('Success', { variant: 'success' });
        openPenjualanModal.onFalse();
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      } finally {
        reset();
        setRefetchPemasukan((x) => !x);
        setCategory('pemasukan')
      }
    } else {
      try {
        const body = {
          jenisPengeluaran: data.tipe,
          jumlahPengeluaran: data.jumlah,
          nilaiPengeluaran: data.nilai,
          satuanPengeluaran: data.satuan === 'Lainnya' ? data.satuanLainnya : data.satuan,
          tanggal: new Date(),
        };
        const responseData = await createPengeluaran(body);
        enqueueSnackbar('Success', { variant: 'success' });
        openPenjualanModal.onFalse();
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      } finally {
        reset();
        setRefetchPengeluaran((x) => !x);
        setCategory('pengeluaran')

      }
    }
  });

  const modalHeader = (
    <Box
      sx={{
        backgroundColor: '#EAFFEA',
        borderRadius: 1,
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: '9999',
      }}
    >
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Transaksi</Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2 }}>
      <Typography variant='subtitle2' sx={{ marginLeft: 1 }}>Kategori</Typography>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'items-center'} sx={{ width: '100%' }}>

        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={kategori}
          onChange={handleChangeOptions}
          sx={{
            marginLeft: 1
          }}
        >
          <FormControlLabel value="pemasukan" control={<Radio />} label="Pemasukan" />
          <FormControlLabel value="pengeluaran" control={<Radio />} label="Pengeluaran" />
        </RadioGroup>
        <Button onClick={() => setOpenCam((e) => !e)} variant='contained' color='primary'>{`${openCam ? 'Close' : 'Scan Barcode'}`}</Button>

      </Stack>
      <RHFSelect
        name="tipe"
        label={`Tipe ${kategori}`}
        sx={{ mt: 3 }}
        InputLabelProps={{
          style: { textTransform: 'capitalize' }
        }}
      >

        {options?.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </RHFSelect>

      {/* <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} mt={2}>
        <Typography fontSize={'14px'} fontWeight={'medium'}>Data Ternak</Typography>
        <TextField
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          size='small'
        />
      </Stack>
      <Divider sx={{ my : 2 }}/>
      <Stack spacing={1}>
        <Stack>
          <Typography></Typography>
          <Typography></Typography>
          <Typography></Typography>

        </Stack>
      </Stack> */}
      <RHFTextField
        name="jumlah"
        label={`Jumlah ${kategori}`}
        type="number"
        InputLabelProps={{
          style: { textTransform: 'capitalize' }
        }}
        sx={{
          mt: 2
        }}
      />
      <Typography
        variant='subtitle2'

        sx={{
          textTransform: 'capitalize',
          mt: 2,
          ml: 1
        }}
      >
        Satuan {kategori}
      </Typography>
      <RHFRadioGroup
        row
        name="satuan"
        options={[
          { label: 'Ekor', value: 'Ekor' },
          { label: 'Liter', value: 'Liter' },
          { label: 'Pcs', value: 'Pcs' },
          { label: 'Kg', value: 'Kg' },
          { label: 'Lainnya', value: 'Lainnya' },
        ]}
        sx={{
          marginLeft: 1
        }}
      />
      {showAdditionalForm &&
        <RHFTextField
          name="satuanLainnya"
          label={`Satuan ${kategori}`}
          InputLabelProps={{
            style: { textTransform: 'capitalize' }
          }}
          sx={{
            mt: 2
          }}
        />
      }
      
      <RHFFormattedTextField
        name="nilai"
        label={`Nilai ${kategori}`}
        sx={{ mt: 3, width: '100%' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              Rp.
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { textTransform: 'capitalize' }
        }}
      />

      {openCam &&
        <>
          <Scanner
            onResult={async (text, result) => {
              setScannedData(result);
              onClose();
              openInvoiceModal.onTrue();
            }}
            onError={(error) => console.log(error?.message)}
          />

        </>
      }
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: (theme) => theme.palette.text.disabled,
        }}
        onClick={onClose}
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
    </Box>
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Scrollbar sx={{ maxHeight: '80vh' }}>
            {modalHeader}
            <FormProvider methods={methods} onSubmit={onSubmit}>
              {modalBody}
              {modalFooter}
            </FormProvider>
          </Scrollbar>
        </Box>
      </Modal>
    </>
  );
}
