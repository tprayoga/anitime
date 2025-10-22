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
import { NumericFormatCustom } from '../../components/numberFormat';
import { CalculatePrice } from '../../components/calculatePrice';

// ----------------------------------------------------------------------

export default function PermintaanNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();
  const invoiceTo = values.invoiceTo;

  const totalOnRow = values.items.map((item) => item.estimatePriceTotal);

  const totalAmount = totalOnRow.reduce((acc, curr) => acc + parseInt(curr), 0);

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [setValue, totalAmount]);

  const handleAdd = () => {
    append({
      jenisBreed: '',
      berat: 500,
      jumlahPermintaaan: 1,
      estimatePrice: CalculatePrice(500),
      estimatePriceTotal: CalculatePrice(500),
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const { data: dataTernak, loading: loadingTernak } = useListAllData('');
  const { data: listBreedHewan, loading: loadingListBreedHewan } = useListAllData('listBreedHewan');

  const handleChangeBerat = useCallback(
    (index, value) => {
      const pricePerItem = CalculatePrice(value);
      const totalRequest = values.items[index].jumlahPermintaaan;
      const totalPrice = parseInt(pricePerItem) * parseInt(totalRequest);

      setValue(`items[${index}].berat`, value);
      setValue(`items[${index}].estimatePrice`, pricePerItem);
      setValue(`items[${index}].estimatePriceTotal`, totalPrice);
    },
    [setValue, values.items]
  );

  const handleChangeJumlahPermintaan = useCallback(
    (index, value) => {
      const pricePerItem = values.items[index].estimatePrice;
      const total = parseInt(pricePerItem) * parseInt(value);

      setValue(`items[${index}].jumlahPermintaaan`, value);
      setValue(`items[${index}].estimatePriceTotal`, total);
    },
    [setValue, values.items]
  );

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

  if (!invoiceTo) {
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
            Silahkan pilih Peternakan terlebih dahulu.
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
              <RHFAutocomplete
                name={`items[${index}].jenisBreed`}
                label="Jenis Breed"
                options={listBreedHewan.map(({ name }) => name)}
                getOptionLabel={(option) => option || ''}
                isOptionEqualToValue={(option, value) => option === value}
                // onChange={(event, option) => handleSelectJenisBreed(index, option)}
                size="small"
                fullWidth
              />

              <RHFTextField
                size="small"
                name={`items[${index}].berat`}
                label="Berat"
                type="number"
                sx={{ maxWidth: 100 }}
                InputLabelProps={{ shrink: true }}
                placeholder="0"
                onChange={(e) => handleChangeBerat(index, e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="caption">Kg</Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                size="small"
                name={`items[${index}].jumlahPermintaaan`}
                label="Jumlah Permintaan"
                sx={{ maxWidth: 150 }}
                type="number"
                InputLabelProps={{ shrink: true }}
                placeholder="0"
                onChange={(e) => handleChangeJumlahPermintaan(index, e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="caption">Ekor</Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                size="small"
                name={`items[${index}].estimatePrice`}
                label="Perkiraan Harga"
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
