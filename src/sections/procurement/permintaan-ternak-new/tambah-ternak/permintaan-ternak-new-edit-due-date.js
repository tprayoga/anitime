import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Divider, InputAdornment, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function PermintaanTernakNewEditDueDate() {
  const { control } = useFormContext();

  return (
    <>
      <Divider
        sx={{
          borderStyle: 'dashed',
        }}
      />
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ p: 3 }}
        // sx={{ p: 3, bgcolor: 'background.neutral' }}
      >
        <RHFSelect
          fullWidth
          name="status"
          label="Status"
          InputLabelProps={{ shrink: true }}
          PaperPropsSx={{ textTransform: 'capitalize' }}
          disabled
        >
          {['Ditunda', 'Diproses', 'Ditinjau', 'Diterima', 'Ditolak'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </RHFSelect>

        <RHFTextField name={`jenisBreed`} label="Permintaan Jenis Breed" disabled />
        <RHFTextField
          name={`berat`}
          label="Permintaan Berat"
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="disabled">
                  Kg
                </Typography>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name={`jumlahPermintaaan`}
          label="Total Permintaan"
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography variant="caption" color="disabled">
                  Ekor
                </Typography>
              </InputAdornment>
            ),
          }}
        />

        <Controller
          name="createDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Tanggal permintaan"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              disabled
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />

        {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
        <Controller
          name="dueDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <DatePicker
              label="Jatuh Tempo"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              disabled
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error?.message,
                },
              }}
            />
          )}
        />
        {/* </LocalizationProvider> */}
      </Stack>
    </>
  );
}
