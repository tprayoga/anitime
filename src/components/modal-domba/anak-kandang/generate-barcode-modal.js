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

export default function GenerateBarcodeModal({ open, onClose, data, ...other }) {
  const theme = useTheme();
  const user = useAuthContext();

  const { createData: createPen } = useCreateData();

  const { updateData: updateKandang } = useUpdateData();

  const { enqueueSnackbar } = useSnackbar();
  console.log(data);

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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Cetak Barcode</Typography>
    </Box>
  );

  const modalBody = (
    <Box
      sx={{
        borderRadius: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center items horizontally
        gap: 2,
        justifyContent: 'center',
      }}
    >
      <QRCode
        size={256}
        style={{ width: '90%', height: 'auto', margin: '0 auto' }} // Set width and margin
        value={data?.id}
        viewBox={`0 0 256 256`}
      />
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <Button color="primary" variant="contained" onClick={onClose}>
        Cetak
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
            {modalBody}
            {modalFooter}
          </Scrollbar>
        </Box>
      </Modal>
    </>
  );
}
