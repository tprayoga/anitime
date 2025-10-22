import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import {
  Button,
  Collapse,
  Divider,
  IconButton,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableHead,
  Typography,
  alpha,
} from '@mui/material';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import CustomDialog from 'src/components/custom-dialog/custom-dialog';
import { fDate } from 'src/utils/format-time';
import { DataGrid } from '@mui/x-data-grid';
import { sortedLastIndexBy } from 'lodash';

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
  onConfirm,
  onClickedFirstColumn,
  customeTableRow,
  keys,
  listPopovers = [],
  //
  loadingDelete,
  onDeleteRow,
  disabledDelete,
}) {
  const popover = usePopover();
  const confirm = useBoolean();
  const permintaan = useBoolean();
  const [konfirmasiState, setKonfirmasiState] = useState('');

  const { expand, jenisBreed, jumlah, berat, dueDate, status } = row;
  const { ternak = [], createdBy: wholesaler } = expand;

  const [dataReview, setDataReview] = useState(
    ternak?.map((item) => ({
      id: item.id,
      state: false,
    }))
  );

  const [finalReview, setFinalReview] = useState([]);

  const updateReview = (id) => {
    setDataReview((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, state: !obj.state } : obj))
    );
  };

  const displayReview = (id) => {
    const data = dataReview.filter((item) => item.id === id);
    return data[0]?.state;
  };

  const statusInclude = ['Ditunda', 'Ditinjau', 'Diterima'];

  const collapse = useBoolean();

  const hitungWaktu = (hari) => {
    const tahun = Math.floor(hari / 365);
    const sisaHari = hari % 365;
    const bulan = Math.floor(sisaHari / 30);
    const hariSisa = sisaHari % 30;

    return `${tahun ? `${tahun} Tahun` : ''} ${bulan ? `${bulan} Bulan` : ''} ${
      hariSisa ? `${hariSisa} Hari` : ''
    }`;
  };

  const columns = [
    {
      field: 'id',
      headerName: 'No',
      align: 'center',
      headerAlign: 'center',
      width: 80,
      renderCell: (params) => `${params?.row?.no}`,
    },
    {
      field: 'RFID',
      headerName: 'RFID',
      flex: 1,
    },
    {
      field: 'jenisBreed',
      headerName: 'Jenis Breed',
      flex: 1,
    },
    {
      field: 'jenisKelamin',
      headerName: 'Jenis Kelamin',
      flex: 1,
    },
    {
      field: 'berat',
      headerName: 'Berat',
      flex: 1,
      renderCell: (params) => `${params?.row?.berat} Kg`,
    },
    {
      field: 'kandang',
      headerName: 'Nama Kandang',
      flex: 1,
      renderCell: (params) => `${params?.row?.expand?.kandang?.namaKandang}`,
    },
    {
      field: 'umur',
      headerName: 'Umur',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => `${hitungWaktu(params?.row?.umur)}`,
    },
    {
      field: '',
      headerName: '',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) =>
        row.status === 'Diterima' ? null : (
          <IconButton
            size="small"
            onClick={() => updateReview(params?.row?.id, !params?.row?.state)}
          >
            <Iconify
              icon={
                displayReview(params?.row?.id) ? 'material-symbols:check' : 'mingcute:close-line'
              }
              width={18}
            />
          </IconButton>
        ),
    },
  ];

  useEffect(() => {
    const data = dataReview.filter((item) => item.state === true);
    setFinalReview(data.map((item) => item.id));
  }, [dataReview]);

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
          } else if (key === 'konfirmasi') {
            return (
              <TableCell key={index} align="center">
                {!statusInclude.includes(row.status) ? (
                  <Typography fontSize={12}>Sudah Dikonfirmasi</Typography>
                ) : row.status === 'Ditinjau' || row.status === 'Diterima' ? (
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
                    <Iconify
                      icon={
                        collapse.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                      }
                    />
                  </IconButton>
                ) : (
                  <Stack direction={'row'} gap={1}>
                    <Button
                      startIcon={<Iconify icon="material-symbols:check" />}
                      variant={'soft'}
                      color="success"
                      size="small"
                      width={100}
                      onClick={() => permintaan.onTrue()}
                      onMouseOver={() => {
                        setKonfirmasiState('Diterima');
                      }}
                    >
                      Terima
                    </Button>

                    <Button
                      startIcon={<Iconify icon="charm:cross" />}
                      variant={'soft'}
                      color="error"
                      size="small"
                      width={100}
                      onClick={() => {
                        permintaan.onTrue();
                      }}
                      onMouseOver={() => setKonfirmasiState('Ditolak')}
                    >
                      Tolak
                    </Button>
                  </Stack>
                )}
              </TableCell>
            );
          } else {
            const findCustomeTableRow = customeTableRow?.find((item) => item.key === key);

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

      {ternak?.length > 0 && (
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

                <DataGrid
                  columns={columns}
                  rows={ternak?.map((item, index) => ({
                    ...item,
                    no: index + 1,
                  }))}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  disableMultipleRowSelection
                  disableColumnMenu
                />

                {row?.status === 'Ditinjau' && (
                  <Stack m={2} direction={'row'} justifyContent="flex-end" gap={1}>
                    <Button
                      startIcon={<Iconify icon="material-symbols:check" />}
                      variant={'soft'}
                      color="success"
                      size="small"
                      width={100}
                      onClick={() => permintaan.onTrue()}
                      onMouseOver={() => {
                        setKonfirmasiState('Diterima');
                      }}
                    >
                      {finalReview?.length ? `Proses Kembali` : `Terima`}
                    </Button>

                    <Button
                      startIcon={<Iconify icon="charm:cross" />}
                      variant={'soft'}
                      color="error"
                      size="small"
                      width={100}
                      onClick={() => {
                        if (finalReview?.length) {
                          setDataReview(
                            ternak?.map((item) => ({
                              id: item.id,
                              state: false,
                            }))
                          );
                          setFinalReview([]);
                        } else {
                          permintaan.onTrue();
                        }
                      }}
                      onMouseOver={() => setKonfirmasiState('Ditolak')}
                    >
                      {finalReview?.length ? `Undo` : `Tolak`}
                    </Button>
                  </Stack>
                )}
              </Paper>
            </Collapse>
          </TableCell>
        </TableRow>
      )}

      <CustomDialog
        open={permintaan.value}
        onClose={permintaan.onFalse}
        title="Konfirmasi"
        cancelButton={'Tidak'}
        content={`Apakah anda yakin untuk ${
          konfirmasiState === 'Diterima' && !finalReview?.length
            ? 'menerima'
            : finalReview?.length
              ? 'memproses kembali'
              : 'menolak'
        } permintaan ini?`}
        action={
          <Button
            variant="contained"
            color={konfirmasiState === 'Diterima' ? 'success' : 'error'}
            onClick={() =>
              onConfirm(
                row.id,
                row.status === 'Ditunda' && konfirmasiState === 'Diterima'
                  ? 'Diproses'
                  : konfirmasiState === 'Diterima' && finalReview?.length
                    ? 'Diproses'
                    : konfirmasiState,
                finalReview?.length ? finalReview : null,
                ternak,
                wholesaler
              )
            }
          >
            Ya
          </Button>
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
