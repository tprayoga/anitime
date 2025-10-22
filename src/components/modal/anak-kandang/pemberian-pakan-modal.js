import {
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
import { Box, Stack } from '@mui/system';
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
import Scrollbar from '../../scrollbar';
import { useEffect, useState } from 'react';
import { useGetJenisPakan } from 'src/api/anak-kandang/jenis-pakan';
import { useCreatePemberianPakan } from 'src/api/anak-kandang/pemberian-pakan';
import { enqueueSnackbar } from 'notistack';
import { useCreateData, useGetFulLData, useUpdateData } from 'src/api/custom-api';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 800 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function PemberianPakanModal({
  open,
  onClose,
  dataTernak,
  refetch,
  dataPemberianPakan,
  type,
  ...other
}) {
  const { data: dataJenisPakan, error, loading, getFullData: getJenisPakan } = useGetFulLData();

  const {
    createData: createPemberianPakan,
    error: errorCreateData,
    loading: loadingCreateData,
  } = useCreateData();

  const {
    updateData: updatePemberianPakan,
    error: errorUpdateData,
    loading: loadingUpdateData,
  } = useUpdateData();

  // const [selectedValue, setSelectedValue] = useState('');
  const [listTipePakan, setListTipePakan] = useState([]);
  const [isOnMounted, setIsOnMounted] = useState(false);

  const schema = Yup.object().shape({
    jumlahPakanKonsentrat: Yup.number()
      .required('Jumlah Pakan Konsentrat Wajib Diisi')
      .min(1, 'Jumlah Pakan Konsentrat wajib lebih dari 0'),
    jumlahPemberianAir: Yup.number()
      .required('Jumlah Pemberian Air Wajib Diisi')
      .min(1, 'Jumlah Pemberian Air wajib lebih dari 0'),
  });

  const defaultValues = {
    jumlahPakanKonsentrat: 0,
    jumlahPemberianAir: 0,
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

  const handleAddButton = (selectedValue) => {
    if (selectedValue) {
      const findData = listTipePakan.findIndex((e) => e.jenisPakan === selectedValue);

      if (findData === -1) {
        const data = {
          jenisPakan: selectedValue,
          jumlah: 0,
        };
        setListTipePakan([...listTipePakan, data]);
      }
    }
  };

  const handleDeleteList = (jenisPakan) => {
    const findData = listTipePakan.findIndex((e) => e.jenisPakan === jenisPakan);

    if (findData !== -1) {
      const updatedData = [...listTipePakan];

      updatedData.splice(findData, 1);

      setListTipePakan(updatedData);
      setValue(
        'skills',
        updatedData.map((data) => {
          return data.jenisPakan;
        })
      );
    }
  };

  const handleChangeQty = (jenisPakan, value) => {
    const findData = listTipePakan.findIndex((e) => e.jenisPakan === jenisPakan);
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
    getJenisPakan('listJenisPakan');
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

  const onSubmit = handleSubmit(async (data) => {
    const updatedData = {
      ...data,
      tipePakan: listTipePakan,
      ternak: dataTernak.id,
    };

    if (listTipePakan.length === 0) {
      alert('Minimal harus ada 1 item !');
      return;
    }

    if (type === 'CREATE') {
      try {
        await createPemberianPakan(updatedData, 'pemberianPakanTernak');
        enqueueSnackbar('Success', { variant: 'success' });

        reset();
        onClose();
        refetch();
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      }
    } else {
      try {
        await updatePemberianPakan(dataPemberianPakan.id, updatedData, 'pemberianPakanTernak');
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
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} sm={6}>
          <RHFTextField
            type="number"
            name="jumlahPakanKonsentrat"
            label="Jumlah Pakan Konsentrat"
            InputProps={{
              endAdornment: <InputAdornment position="start">kg</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RHFTextField
            type="number"
            name="jumlahPemberianAir"
            label="Jumlah Pakan Pemberian Air"
            InputProps={{
              endAdornment: <InputAdornment position="start">liter</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {/* <RHFMultiCheckbox
                        row
                        name="tipePakan"
                        label="Tipe Pakan"
                        spacing={4}
                        options={TIPE_PAKAN_OPTIONS}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            marginTop: 1
                        }}
                    /> */}
          <RHFAutocomplete
            name="skills"
            placeholder="+ Jenis Pakan"
            multiple
            options={dataJenisPakan?.map((option) => option.name)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected) =>
              selected.map((option, index) => (
                <Chip
                  sx={{ ml: 1 }}
                  key={option}
                  label={option}
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
            filterSelectedOptions={(options, { inputValue }) => {
              return options.filter((option) => {
                return true;
              });
            }}
            disableClearable
          />
        </Grid>
        {/* <Grid item xs={12}>
                    <Stack flexDirection={'row'} mt={1} spacing={2}>

                        <FormControl fullWidth>
                            <InputLabel>Tipe Pakan</InputLabel>
                            <Select
                                input={<OutlinedInput label="Tipe Pakan" />}
                                value={selectedValue}
                                onChange={(e) => setSelectedValue(e.target.value)}
                            >
                                {dataJenisPakan?.map((option) => (
                                    <MenuItem value={option.name} key={option.name}>{option.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleAddButton}>
                            + Add
                        </Button>

                    </Stack>
                </Grid> */}
        <Grid item xs={12} sx={{ minHeight: 100, mt: 2 }}>
          <Stack spacing={2}>
            {listTipePakan?.map((data, index) => (
              <Stack flexDirection={'row'} alignItems={'center'} key={index}>
                <Stack flexDirection={'row'} sx={{ flex: 1 }} alignItems={'center'}>
                  <Iconify icon="radix-icons:dot-filled" width="10" />
                  <Typography variant="body2">{data.jenisPakan}</Typography>
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
                    onChange={(e) => handleChangeQty(data.jenisPakan, e.target.value)}
                  />
                  <Typography ml={1} variant="body2" sx={{ mt: '3px' }}>
                    Kg
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
                  onClick={() => handleDeleteList(data.jenisPakan)}
                />
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
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
