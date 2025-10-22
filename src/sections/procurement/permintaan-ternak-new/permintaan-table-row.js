import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Table, TableBody, TableHead, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function PermintaanTableRow({ row, selected, onCreateTernak }) {
  const { expand, jenisBreed, jumlah, berat, dueDate, status } = row;
  const { ternak = [], createdBy: wholesaler } = expand;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={wholesaler.name} src={wholesaler.avatar} sx={{ mr: 2 }} />

        <ListItemText
          primary={wholesaler.name}
          secondary={wholesaler.email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <Box
        // onClick={onViewRow}
        // sx={{
        //   cursor: 'pointer',
        //   '&:hover': {
        //     textDecoration: 'underline',
        //   },
        // }}
        >
          {jenisBreed}
        </Box>
      </TableCell>

      <TableCell align="center">
        {/* <ListItemText
          primary={fDate(createdAt)}
          secondary={fTime(createdAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        /> */}
        {berat} Kg
      </TableCell>

      <TableCell align="center"> {jumlah} Ekor </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(dueDate)}
          // secondary={fTime(createdAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'Ditunda' && 'warning') ||
            (status === 'Diproses' && 'info') ||
            (status === 'Ditinjau' && 'secondary') ||
            (status === 'Diterima' && 'success') ||
            (status === 'Ditolak' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          disabled={!ternak.length}
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton
          disabled={status !== 'Diproses'}
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse in={collapse.value} sx={{ bgcolor: 'background.neutral' }}>
          <Paper
            variant="outlined"
            sx={{
              py: 2,
              m: 1,
              borderRadius: 1.5,
              ...(collapse.value && {
                boxShadow: (theme) => theme.customShadows.z20,
              }),
            }}
          >
            <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
              Rincian Ternak
            </Typography>

            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>RFID</TableCell>
                  <TableCell>Berat</TableCell>
                  <TableCell>Kandang</TableCell>
                  <TableCell>Tanggal Lahir</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {ternak.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}
                    >
                      {item.RFID}
                    </TableCell>
                    <TableCell sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}>
                      {item.berat} Kg
                    </TableCell>
                    <TableCell sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}>
                      {item.expand.kandang.namaKandang}
                    </TableCell>
                    <TableCell sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}>
                      <ListItemText
                        primary={fDate(item.tanggalLahir)}
                        // secondary={fTime(item.tanggalLahir)}
                        primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                        secondaryTypographyProps={{
                          mt: 0.5,
                          component: 'span',
                          typography: 'caption',
                        }}
                        sx={{ color: item.isDeclined ? 'error.main' : 'primary' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {ternak.length > 0 ? renderSecondary : null}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ minWidth: 140 }}
      >
        {status === 'Diproses' && (
          <MenuItem
            onClick={() => {
              onCreateTernak(row);
              popover.onClose();
            }}
          >
            <Iconify icon="material-symbols:add-notes-outline" />
            Input Data Ternak
          </MenuItem>
        )}

        {/* <MenuItem
          onClick={() => {
            // onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem> */}
      </CustomPopover>
    </>
  );
}

PermintaanTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onCreateTernak: PropTypes.func,
};
