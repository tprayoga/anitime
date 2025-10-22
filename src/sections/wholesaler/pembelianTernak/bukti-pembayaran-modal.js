import ModalWholesaler from '../components/modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import {
  RHFAutocomplete,
  RHFMultiSelect,
  RHFRadioGroup,
  RHFTextField,
} from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';
import QRCode from 'react-qr-code';
import { fDateTime } from 'src/utils/format-time';

function formatIdr(amount) {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
  return formattedAmount.replace(/,00\b/g, '');
}

function calculateServiceFee(totalPurchase) {
  const serviceFeePercentage = 3; // Persentase biaya layanan (3%)

  const serviceFeeDecimal = serviceFeePercentage / 100;

  const serviceFee = totalPurchase * serviceFeeDecimal;

  return serviceFee;
}

export default function BuktiPembayaranModal({
  open,
  close,
  data,
  onClickPrint,
  loadingSubmit,
  resetPage = () => {},
}) {
  const renderHeader = (
    <Stack px={4} py={2}>
      <Typography variant="h6" color="text.secondary">
        Billing
      </Typography>

      <Stack direction="row" justifyContent="space-between" marginTop={4}>
        <Stack spacing={0.3}>
          <Typography variant="body2" color="text.primary" fontWeight="bold">
            Invoice to:
          </Typography>
          <Typography variant="body2" color="text.secondary" textTransform="capitalize">
            {data.wholesaler.name}
          </Typography>
        </Stack>
        <Stack spacing={0.3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body2" color="text.primary" fontWeight="bold">
              Invoice#:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.id}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body2" color="text.primary" fontWeight="bold">
              Date:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {fDateTime(data.created)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );

  const renderContent = (
    <Stack px={2} spacing={1} position="relative">
      <Divider sx={{ borderTopWidth: 2, borderColor: 'text.secondary' }} />
      <Stack direction="row" justifyContent="space-between" px={2}>
        <Typography variant="body2" color="text.primary" fontWeight="bold" flex={2}>
          Item
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight="bold" flex={1}>
          Quantity
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight="bold" flex={1}>
          Unit Price
        </Typography>
        <Typography variant="body2" color="text.primary" fontWeight="bold" flex={1}>
          Total
        </Typography>
      </Stack>
      <Divider sx={{ borderTopWidth: 2, borderColor: 'text.secondary' }} />
      {/* sapi count */}
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" px={2}>
          <Typography variant="body2" color="text.primary" flex={2}>
            {data.ternak.jenisBreed}
          </Typography>
          <Typography variant="body2" color="text.primary" flex={1}>
            1
          </Typography>
          <Typography variant="body2" color="text.primary" flex={1}>
            {formatIdr(data.harga)}
          </Typography>
          <Typography variant="body2" color="text.primary" flex={1}>
            {formatIdr(data.harga)}
          </Typography>
        </Stack>
        <Divider sx={{ borderTopWidth: 2, borderColor: 'text.secondary' }} />
      </Stack>
      <Stack marginTop={2} px={2} direction="row">
        <Stack spacing={0.5} flex={2}>
          <Typography variant="body2" color="text.primary" fontWeight="bold">
            PAYMENT METHOD
          </Typography>
          <Typography variant="body2" color="text.primary">
            Cash
          </Typography>
        </Stack>
        <Stack flex={1} />
        <Stack spacing={0.5} flex={1}>
          <Typography variant="body2" color="text.primary" fontWeight="bold">
            Sub Total
          </Typography>
          <Typography variant="body2" color="text.primary" fontWeight="bold">
            Biaya Layanan
          </Typography>
          <Typography variant="body2" color="text.primary" fontWeight="bold">
            Tax (0%)
          </Typography>
        </Stack>
        <Stack spacing={0.5} flex={1}>
          <Typography variant="body2" color="text.primary">
            {formatIdr(data.harga)}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {formatIdr(calculateServiceFee(data.harga))}
          </Typography>
          <Typography variant="body2" color="text.primary">
            Rp. 0
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="end">
        <Divider
          sx={{
            borderTopWidth: 2,
            borderColor: 'text.secondary',
            width: '43%',
          }}
        />
      </Stack>
      <Stack px={2} direction="row" mb={8}>
        <Stack flex={2} />
        <Stack flex={1} />
        <Stack spacing={0.5} flex={1}>
          <Typography variant="body2" color="text.primary" fontWeight="bold">
            Total
          </Typography>
        </Stack>
        <Stack spacing={0.5} flex={1}>
          <Typography variant="body2" color="text.primary" fontWeight="bold">
            {formatIdr(data.harga + calculateServiceFee(data.harga))}
          </Typography>
        </Stack>
      </Stack>

      {/* qr code */}
      <Box position="absolute" bottom={0} left={35}>
        <QRCode value={data.id} size={100} />
      </Box>
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={() => {
        close();
        resetPage();
      }}
      maxWidth="md"
    >
      <Stack width="700px">
        <Stack
          sx={{ px: 2, py: 3, backgroundColor: '#EAFFEA' }}
          direction="row"
          alignItems="center"
          spacing={1}
          justifyContent="end"
        >
          <Box
            component="img"
            src="/logo/logo_single.png"
            alt="anitime"
            sx={{
              width: 40,
              height: 40,
              cursor: 'pointer',
            }}
          />
          <Typography variant="caption" color="primary" fontWeight={900} fontSize={24}>
            ANITIME
          </Typography>
        </Stack>

        {renderHeader}

        {renderContent}

        <DialogActions>
          <LoadingButton
            loading={loadingSubmit}
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            startIcon={<Iconify icon="bx:bxs-printer" />}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              px: 4,
            }}
            className="print-btn"
            onClick={onClickPrint}
          >
            Print
          </LoadingButton>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}
