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
import { useDeleteTernak } from 'src/api/anak-kandang/ternak';

// ----------------------------------------------------------------------

export default function TernakTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  setRefetch,
}) {
  const {
    id,
    jenisHewan,
    jenisBreed,
    jenisKelamin,
    tanggalLahir,
    umur,
    berat,
    kandang,
    status,
    bodyConditionalScore,
    expand,
    RFID,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { deleteTernak, isSubmitting } = useDeleteTernak();

  const accessToken = sessionStorage.getItem('accessToken');

  const substringBCS = (string) => {
    const score = parseInt(string.substr(0, 1));
    if (score >= 4) return 'Baik';
    if (score >= 3) return 'Cukup';
    if (score >= 1) return 'Buruk';
  };

  const handleDelete = async () => {
    try {
      await deleteTernak(id);
      enqueueSnackbar('Success', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed', { variant: 'error' });
    } finally {
      popover.onClose();
      confirm.onFalse();
      setRefetch((x) => !x);
    }
  };

  const calculateAge = () => {
    if (tanggalLahir) {
      const dateOfBirth = new Date(tanggalLahir);
      const today = new Date();

      const ageDiffInMilliseconds = today - dateOfBirth;

      const ageDiffInSeconds = ageDiffInMilliseconds / 1000;

      const ageYears = Math.floor(ageDiffInSeconds / (365.25 * 24 * 60 * 60));
      const ageMonths = Math.floor(
        (ageDiffInSeconds % (365.25 * 24 * 60 * 60)) / (30.44 * 24 * 60 * 60)
      );
      const ageDays = Math.floor((ageDiffInSeconds % (30.44 * 24 * 60 * 60)) / (24 * 60 * 60));

      // const totalAgeDays = ageYears * 365 + ageMonths * 30 + ageDays;

      return `${ageYears} tahun ${ageMonths} bulan ${ageDays} hari`;

      // return totalAgeDays;
    }
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          '& > *': {
            typography: 'caption',
          },
        }}
      >
        <TableCell
          selected={selected}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
            typography: 'caption',
          }}
          onClick={() => {
            window.location.replace(`${paths.anakKandang.ternak.detail(id)}`, '_blank');
          }}
        >
          {RFID}
        </TableCell>
        <TableCell>{jenisHewan}</TableCell>

        <TableCell>{jenisBreed}</TableCell>
        <TableCell>{jenisKelamin}</TableCell>
        {/* <TableCell>{fDate(tanggalLahir)}</TableCell> */}
        <TableCell>{calculateAge()}</TableCell>
        <TableCell>{berat} kg</TableCell>
        <TableCell>{expand?.kandang?.namaKandang}</TableCell>
        <TableCell>
          <Label
            variant="filled"
            color={
              status === 'aktif'
                ? 'primary'
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
          // onClick={() => {
          //   window.location.replace(`${paths.anakKandang.ternak.edit(id)}`, '_blank');
          // }}
          href={`${paths.anakKandang.ternak.edit(id)}`}
          component={RouterLink}
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
        content={`Are you sure want to delete ternak ${RFID}?`}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={isSubmitting}
            onClick={handleDelete}
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
