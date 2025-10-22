import { Button, Grid, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../scrollbar';
import { useCreateKandang, useUpdateKandang } from 'src/api/anak-kandang/kandang';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { useEffect } from 'react';
// import { useCreateData, useUpdateData } from "src/api/custom-api";
import { useTheme } from '@emotion/react';
import { useCreateData, useUpdateData } from 'src/api/custom-domba-api';
import Iconify from 'src/components/iconify';
import QRCode from 'react-qr-code';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 400 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function ScanPakanModal({
  open,
  onClose,
  selectedData,
  setSelectedData,
  type,
  setType,
  refetch,
  ...other
}) {
  const theme = useTheme();
  const user = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const SATUAN_OPTIONS = [
    { id: 'Ha', label: 'ha' },
    { id: 'm²', label: 'm²' },
  ];

  const {
    createData: createKandang,
    loading: loadingCreateKandang,
    error: errorCreateKandang,
  } = useCreateData();

  const {
    updateData: updateKandang,
    loading: loadingUpdateKandang,
    error: errorUpdateKandang,
  } = useUpdateData();

  useEffect(() => {
    return () => {
      setSelectedData(null);
    };
  }, []);

  useEffect(() => {
    if (selectedData) {
      const { namaKandang, luasKandang, limitKandang, satuanKandang } = selectedData;

      const newValue = {
        namaKandang: namaKandang,
        luasKandang: satuanKandang === 'Ha' ? luasKandang / 10000 : luasKandang,
        limitKandang: limitKandang,
        satuanKandang: satuanKandang,
      };
      reset(newValue);
    }
  }, [selectedData]);

  const schema = Yup.object().shape({
    namaKandang: Yup.string().required('Nama Kandang Wajib Diisi'),
    luasKandang: Yup.number()
      .required('Luas Kandang Wajib Diisi')
      .min(1, 'Luas Kandang wajib lebih dari 0'),
    satuanKandang: Yup.string().required('Satuan Kandang Wajib Diisi'),
  });

  const defaultValues = {
    namaKandang: '',
    luasKandang: undefined,
    satuanKandang: '',
    deskripsi: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const body = {
      ...data,
      luasKandang: data.satuanKandang === 'Ha' ? data.luasKandang * 10000 : data.luasKandang,
      peternakan: user.user.createdBy,
    };

    if (type === 'CREATE') {
      try {
        await createKandang(body, 'kandang');
        enqueueSnackbar('Success', { variant: 'success' });
        onClose();
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      }
    } else {
      try {
        await updateKandang(selectedData.id, body, 'kandang');
        onClose();
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      }
    }
    reset();
    refetch();
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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Scan Barcode</Typography>
    </Box>
  );

  const modalBody = (
    <Box
      sx={{
        borderRadius: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Iconify icon="ph:barcode-thin" width={'80%'} />
      <Typography textAlign={'center'}>Silahkan Scan Barcode Pada Pakan</Typography>
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      {/* <Button variant="outlined" onClick={onClose}>
                Cancel
            </Button>

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Update
            </LoadingButton> */}
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      {/* <LoadingButton color="primary" variant="contained" type="submit" loading={isSubmitting}>
        {type === 'CREATE' ? 'Tambah' : 'Update'}
      </LoadingButton> */}
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
