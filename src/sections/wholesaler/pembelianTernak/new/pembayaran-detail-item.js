import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function PembayaranDetailItems({ taxes, totalAmount, data, onBack }) {
  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ my: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
        <Box sx={{ width: 160 }}>{taxes ? fCurrency(taxes) : '-'}</Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader
        title="Details"
        action={
          <IconButton onClick={onBack}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />

      <Stack
        sx={{
          px: 3,
        }}
      >
        <Scrollbar
          sx={{
            maxHeight: '40vh',
          }}
        >
          {data.map((item) => (
            <Stack
              key={item.rfid}
              direction="row"
              alignItems="center"
              sx={{
                py: 3,
                minWidth: 640,
                marginRight: 2,
                borderBottom: (theme) => `dashed 2px ${theme.palette.background.neutral}`,
              }}
            >
              <ListItemText
                primary={item.jenisBreed}
                secondary={`${item.rfid} - ${item.berat} Kg`}
                primaryTypographyProps={{
                  typography: 'body2',
                }}
                secondaryTypographyProps={{
                  component: 'span',
                  color: 'text.disabled',
                  mt: 0.5,
                }}
              />

              <Box sx={{ typography: 'body2' }}>x1</Box>

              <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
                {fCurrency(item.harga)}
              </Box>
            </Stack>
          ))}
        </Scrollbar>

        {renderTotal}
      </Stack>
    </Card>
  );
}

PembayaranDetailItems.propTypes = {
  discount: PropTypes.number,
  items: PropTypes.array,
  shipping: PropTypes.number,
  subTotal: PropTypes.number,
  taxes: PropTypes.number,
  totalAmount: PropTypes.number,
  data: PropTypes.array,
};
