import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Fragment, useEffect } from 'react';
import { fDate, fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function PermintaanTernakTableRow({
  row,
  selected,
}) {
  const { perkiraanWaktu, expand, created, gejalaMuncul } = row;

  return (
    <>
      <TableRow
        hover
        selected={selected}
        sx={{
          '& > *': {
            typography: 'caption',
          }
        }}
      >

        <TableCell
        >
          {expand?.ternak?.RFID}
        </TableCell>
        <TableCell>{fDate(created)} {fTime(created)}</TableCell>
        <TableCell>
          {gejalaMuncul.map((data, index) => (
            <Fragment key={index}>
              {index === gejalaMuncul.length - 1 ? (
                <span>{data}</span>
              ) : (
                <span>&nbsp;{data}, </span>
              )}
            </Fragment>
          ))}
        </TableCell>
        <TableCell>{fDate(perkiraanWaktu)} {fTime(perkiraanWaktu)}</TableCell>
        <TableCell>{expand.ternak.expand.kandang.namaKandang}</TableCell>
      </TableRow>


    </>
  );
}

PermintaanTernakTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
