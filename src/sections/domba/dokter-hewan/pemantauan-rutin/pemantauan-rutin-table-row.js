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
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function PemantauanRutinTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  refetch,
}) {
  const { id, anamnesis, expand, asesmen, plan } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const accessToken = sessionStorage.getItem('accessToken');

  return (
    <>
      <TableRow
        hover
        sx={{
          '& > *': {
            typography: 'caption',
            textTransform: 'capitalize',
          },
        }}
        selected={selected}
      >
        <TableCell
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
            typography: 'caption',
            textDecoration: 'none',
          }}
          href={`${paths.dombaDokterHewan.pemantauanRutin.detail(id)}`}
          component={RouterLink}
        >
          {expand?.ternak?.noFID}
        </TableCell>
        <TableCell>
          {expand?.ternak?.expand?.kandang?.namaKandang} {expand?.ternak?.expand?.pen?.namaPen}
        </TableCell>
        <TableCell>{expand.ternak.jenisHewan}</TableCell>
        <TableCell>{anamnesis}</TableCell>
        <TableCell>{asesmen}</TableCell>
        <TableCell>{plan}</TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete database ${name}?`}
        action={
          <LoadingButton variant="contained" color="error">
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}

PemantauanRutinTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
