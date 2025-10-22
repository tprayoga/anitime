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
import { FormatRupiah } from '@arismun/format-rupiah';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function TransaksiPengeluaranTableRow({
    row,
    selected,
    onSelectRow,
    onDeleteRow,
    onEditRow,
    onViewRow,
    refetch,
    filters,
}) {
    const { id, tanggal,created, jenisPengeluaran, satuanPengeluaran, jumlahPengeluaran, nilaiPengeluaran } = row;


    return (
        <>
            <TableRow hover selected={selected}>
                {/* <TableCell padding="checkbox">
                    <Checkbox checked={selected} onClick={onSelectRow} />
                </TableCell> */}

                <TableCell
                    sx={{
                        cursor: 'pointer',
                        '&:hover': {
                            textDecoration: 'underline',
                            color: '#00BFFF',
                        },
                    }}
                >
                    {fDate(created)}
                </TableCell>
                <TableCell>{jenisPengeluaran}</TableCell>
                <TableCell>{jumlahPengeluaran} {satuanPengeluaran}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>
                    <FormatRupiah value={nilaiPengeluaran} />
                </TableCell>


                <TableCell align="right">

                </TableCell>
            </TableRow>
        </>
    );
}

TransaksiPengeluaranTableRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onViewRow: PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};
