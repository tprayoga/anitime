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

export default function LaluLintasTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  refetch,
  openModal,
  setSelectedData,
  setType
}) {
  const { id, sertifikat, petugas, tujuan, expand, lokasiTujuan } = row;


  const confirm = useBoolean();

  const popover = usePopover();


  const handleClickEdit = () => {
    popover.onClose();
    setSelectedData(row);
    setType('EDIT');
    openModal.onTrue();
  }

  return (
    <>
      <TableRow
        hover
        sx={{
          '& > *': {
            typography: 'caption',
          }
        }}
      >

        <TableCell
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
            typography: 'caption',
          }}
          selected={selected}
          onClick={() => {
            window.location.replace(`${paths.anakKandang.laluLintas.detail(id)}`, '_blank');
          }}
        >
          {expand?.ternak?.RFID}
        </TableCell>
        <TableCell>{expand?.kandang?.namaKandang}</TableCell>
        <TableCell>{sertifikat ? sertifikat : 'Tidak ada'}</TableCell>
        <TableCell>{petugas}</TableCell>
        <TableCell>{tujuan}</TableCell>
        <TableCell>{lokasiTujuan}</TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >

        <MenuItem
          onClick={handleClickEdit}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${expand?.ternak?.RFID}?`}
        action={
          <LoadingButton
            variant="contained"
            color="error"
          // loading={loadingDelete}
          // onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}

LaluLintasTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
