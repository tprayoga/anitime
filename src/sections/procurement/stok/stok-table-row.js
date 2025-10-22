import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import UserQuickEditForm from './stok-quick-edit-form';
import { Stack } from '@mui/material';
import { useState } from 'react';
import CustomDialog from 'src/components/custom-dialog/custom-dialog';

// ----------------------------------------------------------------------

export default function StokTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  keys = [],
}) {
  const { tipe, jumlahStok, kategori } = row;

  const [konfirmasiState, setKonfirmasiState] = useState('');

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {keys.map((key, index) => (
          <TableCell key={index} sx={{ whiteSpace: 'nowrap' }}>
            {row[key]}
          </TableCell>
        ))}

        {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />

          <ListItemText
            primary={name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell> */}

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{tipe}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{jumlahStok}</TableCell> */}

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{jumlahPermintaan}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'diterima' && 'success') ||
              (status === 'ditunda' && 'warning') ||
              (status === 'ditolak' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell> */}

        {/* <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>

          {konfirmasi ? (
            'Sudah Dikonfirmasi'
          ) : (
            <Stack direction={'row'} gap={1}>
              <Button
                startIcon={<Iconify icon="material-symbols:check" />}
                variant={'soft'}
                color="success"
                size="small"
                width={100}
                onClick={() => confirm.onTrue()}
                onMouseOver={() => setKonfirmasiState('diterima')}
              >
                Terima
              </Button>

              <Button
                startIcon={<Iconify icon="charm:cross" />}
                variant={'soft'}
                color="error"
                size="small"
                width={100}
                onClick={() => confirm.onTrue()}
                onMouseOver={() => setKonfirmasiState('ditolak')}
              >
                Tolak
              </Button>
            </Stack>
          )}
        </TableCell> */}
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={confirm.onFalse} />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <CustomDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Konfirmasi"
        cancelButton={'Tidak'}
        content={`Apakah anda yakin untuk ${
          konfirmasiState === 'diterima' ? 'menerima' : 'menolak'
        } permintaan ini?`}
        action={
          <Button
            variant="contained"
            color="error"
            // onClick={onDeleteRow}
          >
            Ya
          </Button>
        }
      />
    </>
  );
}

StokTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
