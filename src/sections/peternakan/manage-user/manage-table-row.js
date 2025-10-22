import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { first } from 'lodash';
import { Chip, Stack, Typography } from '@mui/material';
import { it } from 'date-fns/locale';
//
// import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

export default function ManageTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  loadingDelete,
  currentTab,
  currentAdmin,
}) {
  const { name, avatar, role, email, id, collectionId } = row;

  const URL = `${process.env.NEXT_PUBLIC_DATABASE_PATH}/api/`;
  const avatarUrl = `${URL}files/${collectionId}/${id}/${avatar}?token=`;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const roleConvert = (role) => {
    if (role === 'anakKandang') {
      return 'Anak Kandang';
    } else if (role === 'dokterHewan') {
      return 'Dokter Hewan';
    } else {
      return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatar ? avatarUrl : ''} sx={{ mr: 2 }} />

          {/* <ListItemText
            primary={`${firstName} ${lastName}`}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          /> */}
          <Typography>{name}</Typography>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{roleConvert(role)}</TableCell>

        <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
          component={RouterLink}
          href={paths.peternakan.manageUser.edit(id)}
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
        content="Are you sure want to delete?"
        action={
          <Button
            disabled={loadingDelete}
            variant="contained"
            color="error"
            onClick={() =>
              currentTab === 'user' ? onDeleteRow(username, company) : onDeleteRow(id)
            }
          >
            {loadingDelete ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}

ManageTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
