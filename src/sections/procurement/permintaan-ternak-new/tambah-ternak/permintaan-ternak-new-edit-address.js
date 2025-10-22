import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { _addressBooks } from 'src/_mock';

import Iconify from 'src/components/iconify';

import useListAllData from 'src/api/wholesaler/listAll';
import PermintaanAddressDialog from './permintaan-ternak-address-dialog';
import { useCallback } from 'react';
import { CalculatePrice } from 'src/components/calculatePrice';

// ----------------------------------------------------------------------

export default function PermintaanTernakNewEditAddress() {
  const adminToken = sessionStorage.getItem('adminToken');

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const mdUp = useResponsive('up', 'md');

  const values = watch();

  const { wholesaler, peternakan } = values;

  const to = useBoolean();

  return (
    <>
      <Stack
        spacing={{ xs: 3, md: 5 }}
        direction={{ xs: 'column', md: 'row' }}
        divider={
          <Divider
            flexItem
            orientation={mdUp ? 'vertical' : 'horizontal'}
            sx={{ borderStyle: 'dashed' }}
          />
        }
        sx={{ p: 3 }}
      >
        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              Peternakan:
            </Typography>

            {/* <IconButton onClick={to.onTrue}>
              <Iconify icon={invoiceTo ? 'solar:pen-bold' : 'mingcute:add-line'} />
            </IconButton> */}
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2" textTransform="capitalize">
              {peternakan.name}
            </Typography>
            <Typography variant="body2">{peternakan.address}</Typography>
            <Typography variant="body2">+62 {peternakan.phone}</Typography>
          </Stack>
        </Stack>

        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              Wholesaler:
            </Typography>

            {/* <IconButton onClick={from.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton> */}
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2" textTransform="capitalize">
              {wholesaler.name}
            </Typography>
            <Typography variant="body2">{wholesaler.address}</Typography>
            <Typography variant="body2">+62 {wholesaler.phone}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
