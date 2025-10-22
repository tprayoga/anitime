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
import { Fragment, useEffect, useMemo } from 'react';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/navigation';
import { useGetData, useGetFulLData } from 'src/api/custom-api';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function RiwayatBirahiTableRow({ row, selected }) {
  const { id, created, gejalaBirahi, limitKandang, satuanKandang, ternak, expand } = row;

  const confirm = useBoolean();
  const router = useRouter();
  const popover = usePopover();
  const { getFullData: getDataJantan, data: dataJantan } = useGetFulLData();
  const { getFullData: getDataBetina, data: dataBetina } = useGetFulLData();

  const handleClickEdit = () => {
    openModal.onTrue();
    setSelectedData(row);
    setType('EDIT');
    popover.onClose();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
            typography: 'caption',
          }}
          onClick={() => {
            router.push(`${paths.anakKandang.kandang.detail(id)}`);
          }}
        >
          {fDate(created)}
        </TableCell>
        <TableCell
          sx={{
            maxWidth: 200,
            typography: 'caption',
          }}
        >
          {gejalaBirahi?.map((data, index) => (
            <Fragment key={index}>
              {index === gejalaBirahi.length - 1 ? <span>{data}</span> : <span>{data}, </span>}
            </Fragment>
          ))}
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem onClick={handleClickEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${id} ?`}
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

RiwayatBirahiTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
