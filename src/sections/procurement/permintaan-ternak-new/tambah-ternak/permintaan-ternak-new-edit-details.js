import sum from 'lodash/sum';
import { useEffect, useCallback, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';

import { fCurrency } from 'src/utils/format-number';

import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import useListAllData from 'src/api/wholesaler/listAll';
import { CalculatePrice } from 'src/components/calculatePrice';
import { NumericFormatCustom } from 'src/components/numericFormat';

// ----------------------------------------------------------------------

export default function PermintaanTernakNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();
  const peternakan = values.peternakan;
  const jenisBreed = values.jenisBreed;
  const berat = values.berat;
  const jumlahPermintaaan = values.jumlahPermintaaan;

  const totalOnRow = values.items.map((item) => item.estimatePriceTotal);

  const totalAmount = totalOnRow.reduce((acc, curr) => acc + parseInt(curr), 0);

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [setValue, totalAmount]);

  const handleAdd = () => {
    append({
      rfid: '',
      jenisBreed: '',
      kandang: '',
      berat: 0,
      jumlahPermintaaan: 1,
      estimatePrice: CalculatePrice(0),
      estimatePriceTotal: CalculatePrice(0),
      isDeclined: false,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const { data: dataTernak, loading: loadingTernak, refetch: refetchTernak } = useListAllData('');

  useEffect(() => {
    if (peternakan) {
      refetchTernak('ternak', {
        filter: `peternakan="${peternakan?.id}" && berat = "${berat}" && status="aktif" && jenisBreed="${jenisBreed}"`,
        expand: 'kandang',
      });
    }
  }, [peternakan]);

  const handleSelectRfid = useCallback(
    (index, rfid) => {
      const selectedTernak = dataTernak.find((item) => item.RFID === rfid);

      if (selectedTernak) {
        setValue(`items[${index}].id`, selectedTernak.id);
        setValue(`items[${index}].rfid`, selectedTernak.RFID);
        setValue(`items[${index}].berat`, selectedTernak.berat);
        setValue(`items[${index}].kandang`, selectedTernak?.expand?.kandang?.namaKandang || '');
        setValue(`items[${index}].estimatePriceTotal`, CalculatePrice(selectedTernak.berat));
        setValue(`items[${index}].isDeclined`, selectedTernak?.isDeclined);
      }
    },
    [dataTernak]
  );

  const listRfid = useMemo(() => {
    const rfids = dataTernak.map(({ RFID }) => RFID);
    // if there any rfid that already in the list, remove it
    return rfids.filter((rfid) => !fields.some((item) => item.rfid === rfid));
  }, [dataTernak, fields]);

  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Biaya Layanan</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>-</Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
        <Box sx={{ width: 160 }}>-</Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Total</Box>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );

  if (!dataTernak.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
          Ternak:
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '20vh' }}
        >
          <Typography variant="body1" color="text.secondary" fontWeight={600}>
            Saat ini ternak dengan jenis breed & berat yang sesuai belum tersedia.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Ternak:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <RHFTextField size="small" name={`jenisBreed`} label="Jenis Breed" disabled />

              <RHFAutocomplete
                name={`items[${index}].rfid`}
                label="RFID"
                options={listRfid}
                getOptionLabel={(option) => option || ''}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(event, option) => handleSelectRfid(index, option)}
                size="small"
                fullWidth
              />
              <RHFTextField
                size="small"
                name={`items[${index}].kandang`}
                label="Lokasi Kandang"
                InputLabelProps={{ shrink: true }}
                disabled
              />
              <RHFTextField
                size="small"
                name={`items[${index}].berat`}
                label="Berat"
                type="number"
                sx={{ maxWidth: 100 }}
                InputLabelProps={{ shrink: true }}
                placeholder="0"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="caption">Kg</Typography>
                    </InputAdornment>
                  ),
                }}
                disabled
              />

              <RHFTextField
                size="small"
                name={`items[${index}].estimatePriceTotal`}
                label="Perkiraan Harga Total"
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
                disabled
              />
            </Stack>

            <Stack direction="row" justifyContent="space-between" width={1}>
              <Typography variant="caption" color="error.main" marginLeft={1}>
                {values.items[index]?.isDeclined ? 'Farm manager tidak menyetujui ternak ini' : ''}
              </Typography>
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(index)}
                disabled={fields.length === 1}
              >
                Hapus
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
          disabled={values.items.length >= parseInt(jumlahPermintaaan)}
        >
          Add Item
        </Button>

        <Stack
          spacing={2}
          justifyContent="flex-end"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1 }}
        >
          {/* <RHFTextField
            size="small"
            label="Shipping($)"
            name="shipping"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          /> */}

          {/* <RHFTextField
            size="small"
            label="Discount($)"
            name="discount"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          /> */}

          {/* <RHFTextField
            size="small"
            label="Taxes(%)"
            name="taxes"
            type="number"
            sx={{ maxWidth: { md: 120 } }}
          /> */}
        </Stack>
      </Stack>

      {renderTotal}
    </Box>
  );
}
