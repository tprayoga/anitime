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

// ----------------------------------------------------------------------

export default function UserTableRow({ row, selected, rowIndex }) {
  const { jenisTernak, berat, jumlahPermintaan, status, konfirmasi } = row;

  const [konfirmasiState, setKonfirmasiState] = useState('');

  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{rowIndex}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{jenisTernak}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{berat}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{jumlahPermintaan}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === 'Diterima' && 'success') ||
              (status === 'Diproses' && 'warning') ||
              (status === 'Ditolak' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        {/* <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          {konfirmasi || status == 'Diterima' ? (
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

      <CustomDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Konfirmasi"
        cancelButton={'Tidak'}
        content={`Apakah anda yakin untuk ${
          konfirmasiState === 'Diterima' ? 'menerima' : 'menolak'
        } permintaan ini?`}
        action={
          <Button
            variant="contained"
            color={konfirmasiState === 'Diterima' ? 'success' : 'error'}
            // onClick={onDeleteRow}
          >
            Ya
          </Button>
        }
      />
    </>
  );
}

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
