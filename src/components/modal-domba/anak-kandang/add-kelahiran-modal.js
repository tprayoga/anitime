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
import { useCreateData, useUpdateData } from 'src/api/custom-domba-api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 600 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function AddKelahiranModal({
  open,
  onClose,
  selectedData,
  setSelectedData,
  type,
  setType,
  perkawinanData,
  handleNext,
  ...other
}) {
  const theme = useTheme();
  const user = useAuthContext();

  const JENIS_KELAHIRAN_OPTIONS = ['1', '2', '3'];

  const schema = Yup.object().shape({
    ternakBetina: Yup.string().required('Nama Pen Wajib Diisi'),
    jumlahAnak: Yup.string().required('Jenis Pen Wajib Diisi'),
    // jenisKelahiran: Yup.string().required('Jenis Kelahiran Wajib Diisi'),
  });

  const defaultValues = {
    ternakBetina: '',
    jumlahAnak: '',
    // jenisKelahiran: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    handleNext(data);
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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>
        Input Data Kelahiran
      </Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RHFTextField name="jumlahAnak" label="Jumlah Kelahiran" type="number" />
      <RHFSelect name="ternakBetina" label="Ternak Betina">
        {perkawinanData?.expand?.ternakBetina?.map((option) => (
          <MenuItem value={option.id} key={option.id}>
            {option.noFID}
          </MenuItem>
        ))}
      </RHFSelect>
      {/* <RHFSelect name="jenisKelahiran" label="Jenis Kelahiran">
        {JENIS_KELAHIRAN_OPTIONS?.map((option) => (
          <MenuItem value={option} key={option}>
            {option}
          </MenuItem>
        ))}
      </RHFSelect> */}
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <LoadingButton color="primary" variant="contained" type="submit" loading={isSubmitting}>
        {type === 'CREATE' ? 'Next' : 'Update'}
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
