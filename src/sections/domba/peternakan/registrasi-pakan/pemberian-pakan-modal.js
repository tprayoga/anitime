import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack, darken, lighten, styled } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, {
  RHFAutocomplete,
  RHFCheckbox,
  RHFMultiCheckbox,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useCreateData, useGetFulLData, useUpdateData } from 'src/api/custom-domba-api';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import Scrollbar from 'src/components/scrollbar';
import { RHFDateTimePicker } from 'src/components/hook-form/rhf-datepicker';
import { RHFAutocompleteCustom } from 'src/components/hook-form/rhf-autocomplete';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 800 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

const DATA_PETUGAS = [
  { label: 'Petugas 1', value: 'Petugas 1' },
  { label: 'Petugas 3', value: 'Petugas 2' },
  { label: 'Petugas 2', value: 'Petugas 3' },
];

export default function PemberianPakanModal({
  open,
  onClose,
  dataTernak,
  refetch,
  dataPemberianPakan,
  type,
  ...other
}) {
  const { user } = useAuthContext();

  const { data: dataRegPakan, error, loading, getFullData: getRegPakan } = useGetFulLData();
  const { data: dataKandang, getFullData: getKandang } = useGetFulLData();

  const {
    createData: createRegistrasiPakan,
    error: errorCreateData,
    loading: loadingCreateData,
  } = useCreateData();

  const {
    updateData: updateRegistrasiPakan,
    error: errorUpdateData,
    loading: loadingUpdateData,
  } = useUpdateData();

  // const [selectedValue, setSelectedValue] = useState('');
  const [search, setSearch] = useState('');
  const [listTipePakan, setListTipePakan] = useState([]);
  const [isOnMounted, setIsOnMounted] = useState(false);
  const [penOptions, setPenOptions] = useState([]);

  const schema = Yup.object().shape({
    petugas: Yup.string().required('Petugas Wajib Diisi'),
    kandang: Yup.string().required('Kandang Wajib Diisi'),
    pen: Yup.mixed().required('Kandang Wajib Diisi'),
    tanggal: Yup.date().required('Tanggal Wajib Diisi'),
  });

  const defaultValues = {
    petugas: '',
    kandang: '',
    pen: [],
    tanggal: undefined,
    skills: [],
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = methods;

  const skills = watch('skills');
  // console.log(watch('pen'));

  const onSearch = (value) => {
    setSearch(value);
  };

  const handleAddButton = (selectedValue) => {
    if (selectedValue) {
      const findData = listTipePakan.findIndex((e) => e.nama === selectedValue.nama);

      if (findData === -1) {
        const data = {
          id: selectedValue.id,
          nama: selectedValue.nama,
          jumlah: 0,
        };
        setListTipePakan([...listTipePakan, data]);
      }
    }
  };

  const handleDeleteList = (selectedValue) => {
    const findData = listTipePakan.findIndex((e) => e.nama === selectedValue.nama);

    if (findData !== -1) {
      const updatedData = [...listTipePakan];

      updatedData.splice(findData, 1);

      setListTipePakan(updatedData);
      setValue('skills', updatedData);
    }
  };

  const handleChangeQty = (selectedValue, value) => {
    const findData = listTipePakan.findIndex((e) => e.nama === selectedValue.nama);
    if (findData !== -1) {
      const updatedListTipePakan = [...listTipePakan];
      updatedListTipePakan[findData] = {
        ...updatedListTipePakan[findData],
        jumlah: value,
      };
      setListTipePakan(updatedListTipePakan);
    }
  };

  useEffect(() => {
    getRegPakan('registrasiPakan');
    getKandang('kandang', 'pen', `peternakan = "${user.id}"`);
  }, []);

  useEffect(() => {
    if (type === 'EDIT') {
      reset({
        jumlahPakanKonsentrat: dataPemberianPakan?.jumlahPakanKonsentrat,
        jumlahPemberianAir: dataPemberianPakan?.jumlahPemberianAir,
        skills: dataPemberianPakan?.tipePakan.map((data) => {
          return data.jenisPakan;
        }),
      });
      setListTipePakan(dataPemberianPakan?.tipePakan);
    }
  }, [type]);

  useEffect(() => {
    if (watch('kandang')) {
      const selectedKandang = dataKandang?.find((e) => e.id === watch('kandang'));
      setPenOptions(selectedKandang?.expand?.pen || []);
    }
  }, [watch('kandang')]);

  const onSubmit = handleSubmit(async (data) => {
    const body = {
      ...data,
      jenisPakan: listTipePakan,
      bobotPakan: listTipePakan.reduce((acc, item) => acc + parseFloat(item.jumlah), 0),
      given: false,
      pen: data.pen.map((e) => e.id),
    };

    if (listTipePakan.length === 0) {
      alert('Minimal harus ada 1 item !');
      return;
    }

    if (type === 'CREATE') {
      try {
        await createRegistrasiPakan(body, 'pemberianPakan');
        enqueueSnackbar('Success', { variant: 'success' });

        reset();
        onClose();
        refetch();
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      try {
        await updateRegistrasiPakan(dataPemberianPakan.id, updatedData, 'pemberianPakanTernak');
        enqueueSnackbar('Success', { variant: 'success' });
        reset();
        onClose();
        refetch();
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
        console.log(error);
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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Pemberian Pakan</Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2 }}>
      <Stack flexDirection={'column'} spacing={3}>
        <RHFSelect name="petugas" label="Petugas">
          {DATA_PETUGAS?.map((option, index) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFSelect name="kandang" label="Kandang">
          {dataKandang?.map((option, index) => (
            <MenuItem value={option.id} key={option.namaKandang}>
              {option.namaKandang}
            </MenuItem>
          ))}
        </RHFSelect>
        {/* <RHFSelect name="pen" label="Pen">
          {penOptions?.map((options) => (
            <MenuItem value={options.id} key={options.id}>
              {options.namaPen}
            </MenuItem>
          ))}
        </RHFSelect> */}
        <RHFAutocompleteCustom
          name="pen"
          label="Pen"
          options={penOptions}
          sx={{
            mt: 1,
          }}
          multiple
          onSearch={onSearch}
          getOptionLabel={(option) => option.namaPen}
          renderOption={(props, option) => (
            <li {...props} key={option.namaPen}>
              {option.namaPen}
            </li>
          )}
          renderTags={(selected) =>
            selected.map((option, index) => (
              <Chip
                sx={{ ml: 1 }}
                key={option.namaPen}
                label={option.namaPen}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
        <RHFDateTimePicker name="tanggal" label="Jam & Waktu" />
        <RHFAutocomplete
          name="skills"
          placeholder="+ Jenis Pakan"
          multiple
          options={dataRegPakan}
          getOptionLabel={(option) => option.nama}
          renderTags={(selected) =>
            selected.map((option, index) => (
              <Chip
                sx={{ ml: 1 }}
                key={index}
                label={option.nama}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
          onChange={(event, newValue) => {
            setValue('skills', newValue);
            const newestValue = newValue[newValue.length - 1];
            handleAddButton(newestValue);
          }}
          disableClearable
        />
        <Stack spacing={2}>
          {listTipePakan?.map((data, index) => (
            <Stack flexDirection={'row'} alignItems={'center'} key={index}>
              <Stack flexDirection={'row'} sx={{ flex: 1 }} alignItems={'center'}>
                <Iconify icon="radix-icons:dot-filled" width={10} />
                <Typography variant="body2">{data?.nama}</Typography>
              </Stack>
              <Stack flexDirection={'row'} sx={{ flex: 1 }}>
                <TextField
                  id="standard-number"
                  type="number"
                  variant="standard"
                  sx={{
                    width: 40,
                    ml: 2,
                  }}
                  inputProps={{ min: 0, style: { textAlign: 'center' } }}
                  value={data.jumlah}
                  onChange={(e) => handleChangeQty(data, e.target.value)}
                />
                <Typography ml={1} variant="body2" sx={{ mt: '3px' }}>
                  Porsi
                </Typography>
              </Stack>
              <Iconify
                icon="ph:trash-bold"
                color="red"
                sx={{
                  ml: 2,
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                onClick={() => handleDeleteList(data)}
              />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <LoadingButton variant="contained" color="primary" loading={isSubmitting} type="submit">
        {type === 'CREATE' ? 'Tambah' : 'Update'}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100px',
                flexDirection: 'column',
              }}
            >
              <Iconify
                icon="eos-icons:loading"
                sx={{
                  width: '40px',
                  height: '40px',
                }}
              />
              Loading ...
            </Box>
          ) : (
            <Scrollbar sx={{ maxHeight: '80vh' }}>
              {modalHeader}
              <FormProvider methods={methods} onSubmit={onSubmit}>
                {modalBody}
                {modalFooter}
              </FormProvider>
            </Scrollbar>
          )}
        </Box>
      </Modal>
    </>
  );
}
