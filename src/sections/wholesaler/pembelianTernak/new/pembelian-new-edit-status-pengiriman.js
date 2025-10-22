import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import useListAllData from 'src/api/wholesaler/listAll';
import { Divider } from '@mui/material';

// ----------------------------------------------------------------------

export default function PembelianNewEditStatusPengiriman() {
  const { data: dataMetodePengiriman, loading: loadingMetodePengiriman } =
    useListAllData('listMetodePengiriman');
  const { data: dataTujuanPembelian, loading: loadingTujuanPembelian } =
    useListAllData('listTujuanPembelian');

  const { control, watch } = useFormContext();

  const values = watch();

  return (
    <>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3 }}>
        <RHFTextField
          disabled
          name="invoiceNumber"
          label="Nomor Invoice"
          value={values.invoiceNumber}
        />

        <RHFSelect
          fullWidth
          name="metodePengiriman"
          label="Metode Pengiriman"
          InputLabelProps={{ shrink: true }}
          PaperPropsSx={{ textTransform: 'capitalize' }}
        >
          {dataMetodePengiriman.map(({ name }) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFSelect
          fullWidth
          name="tujuanPembelian"
          label="Tujuan Pembelian"
          InputLabelProps={{ shrink: true }}
          PaperPropsSx={{ textTransform: 'capitalize' }}
        >
          {dataTujuanPembelian.map(({ name }) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFTextField
          name="lokasiTujuan"
          label="Lokasi Tujuan"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>
    </>
  );
}
