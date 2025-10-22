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

// ----------------------------------------------------------------------

export default function HistoryImportRow({
    row,
    selected,
    count,
    onSelectRow,
    onDeleteRow,
    onEditRow,
    onViewRow,
    refetch,
}) {
    const { id, status, messages, data } = row;

    const confirm = useBoolean();

    const popover = usePopover();

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const accessToken = sessionStorage.getItem('accessToken');

    return (
        <>
            <TableRow
                hover

            >

                <TableCell
                    sx={{ cursor: 'pointer' }}
                    selected={selected}
                    onClick={() => {
                        window.open(`${paths.anakKandang.ternak.detail(id)}`, '_blank');
                    }}
                >
                    #{count}
                </TableCell>

                <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>
                    <Label variant="soft" color={status.toLowerCase() === 'sukses' ? 'success' : status.toLowerCase() === 'gagal' ? 'error' : 'warning'}>
                        {status}
                    </Label>
                </TableCell>
                <TableCell>{messages}</TableCell>
                <TableCell sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '250px'
                }}>
                    {JSON.stringify(data)}
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
                        // submitConnection();
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

HistoryImportRow.propTypes = {
    onDeleteRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onViewRow: PropTypes.func,
    row: PropTypes.object,
    selected: PropTypes.bool,
};
