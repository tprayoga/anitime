import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fCurrency } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Input, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { NumericFormat } from 'react-number-format';

// ----------------------------------------------------------------------

export default function TernakTableRow({ row, handleChangeHarga, handleDelete }) {
  const { noFID, jenisHewan, kandang, berat, expand, harga } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const accessToken = sessionStorage.getItem('accessToken');

  return (
    <>
      <TableRow hover>
        <TableCell>{noFID}</TableCell>
        <TableCell>{jenisHewan}</TableCell>
        <TableCell>{expand?.kandang?.namaKandang}</TableCell>
        <TableCell>{berat} kg</TableCell>
        <TableCell>
          <NumericFormat
            customInput={TextField}
            thousandSeparator={'.'}
            decimalSeparator={','}
            onValueChange={({ floatValue }) => {
              // field.onChange(floatValue);
              handleChangeHarga(noFID, floatValue);
            }}
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
            }}
            value={harga}
            sx={{ width: 180 }}
          />
        </TableCell>
        <TableCell>
          <Iconify
            icon="ph:trash-bold"
            color="red"
            sx={{
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={() => {
              handleDelete(noFID);
            }}
          />
        </TableCell>
      </TableRow>
    </>
  );
}

TernakTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
