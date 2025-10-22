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

import UserQuickEditForm from './permintaan-quick-edit-form';
import { Stack } from '@mui/material';
import { useState } from 'react';
import CustomDialog from 'src/components/custom-dialog/custom-dialog';
import { useDeleteData, useUpdateData } from 'src/api/custom-api';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function PermintaanTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, category, fetch, setRefetch }) {
  const { id, jenisBreed, berat, jumlah, status, konfirmasi } = row;

  const [konfirmasiState, setKonfirmasiState] = useState('');

  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const popover = usePopover();

  const { enqueueSnackbar } = useSnackbar();

  const { loading, error, updateData } = useUpdateData();

  const handleUpdate = async () => {

    if (konfirmasiState === 'diterima') {

      const body = {
        ...row,
        status: 'Diproses'
      }
      try {

        await updateData(id, body, 'permintaanTernak')
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });

      } finally {
        confirm.onFalse();
        setRefetch((x) => !x);
        fetch();
      }
    } else {
      const body = {
        ...row,
        status: 'Ditolak'
      }
      try {

        await updateData(id, body, 'permintaanTernak')
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });

      } finally {
        confirm.onFalse();
        setRefetch((x) => !x);
        fetch();
      }
    }
  }


  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{jenisBreed}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{berat} kg</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{jumlah}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'Diterima' && 'success') ||
              (status === 'Ditunda' && 'warning') ||
              (status === 'Ditolak' && 'error') ||
              (status === 'Diproses' && 'info') 
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>

          {category === 'Request' ? (
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
                Proses
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
          ) : ''}
        </TableCell>
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
        content={`
          Apakah anda yakin untuk ${konfirmasiState === 'diterima' ? 'menerima' : 'menolak'} permintaan ini?`
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleUpdate}
          >
            Ya
          </Button>
        }
      />
    </>
  );
}

PermintaanTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
