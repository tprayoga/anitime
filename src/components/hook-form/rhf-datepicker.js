import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { parseISO } from 'date-fns'; // Import parseISO function

// ----------------------------------------------------------------------

export default function RHFDatePicker({
  name,
  helperText,
  type,
  views = ['year', 'month', 'day'],
  maxDate,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <DatePicker
            name={name}
            type={type}
            value={field.value}
            views={views}
            format={
              views.join() === 'month' ? 'MMM' : views.join() === 'year' ? 'yyyy' : 'dd/MM/yyyy'
            }
            onChange={(date) => {
              field.onChange(date);
            }}
            slotProps={{
              textField: {
                variant: 'outlined',
                error: !!error,
                helperText: error?.message,
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}

RHFDatePicker.propTypes = {
  helperText: PropTypes.object,
  name: PropTypes.string,
  type: PropTypes.string,
};

export function RHFDateTimePicker({ name, helperText, type, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <DateTimePicker
            name={name}
            type={type}
            value={field.value}
            onChange={(date) => {
              field.onChange(date);
            }}
            slotProps={{
              textField: {
                variant: 'outlined',
                error: !!error,
                helperText: error?.message,
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}
