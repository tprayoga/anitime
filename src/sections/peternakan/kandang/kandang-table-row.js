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
import useListData from 'src/api/wholesaler/list';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function KandangTableRow({ row, rowIndex, selected }) {
  const { user } = useAuthContext();
  const { id, namaKandang, luasKandang, satuanKandang, ternak } = row;

  const options = (jenisKelamin) => {
    return {
      filter: `kandang = "${id}" && jenisKelamin = "${jenisKelamin}"`,
    };
  };

  const { total: totalJantan, refetch: refetchJantan } = useListData(
    'ternak',
    1,
    5,
    options('Jantan')
  );

  const { total: totalBetina, refetch: refetchBetina } = useListData(
    'ternak',
    1,
    5,
    options('Betina')
  );

  const confirm = useBoolean();

  const popover = usePopover();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const accessToken = sessionStorage.getItem('accessToken');

  const luas = satuanKandang === 'Ha' ? luasKandang / 10000 : luasKandang;

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{rowIndex}</TableCell>

        <TableCell
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
          }}
          onClick={() => {
            window.open(`${paths.peternakan.kandang.detail(id)}`, '_blank');
          }}
        >
          {namaKandang}
        </TableCell>
        <TableCell>{`${totalJantan?.totalItems || 0} Ekor`}</TableCell>
        <TableCell>{`${totalBetina?.totalItems || 0} Ekor`}</TableCell>
        <TableCell>
          {luas} {satuanKandang}
        </TableCell>
        <TableCell>{`${totalJantan?.totalItems + totalBetina?.totalItems || 0} Ekor`}</TableCell>
      </TableRow>
    </>
  );
}

KandangTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
