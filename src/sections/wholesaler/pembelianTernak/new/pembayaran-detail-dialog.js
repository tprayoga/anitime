import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { DialogTitle, InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { NumericFormatCustom } from '../../components/numberFormat';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RHFRadioGroup, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function PembayaranDetailDialog({
  title = 'Pembayaran',
  //
  open,
  onClose,
  //
  totalAmount,
  handleSubmitPembayaran,
  loadingSubmit,
  //
}) {
  const FormSchema = Yup.object().shape({
    metodePembayaran: Yup.string().required('Metode Pembayaran harus dipilih'),
  });

  const defaultValues = {
    harga: totalAmount,
    metodePembayaran: 'tunai',
  };

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleSubmitPembayaran(data.metodePembayaran);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ px: 2, py: 3, backgroundColor: '#EAFFEA' }}>{title}</DialogTitle>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack
          spacing={2}
          sx={{
            px: 3,
            py: 4,
          }}
        >
          <Stack direction="row" spacing={2}>
            <RHFTextField
              name="harga"
              label="Harga"
              InputProps={{
                inputComponent: NumericFormatCustom,
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="subtitle2" color="text.disabled">
                      Rp.
                    </Typography>
                  </InputAdornment>
                ),
              }}
              value={totalAmount}
              disabled
            />
          </Stack>
          <Stack>
            <Typography variant="caption" sx={{ color: 'text.primary', pl: 1 }}>
              Metode Pembayaran
            </Typography>

            <RHFRadioGroup
              row
              name="metodePembayaran"
              spacing={2}
              size="small"
              sx={{ fontSize: 12, pl: 1 }}
              options={[
                {
                  value: 'tunai',
                  label: 'Tunai',
                  disabled: false,
                },
                {
                  value: 'kredit',
                  label: 'Kredit',
                  disabled: true,
                },
              ]}
            />
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <LoadingButton
            loading={loadingSubmit}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              m: 2,
            }}
          >
            Bayar
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}

PembayaranDetailDialog.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  totalAmount: PropTypes.number,
  loadingSubmit: PropTypes.bool,
};
