import { Button, Grid, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../scrollbar';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { useEffect, useState } from 'react';
// import { useCreateData, useUpdateData } from "src/api/custom-api";
import { useTheme } from '@emotion/react';
import { useCreateData, useGetFulLData, useUpdateData } from 'src/api/custom-domba-api';
import RHFDatePicker from 'src/components/hook-form/rhf-datepicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 600 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function AddSapihModal({ open, onClose, type, selectedData, ...other }) {
  const theme = useTheme();
  const user = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const TERNAK_OPTIONS = selectedData?.expand?.ternakAnakan?.map((data) => {
    return {
      label: data.noFID,
      value: data.id,
    };
  });

  const {
    createData: createSapih,
    loading: loadingCreateKandang,
    error: errorCreateKandang,
  } = useCreateData();

  const { data: dataKandang, getFullData: getKandang } = useGetFulLData();

  const [penOptions, setPenOptions] = useState([]);

  const schema = Yup.object().shape({
    ternak: Yup.string().required('Ternak Wajib Diisi'),
    bobot: Yup.number().required('Luas Kandang Wajib Diisi').min(1, 'Bobot wajib lebih dari 0'),
    tanggalPenyapihan: Yup.date().required('Tanggal Penyapihan Wajib Diisi'),
    kandang: Yup.string().required('Kandang Wajib Diisi'),
    pen: Yup.string().required('Pen Wajib Diisi'),
  });

  const defaultValues = {
    ternak: '',
    bobot: 0,
    tanggalPenyapihan: undefined,
    kandang: '',
    pen: '',
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
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // if (type === 'CREATE') {
    try {
      await createSapih(data, 'penyapihan');
      enqueueSnackbar('Success', { variant: 'success' });
      onClose();
    } catch (error) {
      enqueueSnackbar('Failed', { variant: 'error' });
    }
    // } else {
    //   try {
    //     await updateKandang(selectedData.id, body, 'kandang');
    //     onClose();
    //     enqueueSnackbar('Success', { variant: 'success' });
    //   } catch (error) {
    //     enqueueSnackbar('Failed', { variant: 'error' });
    //   }
    // }
    reset();
  });

  useEffect(() => {
    getKandang('kandang', 'pen');
  }, []);

  useEffect(() => {
    if (watch('kandang')) {
      const selectedKandang = dataKandang?.find((e) => e.id === watch('kandang'));
      setPenOptions(selectedKandang?.expand?.pen);
    }
  }, [watch('kandang')]);

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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>
        Input Data Penyapihan
      </Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2 }}>
      <Stack spacing={3}>
        <RHFSelect name="ternak" label="Pilih Ternak Anakan">
          {TERNAK_OPTIONS?.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFTextField name="bobot" label="Bobot" type="number" />
        <RHFSelect name="kandang" label="Kandang">
          {dataKandang?.map((options) => (
            <MenuItem value={options.id} key={options.id}>
              {options.namaKandang}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFSelect name="pen" label="Pen">
          {penOptions?.map((options) => (
            <MenuItem value={options.id} key={options.id}>
              {options.namaPen}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFDatePicker name="tanggalPenyapihan" label="Tanggal Penyapihan" />
      </Stack>
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <LoadingButton color="primary" variant="contained" type="submit" loading={isSubmitting}>
        {type === 'CREATE' ? 'Tambah' : 'Tambah'}
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
