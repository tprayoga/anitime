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

export default function RegPakanModal({
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
  const [listTipePakan, setListTipePakan] = useState([]);
  const [isOnMounted, setIsOnMounted] = useState(false);

  const schema = Yup.object().shape({
    nama: Yup.string().required('Nama Wajib Diisi'),
  });

  const defaultValues = {
    nama: '',
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
    getRegPakan('listRegPakan');
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
      jenisPakan: listTipePakan.map((data) => data.jenisPakan.id),
      komposisi: listTipePakan,
      createdBy: user?.id,
    };

    if (listTipePakan.length === 0) {
      alert('Minimal harus ada 1 item !');
      return;
    }

    if (type === 'CREATE') {
      try {
        await createRegistrasiPakan(updatedData, 'registrasiPakan');
        enqueueSnackbar('Success', { variant: 'success' });

        reset();
        onClose();
        refetch();
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
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

  console.log(listTipePakan);

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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Registrasi Pakan</Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2 }}>
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12} sm={12}>
          <RHFTextField name="nama" label="Nama" />
        </Grid>
        <Grid item xs={12}>
          <RHFAutocomplete
            name="skills"
            placeholder="+ Jenis Pakan"
            multiple
            options={dataRegPakan.sort((a, b) => -b.category.localeCompare(a.category))}
            groupBy={(option) => option.category}
            getOptionLabel={(option) => option.jenis}
            renderGroup={(params, option) => (
              <li key={params.key}>
                <GroupHeader>{params.group}</GroupHeader>
                <GroupItems>{params.children}</GroupItems>;
              </li>
            )}
            renderTags={(selected) =>
              selected.map((option, index) => (
                <Chip
                  sx={{ ml: 1 }}
                  key={index}
                  label={option.jenis}
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
        </Grid>
        <Grid item xs={12} sx={{ minHeight: 100, mt: 2 }}>
          <Stack spacing={2}>
            {listTipePakan?.map((data, index) => (
              <Stack flexDirection={'row'} alignItems={'center'} key={index}>
                <Stack flexDirection={'row'} sx={{ flex: 1 }} alignItems={'center'}>
                  <Iconify icon="radix-icons:dot-filled" width={10} />
                  <Typography variant="body2">{data.jenisPakan.jenis}</Typography>
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
