import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
// utils
import { fCurrency } from 'src/utils/format-number';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { LoadingButton } from '@mui/lab';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function RiwayatTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  refetch,
}) {
  const { id, created, jumlah, status, tujuan, lokasiTujuan, expand, namaPen, jenisPen, jenisHewan, deskripsi } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{
          '& > *': {
            typography: 'caption',
          }
        }}
      >
        <TableCell>{namaPen}</TableCell>
        <TableCell>{jenisPen}</TableCell>
        <TableCell>{jenisHewan}</TableCell>
        <TableCell>{deskripsi}</TableCell>

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
          onClick={() => {
            popover.onClose();
          }}
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
        content={`Are you sure want to delete database ${name}?`}
        action={
          <LoadingButton
            variant="contained"
            color="error"
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}

RiwayatTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
