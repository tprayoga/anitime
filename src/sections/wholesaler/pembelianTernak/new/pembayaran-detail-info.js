import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function PembayaranDetailsInfo({ customer, delivery, lokasiTujuan }) {
  const renderCustomer = (
    <>
      <CardHeader title="Wholesaler Info" />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar alt={customer.name} src={customer.avatar} sx={{ width: 48, height: 48, mr: 2 }} />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" textTransform="capitalize">
            {customer.name}
          </Typography>

          <Box sx={{ color: 'text.secondary' }}>{customer.email}</Box>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader title="Jenis Pengiriman" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Jenis Pengiriman
          </Box>
          {delivery}
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader title="Pengiriman" />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Alamat
          </Box>
          {lokasiTujuan}
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone number
          </Box>
          +62 {customer.phone}
        </Stack>
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDelivery}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}
    </Card>
  );
}

PembayaranDetailsInfo.propTypes = {
  customer: PropTypes.object,
  delivery: PropTypes.string,
  lokasiTujuan: PropTypes.string,
};
