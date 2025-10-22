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

export default function AddPenModal({
  open,
  onClose,
  selectedData,
  setSelectedData,
  type,
  setType,
  kandangId,
  kandangData,
  refetchPen,
  refetchKandang,
  ...other
}) {
  const theme = useTheme();
  const user = useAuthContext();

  const { createData: createPen } = useCreateData();

  const { updateData: updateKandang } = useUpdateData();

  const { enqueueSnackbar } = useSnackbar();

  // console.log(kandangData);
  const JENIS_PEN_OPTIONS = [
    { id: 'Breeding', label: 'Breeding' },
    { id: 'Lahiran', label: 'Lahiran' },
    { id: 'Cempe', label: 'Cempe' },
    { id: 'Pembesaran Cempe', label: 'Pembesaran Cempe' },
    { id: 'Penggemukan Jantan', label: 'Penggemukan Jantan' },
    { id: 'Penggemukan Betina', label: 'Penggemukan Betina' },
  ];

  const JENIS_HEWAN_OPTIONS = [
    { id: 'Domba', label: 'Domba' },
    { id: 'Kambing', label: 'Kambing' },
  ];

  // useEffect(() => {
  //     return () => {
  //         setSelectedData(null);
  //     }
  // }, [])

  // useEffect(() => {
  //     if (selectedData) {

  //         const { namaPen, luasKandang, limitKandang, jenisPen } = selectedData;

  //         const newValue = ({
  //             namaPen: namaPen,
  //             luasKandang: jenisPen === 'Ha' ? luasKandang / 10000 : luasKandang,
  //             limitKandang: limitKandang,
  //             jenisPen: jenisPen
  //         })
  //         reset(newValue)
  //     }

  // }, [selectedData])

  const schema = Yup.object().shape({
    namaPen: Yup.string().required('Nama Pen Wajib Diisi'),
    jenisPen: Yup.string().required('Jenis Pen Wajib Diisi'),
    jenisHewan: Yup.string().required('Jenis Hewan Wajib Diisi'),
  });

  const defaultValues = {
    namaPen: '',
    jenisPen: '',
    jenisHewan: '',
    deskripsi: '',
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
    const body = {
      ...data,
      kandang: kandangId,
    };

    if (type === 'CREATE') {
      try {
        const responseData = await createPen(body, 'pen');
        const updatedDataKandang = {
          ...kandangData,
          pen: [...kandangData.pen, responseData.id],
        };
        await updateKandang(kandangId, updatedDataKandang, 'kandang');
        enqueueSnackbar('Success', { variant: 'success' });
        onClose();
        refetchPen();
        refetchKandang();
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      }
    } else {
      // try {
      //     await updateKandang(selectedData.id, body, 'kandang');
      //     onClose();
      //     enqueueSnackbar('Success', { variant: 'success' });
      // } catch (error) {
      //     enqueueSnackbar('Failed', { variant: 'error' });
      // }
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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Input Data Pen</Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RHFTextField name="namaPen" label="Nama Pen" />

      <RHFSelect name="jenisPen" label="Jenis Pen">
        {JENIS_PEN_OPTIONS?.map((option) => (
          <MenuItem value={option.id} key={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </RHFSelect>
      <RHFSelect name="jenisHewan" label="Jenis Hewan">
        {JENIS_HEWAN_OPTIONS?.map((option) => (
          <MenuItem value={option.id} key={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </RHFSelect>
      <RHFTextField name="deskripsi" label="Deskripsi (Optional)" multiline rows={3} />
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <LoadingButton color="primary" variant="contained" type="submit" loading={isSubmitting}>
        {type === 'CREATE' ? 'Tambah' : 'Update'}
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
