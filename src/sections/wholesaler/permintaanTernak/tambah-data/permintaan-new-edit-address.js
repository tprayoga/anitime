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
import PermintaanAddressDialog from './permintaan-address-dialog';
import { useCallback } from 'react';
import { CalculatePrice } from '../../components/calculatePrice';

// ----------------------------------------------------------------------

export default function PermintaanNewEditAddress() {
  const adminToken = sessionStorage.getItem('adminToken');

  const { data: userPeternakan, loading: loadingUserPeternakan } = useListAllData('users', {
    filter: `role = "peternakan"`,
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const mdUp = useResponsive('up', 'md');

  const values = watch();

  const { wholesaler, invoiceTo } = values;

  const to = useBoolean();

  const handleSelectInvoiceTo = useCallback(
    (address) => {
      setValue('invoiceTo', address);
      setValue(`items`, [
        {
          jenisBreed: '',
          berat: 500,
          jumlahPermintaaan: 1,
          estimatePrice: CalculatePrice(500),
          estimatePriceTotal: CalculatePrice(500),
        },
      ]);
    },
    [setValue, invoiceTo]
  );

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

        <Stack sx={{ width: 1 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
              Peternakan:
            </Typography>

            <IconButton onClick={to.onTrue}>
              <Iconify icon={invoiceTo ? 'solar:pen-bold' : 'mingcute:add-line'} />
            </IconButton>
          </Stack>

          {invoiceTo ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2" textTransform="capitalize">
                {invoiceTo.name}
              </Typography>
              <Typography variant="body2">{invoiceTo.address}</Typography>
              <Typography variant="body2">+62 {invoiceTo.phone}</Typography>
            </Stack>
          ) : (
            <Typography typography="caption" sx={{ color: 'error.main' }}>
              {errors.invoiceTo?.message}
            </Typography>
          )}
        </Stack>
      </Stack>

      <PermintaanAddressDialog
        title="Peternakan"
        open={to.value}
        onClose={to.onFalse}
        selected={(selectedId) => invoiceTo?.id === selectedId}
        onSelect={(address) => handleSelectInvoiceTo(address)}
        list={userPeternakan.map((user) => ({
          ...user,
          disabled: invoiceTo?.id === user.id,
        }))}
        // action={
        //   <Button
        //     size="small"
        //     startIcon={<Iconify icon="mingcute:add-line" />}
        //     sx={{ alignSelf: 'flex-end' }}
        //   >
        //     New
        //   </Button>
        // }
      />
    </>
  );
}
