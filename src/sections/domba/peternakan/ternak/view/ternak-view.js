'use client';

import uuidv4 from 'src/utils/uuidv4';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import DataGridAnitime from 'src/components/dataGridAnitime';
import { useGetData } from 'src/api/custom-domba-api';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useDebounce } from 'src/hooks/use-debounce';
import { TablePaginationCustom } from 'src/components/table';
import { paths } from 'src/routes/paths';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function TernakView() {
  const { user } = useAuthContext();

  const {
    data: dataTernak,
    loading: loadingTernak,
    totalData: totalTernak,
    getData: getTernak,
  } = useGetData();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [dataGridTable, setDataGridTable] = useState({
    page: 0,
    pageSize: 5,
    orderBy: '',
    order: 'desc',
    filter: '',
  });

  const onDataGridChange = (page) => {
    setDataGridTable({ ...dataGridTable, ...page });
  };

  const hitungUmur = (lahir) => {
    let date1 = new Date(lahir);
    let date2 = new Date(Date.now());

    let Difference_In_Time = date2.getTime() - date1.getTime();
    let hari = Math.round(Difference_In_Time / (1000 * 3600 * 24));

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
      field: 'no',
      headerName: 'No',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      hideable: false,
      sortable: false,
    },
    {
      field: 'noFID',
      headerName: 'No FID',
      flex: 1,
      minWidth: 200,
      hideable: false,
      renderCell: (params) => (
        <Typography
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
            typography: 'caption',
            py: 2,
          }}
          onClick={() => {
            user.role === 'peternakan'
              ? window.open(`${paths.dombaPeternakan.ternak.detail(params?.row?.id)}`, '_blank')
              : window.open(
                  `${paths.dombaIntiPeternakan.ternak.detail(params?.row?.id)}`,
                  '_blank'
                );
          }}
        >
          {params?.row?.noFID}
        </Typography>
      ),
    },
    {
      field: 'jenisHewan',
      headerName: 'Jenis Hewan',
      flex: 1,
    },
    {
      field: 'jenisBreed',
      headerName: 'Breed',
      flex: 1,
    },
    {
      field: 'jenisKelamin',
      headerName: 'Jenis Kelamin',
      flex: 1,
    },
    {
      field: 'umur',
      headerName: 'Umur',
      minWidth: 200,
      renderCell: (params) => `${hitungUmur(params?.row?.tanggalLahir)}`,
    },
    {
      field: 'berat',
      headerName: 'Berat',
      flex: 1,
      renderCell: (params) => `${params?.row?.berat} Kg`,
    },
    {
      field: 'kandang',
      headerName: 'Kandang',
      flex: 1,
      renderCell: (params) => `${params?.row?.expand?.pen?.expand?.kandang?.namaKandang}`,
    },
    {
      field: 'kondisi',
      headerName: 'Kondisi',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        const score = params?.row?.expand?.bodyConditionalScore?.score;
        const status = params?.row?.expand?.bodyConditionalScore?.name;

        return (
          <Label variant="soft" color={score <= 2 ? 'error' : score === 3 ? 'warning' : 'success'}>
            {status}
          </Label>
        );
      },
    },
  ];

  const options = () => {
    return {
      filter: `pen.kandang.peternakan = "${user?.id}" ${
        dataGridTable?.filter
          ? `&& (noFID ~ "${dataGridTable?.filter}"
            || jenisHewan ~ "${dataGridTable?.filter}"
            || jenisKelamin ~ "${dataGridTable?.filter}"
            || jenisBreed ~ "${dataGridTable?.filter}"
            || berat ~ "${dataGridTable?.filter}"
            || tanggalLahir ~ "${dataGridTable?.filter}"
            || asalPeternakan ~ "${dataGridTable?.filter}"
            || bodyConditionalScore.name ~ "${dataGridTable?.filter}"
            || bodyFatScore.name ~ "${dataGridTable?.filter}"
            || pen.kandang.namaKandang ~ "${dataGridTable?.filter}"
          )`
          : ''
      }`,
      sort: dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      expand: 'pen,pen.kandang,bodyConditionalScore',
    };
  };

  useEffect(() => {
    setTableData(dataTernak.map((item, index) => ({ ...item, no: index + 1 })));
  }, [dataTernak]);

  useEffect(() => {
    setDataGridTable({ ...dataGridTable, page: 0 });

    getTernak(
      1,
      dataGridTable?.rowsPerPage,
      options()?.filter,
      options()?.sort,
      'ternak',
      options()?.expand
    );
  }, [dataGridTable?.filter]);

  useEffect(() => {
    getTernak(
      dataGridTable?.page + 1,
      dataGridTable?.rowsPerPage,
      options()?.filter,
      options()?.sort,
      'ternak',
      options()?.expand
    );
  }, [dataGridTable?.page, dataGridTable?.pageSize, dataGridTable?.order, dataGridTable?.orderBy]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card>
            <Stack
              spacing={2}
              direction={{ xs: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'center' }}
            >
              <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                Data Ternak
              </Typography>
            </Stack>

            <DataGridAnitime
              data={tableData}
              columns={columns}
              table={dataGridTable}
              totalData={totalTernak}
              loading={loadingTernak}
              onDataGridChange={onDataGridChange}
              disableRowSelectionOnClick
              disableColumnMenu
              disableMultipleRowSelection
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
