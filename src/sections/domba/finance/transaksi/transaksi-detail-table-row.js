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
import { FormatRupiah } from '@arismun/format-rupiah';
import { CalculatePrice } from 'src/components/calculatePrice';

// ----------------------------------------------------------------------

export default function TransaksiDetailTableRow({ row }) {
  const { RFID, jenisHewan, kandang, berat, harga } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const accessToken = sessionStorage.getItem('accessToken');

  return (
    <>
      <TableRow hover>
        <TableCell>{RFID}</TableCell>
        <TableCell>{jenisHewan || ''}</TableCell>
        <TableCell>{row.expand.kandang.namaKandang || ''}</TableCell>
        <TableCell>{berat || ''} Kg</TableCell>
        <TableCell>{fCurrency(CalculatePrice(row.berat))}</TableCell>
      </TableRow>
    </>
  );
}

TransaksiDetailTableRow.propTypes = {
  row: PropTypes.object,
};
