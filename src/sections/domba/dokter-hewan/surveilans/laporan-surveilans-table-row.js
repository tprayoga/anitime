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
import { Fragment, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { FormatRupiah } from '@arismun/format-rupiah';
import { fDate, fTime } from 'src/utils/format-time';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

export default function LaporanSurveilansTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  refetch,
}) {
  const { id, RFID, tanggal, gejalaMuncul, perkiraanWaktu, lokasi, status, expand, created } = row;

  const confirm = useBoolean();
  const router = useRouter();
  const popover = usePopover();

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{
          '& > *': {
            typography: 'caption',
            textTransform: 'capitalize',
          },
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
            textDecoration: 'none',
          }}
          href={`${paths.dombaDokterHewan.surveilans.laporanSurveilans.detail(id)}`}
          component={RouterLink}
        >
          {expand?.ternak?.noFID}
        </TableCell>
        <TableCell>
          {fDate(created)} {fTime(created)}
        </TableCell>
        <TableCell
          sx={{
            maxWidth: 200,
            typography: 'caption',
          }}
        >
          {gejalaMuncul?.map((data, index) => (
            <Fragment key={index}>
              {index === gejalaMuncul.length - 1 ? <span>{data}</span> : <span>{data}, </span>}
            </Fragment>
          ))}
        </TableCell>
        <TableCell>{fDate(perkiraanWaktu)}</TableCell>
        <TableCell>
          {expand?.ternak?.expand?.kandang?.namaKandang} {expand?.ternak?.expand?.pen?.namaPen}
        </TableCell>
        <TableCell>
          {status === 'Evaluasi' && (
            <Label variant="soft" color={'info'}>
              Evaluasi
            </Label>
          )}
          {status === 'Pending' && (
            <Label variant="soft" color={'warning'}>
              Pending
            </Label>
          )}
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
          // component={RouterLink}
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
        content={`Are you sure want to delete  ?`}
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

LaporanSurveilansTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
