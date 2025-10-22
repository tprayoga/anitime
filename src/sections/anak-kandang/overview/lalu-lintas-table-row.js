import PropTypes from 'prop-types';
import { paths } from 'src/routes/paths';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';


// ----------------------------------------------------------------------

export default function LaluLintasTableRow({
  row,
  selected,
}) {
  const { id, sertifikat, petugas, tujuan, expand, lokasiTujuan } = row;

  return (
    <>
      <TableRow
        hover
        sx={{
          '& > *': {
            typography: 'caption',
          }
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
          }}
          selected={selected}
          onClick={() => {
            window.location.replace(`${paths.anakKandang.laluLintas.detail(id)}`, '_blank');
          }}
        >
          {expand?.ternak?.RFID}
        </TableCell>
        <TableCell>{expand?.kandang?.namaKandang}</TableCell>
        <TableCell>{sertifikat ? sertifikat : 'Tidak ada'}</TableCell>
        <TableCell>{petugas}</TableCell>
        <TableCell>{tujuan}</TableCell>

      </TableRow>

    </>
  );
}

LaluLintasTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
