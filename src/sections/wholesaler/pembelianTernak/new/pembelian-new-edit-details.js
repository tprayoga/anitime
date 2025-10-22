import sum from 'lodash/sum';
import { useEffect, useCallback, useMemo, useState } from 'react';
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
import PembelianNewEditDetailsItem from './pembelian-new-edit-details-item';

// ----------------------------------------------------------------------

export default function PembelianNewEditDetails() {
  const { control, setValue, watch, resetField } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();
  const invoiceTo = values.invoiceTo;

  const totalOnRow = values.items.map((item) => item.harga);

  const totalAmount = totalOnRow.reduce((acc, curr) => acc + parseInt(curr), 0);

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [setValue, totalAmount]);

  const handleAdd = () => {
    append({
      rfid: '',
      berat: '',
      bcs: '',
      // sertifikatKesehatan: '',
      petugas: '',
      harga: 0,
      jenisBreed: '',
      filteredBreed: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const { data: dataTernak, loading: loadingTernak, refetch: refetchTernak } = useListAllData();
  const { data: dataListBreed } = useListAllData('listBreedHewan');

  const [listTernak, setListTernak] = useState([]);

  useEffect(() => {
    if (invoiceTo) {
      refetchTernak('ternak', {
        filter: `peternakan="${invoiceTo?.id}" && berat >= "500" && status="aktif"`,
      });
    }
  }, [invoiceTo]);

  useEffect(() => {
    setListTernak(dataTernak.map(({ RFID }) => RFID));
  }, [dataTernak]);

  const listBreed = useMemo(() => {
    return dataListBreed.map(({ name }) => name);
  }, [dataListBreed]);

  const handleSelectRfid = useCallback(
    (index, option) => {
      const ternak = dataTernak.find(({ RFID }) => RFID === option);
      setValue(`items[${index}].rfid`, ternak?.RFID || '');
      setValue(`items[${index}].berat`, ternak?.berat || '');
      setValue(`items[${index}].bcs`, ternak?.bodyConditionalScore || '');
      setValue(`items[${index}].jenisBreed`, ternak?.jenisBreed || '');
      setValue(`items[${index}].idTernak`, ternak?.id || '');
      setValue(`items[${index}].harga`, CalculatePrice(ternak?.berat));
      setValue(`items[${index}].filteredBreed`, ternak?.jenisBreed || '');
    },
    [setValue, values.items, dataTernak]
  );

  const handleSelectBreed = useCallback(
    (index, option) => {
      setValue(`items[${index}].filteredBreed`, option || '');
    },
    [setValue, values.items, listBreed, listTernak]
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
  } else if (loadingTernak) {
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
            Loading...
          </Typography>
        </Stack>
      </Box>
    );
  } else if (!dataTernak.map(({ RFID }) => RFID).length) {
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
            Tidak ada ternak yang tersedia.
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
          <PembelianNewEditDetailsItem
            key={item.id}
            index={index}
            rfids={values.items.map(({ rfid }) => rfid)}
            listBreed={[...new Set(dataTernak.map(({ jenisBreed }) => jenisBreed))]}
            listRfid={dataTernak.map(({ RFID }) => RFID)}
            dataTernak={dataTernak}
            onRemove={() => handleRemove(index)}
            onSelectRfid={(event, option) => handleSelectRfid(index, option)}
            onSelectBreed={(event, option) => handleSelectBreed(index, option)}
            selectedTernak={values.items[index].filteredBreed}
            disabledRemove={fields.length === 1}
          />
          // <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
          //   <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
          //     <RHFAutocomplete
          //       name={`items[${index}].filteredBreed`}
          //       label="Jenis Breed"
          //       options={listBreed}
          //       getOptionLabel={(option) => option || ''}
          //       isOptionEqualToValue={(option, value) => option === value}
          //       onChange={(event, option) => handleSelectBreed(index, option)}
          //       size="small"
          //       fullWidth
          //     />
          //     <RHFAutocomplete
          //       name={`items[${index}].rfid`}
          //       label="RFID"
          //       options={listRfid}
          //       getOptionLabel={(option) => option || ''}
          //       isOptionEqualToValue={(option, value) => option === value}
          //       onChange={(event, option) => handleSelectRfid(index, option)}
          //       size="small"
          //       fullWidth
          //     />

          //     <RHFTextField
          //       size="small"
          //       name={`items[${index}].berat`}
          //       label="Berat"
          //       disabled
          //       InputLabelProps={{
          //         shrink: true,
          //       }}
          //     />
          //     <RHFTextField
          //       size="small"
          //       name={`items[${index}].bcs`}
          //       label="Body Conditional Score"
          //       disabled
          //       InputLabelProps={{
          //         shrink: true,
          //       }}
          //     />
          //     {/* <RHFTextField
          //       size="small"
          //       name={`items[${index}].sertifikatKesehatan`}
          //       label="Sertifikat Kesehatan"
          //     /> */}
          //     {/* <RHFTextField
          //       size="small"
          //       name={`items[${index}].jenisBreed`}
          //       label="Jenis Breed"
          //       disabled
          //       InputLabelProps={{
          //         shrink: true,
          //       }}
          //     /> */}

          //     <RHFTextField
          //       size="small"
          //       name={`items[${index}].harga`}
          //       label="Harga"
          //       InputProps={{
          //         inputComponent: NumericFormatCustom,
          //         startAdornment: (
          //           <InputAdornment position="start">
          //             <Typography variant="subtitle2" color="text.disabled">
          //               Rp.
          //             </Typography>
          //           </InputAdornment>
          //         ),
          //       }}
          //       disabled
          //       InputLabelProps={{
          //         shrink: true,
          //       }}
          //     />
          //   </Stack>

          //   <Button
          //     size="small"
          //     color="error"
          //     startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          //     onClick={() => handleRemove(index)}
          //     disabled={fields.length === 1}
          //   >
          //     Hapus
          //   </Button>
          // </Stack>
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
