'use client';
import {
  Card,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Box, Container, Stack } from '@mui/system';
import { Fragment, useEffect } from 'react';
import RHFDatePicker from 'src/components/hook-form/rhf-datepicker';
import { useSettingsContext } from 'src/components/settings';
import { DashboardView } from 'src/sections/overview/dashboard/view';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { FormatRupiah } from '@arismun/format-rupiah';
import { fCurrency, fNumber } from 'src/utils/format-number';
import Scrollbar from 'src/components/scrollbar';
import { be } from 'date-fns/locale';
// ----------------------------------------------------------------------

const data = {
  income: [
    {
      name: 'Sales Of Live Stock',
      value: 50000000,
    },
  ],
  expenses: [
    {
      name: 'Purchase of Feeding',
      value: 5000000,
    },
  ],
};

export default function TableLaporanTahunanWidget() {
  const settings = useSettingsContext();

  const schema = Yup.object().shape({
    startDate: Yup.date().required('Tanggal Awal harus diisi'),
    endDate: Yup.date().required('Tanggal Akhir harus diisi'),
  });

  const defaultValues = {
    startDate: null,
    endDate: null,
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  const dataTable = [
    {
      bulan: 'Januari',
      dataOne: [
        {
          id: 'import',
          ekor: 270,
          berat: 567.8,
          harga: 123000000,
        },
        {
          id: 'trading',
          ekor: 270,
          berat: 567.8,
          harga: 123000000,
        },
        {
          id: 'total',
          ekor: 270,
          berat: 567.8,
          harga: 123000000,
        },
      ],
      dataTwo: [
        {
          id: 'berat',
          import: 567.8,
          trading: 567.8,
        },
        {
          id: 'harga',
          import: 56000,
          trading: 56000,
        },
      ],
    },
    {
      bulan: 'Februari',
      dataOne: [
        {
          id: 'import',
          ekor: 270,
          berat: 567.8,
          harga: 123000000,
        },
        {
          id: 'trading',
          ekor: 270,
          berat: 567.8,
          harga: 123000000,
        },
        {
          id: 'total',
          ekor: 270,
          berat: 567.8,
          harga: 123000000,
        },
      ],
      dataTwo: [
        {
          id: 'berat',
          import: 567.8,
          trading: 567.8,
        },
        {
          id: 'harga',
          import: 56000,
          trading: 56000,
        },
      ],
    },
  ];

  let totalImportEkor = 0;
  let totalImportBerat = 0;
  let totalImportHarga = 0;

  let totalTradingEkor = 0;
  let totalTradingBerat = 0;
  let totalTradingHarga = 0;

  let totalTotalEkor = 0;
  let totalTotalBerat = 0;
  let totalTotalHarga = 0;

  let totalBeratImport = 0;
  let totalBeratTrading = 0;
  let totalHargaImport = 0;
  let totalHargaTrading = 0;

  dataTable.forEach((monthData) => {
    monthData.dataOne.forEach((entry) => {
      if (entry.id === 'import') {
        totalImportEkor += entry.ekor;
        totalImportBerat += entry.berat;
        totalImportHarga += entry.harga;
      } else if (entry.id === 'trading') {
        totalTradingEkor += entry.ekor;
        totalTradingBerat += entry.berat;
        totalTradingHarga += entry.harga;
      } else if (entry.id === 'total') {
        totalTotalEkor += entry.ekor;
        totalTotalBerat += entry.berat;
        totalTotalHarga += entry.harga;
      }
    });

    monthData.dataTwo.forEach((entry) => {
      if (entry.id === 'berat') {
        totalBeratImport += entry.import;
        totalBeratTrading += entry.trading;
      } else if (entry.id === 'harga') {
        totalHargaImport += entry.import;
        totalHargaTrading += entry.trading;
      }
    });
  });

  const summary = {
    dataOne: [
      { id: 'import', ekor: totalImportEkor, berat: totalImportBerat, harga: totalImportHarga },
      { id: 'trading', ekor: totalTradingEkor, berat: totalTradingBerat, harga: totalTradingHarga },
      { id: 'total', ekor: totalTotalEkor, berat: totalTotalBerat, harga: totalTotalHarga },
    ],
    dataTwo: [
      { id: 'berat', import: totalBeratImport, trading: totalBeratTrading },
      { id: 'harga', import: totalHargaImport, trading: totalHargaTrading },
    ],
  };

  return (
    <Card sx={{ py: 2, px: 3, height: '100%', overflow: 'auto' }}>
      <Stack flexDirection={'row'} spacing={2} justifyContent="space-between" alignItems="center">
        <Typography typography="h4">Laporan Tahunan Penjualan Trading Sapi</Typography>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack flexDirection={'row'} spacing={2} my={3}>
            <RHFDatePicker views={['year']} name="startDate" label="Pilih Tahun" />
          </Stack>
        </FormProvider>
      </Stack>

      <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
        <Scrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">No</TableCell>
                <TableCell align="center">Bulan</TableCell>
                <TableCell colSpan={3} align="center">
                  Import
                </TableCell>
                <TableCell colSpan={3} align="center">
                  Trading
                </TableCell>
                <TableCell colSpan={3} align="center">
                  Total
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Berat Jual Rerata
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Harga Jual Rerata
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2} />
                <TableCell>Ekor</TableCell>
                <TableCell>Berat</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Ekor</TableCell>
                <TableCell>Berat</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Ekor</TableCell>
                <TableCell>Berat</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Import</TableCell>
                <TableCell>Trading</TableCell>
                <TableCell>Import</TableCell>
                <TableCell>Trading</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dataTable?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{row.bulan}</TableCell>

                  {row.dataOne.map((item, index) => (
                    <Fragment key={index}>
                      <TableCell>{item.ekor}</TableCell>
                      <TableCell>{item.berat} Kg</TableCell>
                      <TableCell>{fCurrency(item.harga)}</TableCell>
                    </Fragment>
                  ))}

                  {row.dataTwo.map((item, index) => (
                    <Fragment key={index}>
                      <TableCell>
                        {item.id === 'berat' ? `${item.import} Kg` : fCurrency(item.import)}
                      </TableCell>
                      <TableCell>
                        {item.id === 'berat' ? `${item.trading} Kg` : fCurrency(item.trading)}
                      </TableCell>
                    </Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>

            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center">
                  Jumlah
                </TableCell>

                {summary.dataOne.map((item, index) => (
                  <Fragment key={index}>
                    <TableCell>{item.ekor}</TableCell>
                    <TableCell>{item.berat} Kg</TableCell>
                    <TableCell>{fCurrency(item.harga)}</TableCell>
                  </Fragment>
                ))}

                {summary.dataTwo.map((item, index) => (
                  <Fragment key={index}>
                    <TableCell>
                      {item.id === 'berat' ? `${item.import} Kg` : fCurrency(item.import)}
                    </TableCell>
                    <TableCell>
                      {item.id === 'berat' ? `${item.trading} Kg` : fCurrency(item.trading)}
                    </TableCell>
                  </Fragment>
                ))}
              </TableRow>
            </TableHead>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}
