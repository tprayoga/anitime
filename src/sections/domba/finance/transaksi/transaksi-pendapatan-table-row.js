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
import { FormatRupiah } from '@arismun/format-rupiah';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function TransaksiPemasukanTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  refetch,
  filters,
}) {
  const {
    id,
    tanggal,
    jenisPemasukan,
    satuanPemasukan,
    jumlahPemasukan,
    nilaiPemasukan,
    jenisPengeluaran,
    satuanPengeluaran,
    jumlahPengeluaran,
    nilaiPengeluaran,
  } = row;

  return (
    <>
      <TableRow
        hover
        sx={{
          '& > *': {
            typography: 'caption',
            textTransform: 'capitalize',
          },
        }}
      >
        <TableCell
          sx={{
            // cursor: 'pointer',
            // '&:hover': {
            //   textDecoration: 'underline',
            //   color: '#00BFFF',
            // },
            typography: 'caption',
            textDecoration: 'none',
          }}
          // onClick={() => {
          //   if (jenisPemasukan === 'Penjualan Ternak')
          //     window.open(`${paths.finance.transaksi.pemasukan(id)}`, '_blank');
          // }}
        >
          {fDate(tanggal)}
        </TableCell>
        <TableCell>{row?.expand?.plasma?.name || '-'}</TableCell>
        <TableCell>{jenisPemasukan}</TableCell>
        <TableCell>
          {jumlahPemasukan} {satuanPemasukan}
        </TableCell>
        <TableCell sx={{ fontWeight: 'medium' }}>
          <FormatRupiah value={nilaiPemasukan} />
        </TableCell>

        <TableCell></TableCell>
      </TableRow>
    </>
  );
}

TransaksiPemasukanTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
