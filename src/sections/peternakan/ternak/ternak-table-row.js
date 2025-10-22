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
import { fDate } from 'src/utils/format-time';
import { status } from 'nprogress';

// ----------------------------------------------------------------------

export default function TernakTableRow({ row, selected, rowIndex }) {
  const {
    id,
    noFID,
    jenisHewan,
    jenisBreed,
    jenisKelamin,
    tanggalLahir,
    umur,
    berat,
    kandang,
    asalPeternakan,
    status,
    bodyConditionalScore,
    expand,
    RFID,
  } = row;
  const kondisi = 'baik';

  const confirm = useBoolean();

  const popover = usePopover();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const accessToken = sessionStorage.getItem('accessToken');

  const hitungWaktu = (hari) => {
    const tahun = Math.floor(hari / 365);
    const sisaHari = hari % 365;
    const bulan = Math.floor(sisaHari / 30);
    const hariSisa = sisaHari % 30;

    return `${tahun ? `${tahun} Tahun` : ''} ${bulan ? `${bulan} Bulan` : ''} ${
      hariSisa ? `${hariSisa} Hari` : ''
    }`;
  };

  const hitungScore = (score) => {
    const scoreValue = score?.split('(')[0];

    if (scoreValue == 1 || scoreValue == 2) {
      return {
        status: 'Buruk',
        color: 'error',
      };
    } else if (scoreValue == 3) {
      return {
        status: 'Sedang',
        color: 'warning',
      };
    } else {
      return {
        status: 'Baik',
        color: 'success',
      };
    }
  };

  const hasilScore = hitungScore(bodyConditionalScore);

  return (
    <>
      <TableRow
        hover
        onClick={() => {
          window.open(`${paths.peternakan.ternak.detail(id)}`, '_blank');
        }}
      >
        <TableCell
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
          }}
        >
          {RFID}
        </TableCell>
        <TableCell>{jenisHewan}</TableCell>
        <TableCell>{jenisBreed}</TableCell>
        <TableCell>{jenisKelamin}</TableCell>
        <TableCell>{hitungWaktu(umur)}</TableCell>
        <TableCell>{berat} Kg</TableCell>
        <TableCell>{expand?.kandang?.namaKandang}</TableCell>

        <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>
          <Label variant="soft" color={hasilScore?.color}>
            {hasilScore?.status}
          </Label>
        </TableCell>
        <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>
          <Label
            variant="soft"
            color={
              status === 'aktif'
                ? 'success'
                : status === 'proses'
                  ? 'warning'
                  : status === 'terjual'
                    ? 'info'
                    : status === 'mati'
                      ? 'error'
                      : 'default'
            }
          >
            {status}
          </Label>
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
            // window.open(`${paths.dashboard.database.details(name)}`, '_blank');
            submitConnection();
          }}
          // component={RouterLink}
          // href={paths.dashboard.database.details(name)}
        >
          <Iconify icon="mdi:connection" />
          Test Connection
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          component={RouterLink}
          // href={paths.dashboard.database.edit(id)}
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

TernakTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
