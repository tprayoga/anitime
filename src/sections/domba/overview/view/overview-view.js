'use client';

import { useCallback, useMemo, useState } from 'react';

import { _roles, _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { Button, Card, CardHeader, Container, Grid, Stack, Typography } from '@mui/material';
import Label from 'src/components/label';
import TableAnitime from '../../components/tableAnitime';
import { formatToRupiah } from 'src/sections/wholesaler/components/convertToIdr';
import CardOverview from '../../components/cardOverview';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { fDateTime } from 'src/utils/format-time';
import useListAllData from 'src/api/wholesaler/listAll';
import { useAuthContext } from 'src/auth/hooks';
import { Box } from '@mui/system';
import ChartLine from 'src/sections/_examples/extra/chart-view/chart-line';
import ScatterChartView from '../scatter-chart-view';
import FCRScatterChartView from '../fcr-scatter-chart-view';

// ----------------------------------------------------------------------

// id must same with field name in database

const TABLE_HEAD_PETERNAKAN_PLASMA = [
  {
    id: 'namaPeternakan',
    label: 'Nama Peternakan',
  },
  {
    id: 'jumlahKandang',
    label: 'Jumlah Kandang',
  },
  {
    id: 'jumlahTernak',
    label: 'Jumlah Ternak',
  },
  {
    id: 'typePeternakan',
    label: 'Type Peternakan',
  },
];

const TABLE_HEAD_PAKAN = [
  {
    id: 'tipePakan',
    label: 'Tipe Pakan',
  },
  {
    id: 'jumlahStock',
    label: 'Jumlah Stock',
  },
];

const defaultPValuePeternakaPlasma = [
  {
    namaPeternakan: 'Peternakan1',
    jumlahKandang: 10,
    jumlahTernak: 300,
    typePeternakan: 'Fattening',
  },
  {
    namaPeternakan: 'Peternakan2',
    jumlahKandang: 20,
    jumlahTernak: 500,
    typePeternakan: 'Breeding',
  },
];

const defaultPValuePakan = [
  {
    tipePakan: 'Rumput Gajah',
    jumlahStock: '50 kg',
  },
  {
    tipePakan: 'Rumput Benggala',
    jumlahStock: '50 kg',
  },
];

const defaultValuesCard = [
  {
    title: 'Total Ternak',
    value: 99,
  },
  {
    title: 'Total Kandang',
    value: 2,
  },
  {
    title: 'Total Pakan',
    value: ' Kg',
  },
  // {
  //   title: 'Total Peternakan Plasma',
  //   value: 50,
  // },
];

// ----------------------------------------------------------------------

export default function DombaOverview() {
  const settings = useSettingsContext();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={4}>
          <Grid container columns={12} spacing={{ xs: 1, md: 2, xl: 4 }}>
            {defaultValuesCard.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <CardOverview title={item.title} total={item.value} />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom>
            Analisis Pertumbuhan ADG
          </Typography>
          <Card sx={{ width: '100%' }}>
            <CardHeader />
            <Box sx={{ mx: 3 }}>
              <ScatterChartView />
            </Box>
          </Card>

          <Typography variant="h5" gutterBottom>
            Analisis FCR (Feed Conversion Rate)
          </Typography>
          <Card sx={{ width: '100%' }}>
            <CardHeader />
            <Box sx={{ mx: 3 }}>
              <FCRScatterChartView />
            </Box>
          </Card>

          <Typography variant="h5" gutterBottom mt={4}>
            Analisis Pertumbuhan Operasional Cost dan Estimasi Harga Jual Ternak
          </Typography>
          <Card sx={{ width: '100%' }}>
            <CardHeader />
            <Box sx={{ mx: 3 }}>
              <ChartLine
                series={[
                  {
                    name: 'Operasional Costs',
                    data: [38400000, 41200000, 49000000],
                  },
                  {
                    name: 'Harga Jual',
                    data: [120000000, 140000000, 180000000],
                  },
                ]}
              />
            </Box>
          </Card>

          {/* <TableAnitime
            label="Peternakan Plasma"
            tableHead={TABLE_HEAD_PETERNAKAN_PLASMA}
            dataRows={defaultPValuePeternakaPlasma}
            disabledDelete
            customeTableRow={[
              {
                key: 'jumlahTernak',
                props: (value) => (
                  <Typography variant="caption" fontWeight="bold">
                    {value}
                  </Typography>
                ),
              },
            ]}
          />

          <TableAnitime
            label="Stock Pakan"
            tableHead={TABLE_HEAD_PAKAN}
            dataRows={defaultPValuePakan}
            disabledDelete
            customeTableRow={[
              {
                key: 'jumlahStock',
                props: (value) => (
                  <Typography variant="caption" fontWeight="bold">
                    {value}
                  </Typography>
                ),
              },
            ]}
          /> */}
        </Stack>
      </Container>
    </>
  );
}
