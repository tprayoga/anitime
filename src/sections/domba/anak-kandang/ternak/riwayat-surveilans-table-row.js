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
import { fDate, fTime } from 'src/utils/format-time';
import { useDeleteTernak } from 'src/api/anak-kandang/ternak';

// ----------------------------------------------------------------------

export default function RiwayatSurveilansTableRow({ row }) {
  const { created, perkiraanWaktu, gejalaMuncul } = row;

  const confirm = useBoolean();

  const popover = usePopover();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { deleteTernak, isSubmitting } = useDeleteTernak();

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
        <TableCell>{fDate(created)}</TableCell>
        <TableCell>
          {fDate(perkiraanWaktu)} {fTime(perkiraanWaktu)}
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
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
    </>
  );
}

RiwayatSurveilansTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
