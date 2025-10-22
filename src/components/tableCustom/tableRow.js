import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { Divider, IconButton, MenuItem, Typography } from '@mui/material';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------
const getValueByStringKey = (object, text) => {
  const keys = text.split('.');
  let value = object;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};

export default function TableRows({
  row,
  selected,
  onSelectRow,
  onClickedFirstColumn,
  customeTableRow = [],
  keys,
  listPopovers = [],
  //
  loadingDelete,
  onDeleteRow,
  disabledDelete,
}) {
  const popover = usePopover();
  const confirm = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        {!disabledDelete && (
          <TableCell padding="checkbox">
            <Checkbox checked={selected} onClick={onSelectRow} />
          </TableCell>
        )}

        {keys.map((key, index) => {
          if (onClickedFirstColumn && index === 0) {
            return (
              <TableCell key={index} onClick={() => onClickedFirstColumn(row)}>
                <Typography
                  variant="body2"
                  fontWeight="600"
                  textTransform="capitalize"
                  noWrap
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {getValueByStringKey(row, key) ?? '-'}
                </Typography>
              </TableCell>
            );
          } else if (key === 'popover') {
            return (
              <TableCell key={index} align="right">
                <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </TableCell>
            );
          } else {
            const findCustomeTableRow = customeTableRow.find((item) => item.key === key);

            if (findCustomeTableRow) {
              return (
                <TableCell key={index}>
                  {findCustomeTableRow.props(getValueByStringKey(row, key))}
                </TableCell>
              );
            } else {
              return (
                <TableCell key={index}>
                  <Typography variant="caption" textTransform="capitalize" noWrap>
                    {getValueByStringKey(row, key) ?? '-'}
                  </Typography>
                </TableCell>
              );
            }
          }
        })}
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        {listPopovers.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick(row);
              popover.onClose();
            }}
            disabled={item.disabled}
            sx={item.sx}
          >
            <Iconify icon={item.icon} />
            {item.title}
          </MenuItem>
        ))}
        {listPopovers.length > 0 && !disabledDelete && <Divider />}
        {!disabledDelete && (
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
        )}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete?`}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={loadingDelete}
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}

TableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onClickedFirstColumn: PropTypes.func,
  customeTableRow: PropTypes.arrayOf(PropTypes.object),
  keys: PropTypes.array,
};
