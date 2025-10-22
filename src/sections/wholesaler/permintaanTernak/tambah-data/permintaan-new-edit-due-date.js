import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Divider } from '@mui/material';

// ----------------------------------------------------------------------

const isWeekend = (date) => {
  const day = date.day();

  return day === 0 || day === 6;
};

const today = new Date();
const twoDaysLater = new Date(today);
twoDaysLater.setDate(today.getDate() + 2);

export default function PermintaanNewEditDueDate() {
  const { control, watch } = useFormContext();

  const values = watch();

  return (
    <>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3 }}>
        <RHFSelect
          fullWidth
          name="status"
          label="Status"
          InputLabelProps={{ shrink: true }}
          PaperPropsSx={{ textTransform: 'capitalize' }}
          disabled
        >
          {['Ditunda'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </RHFSelect>

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
              label="Tanggal jatuh tempo"
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              di
              disablePast
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
