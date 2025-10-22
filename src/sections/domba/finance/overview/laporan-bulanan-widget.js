'use client';
import { Card, Divider, Typography } from '@mui/material';
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
import { fNumber } from 'src/utils/format-number';
import Scrollbar from 'src/components/scrollbar';
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

export default function LaporanBulananWidget() {
  const settings = useSettingsContext();

  const schema = Yup.object().shape({
    startDate: Yup.date().required('Tanggal Awal haru diisi'),
    endDate: Yup.date().required('Tanggal Akhir haru diisi'),
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

  const dataOverview = [
    {
      title: 'Total Ekor',
      value: 2016,
      satuan: '',
    },
    {
      title: 'Jumlah Ekor',
      value: 67,
      satuan: '/Hari',
    },
    {
      title: 'Total Berat',
      value: 1017276,
      satuan: 'Kg',
    },
    {
      title: 'Berat Rerata',
      value: 505,
      satuan: 'Kg/Ekor',
    },
    {
      title: 'Harga Rerata',
      value: 52118,
      satuan: '/Kg',
    },
  ];

  const elmnt = document.getElementById('laporan-bulanan')?.offsetWidth;

  const layoutColumns = (el) => {
    if (elmnt < 700) {
      return 'repeat(1, 1fr)';
    } else if (elmnt < 1000) {
      return 'repeat(3, 1fr)';
    } else {
      return 'repeat(5, 1fr)';
    }
  };

  return (
    <Box id="laporan-bulanan" sx={{ height: '100%', overflow: 'auto' }}>
      <Scrollbar>
        <Stack spacing={3}>
          <Card sx={{ py: 2, px: 3 }}>
            <Stack
              flexDirection={'row'}
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography typography="h4">Laporan Bulanan Mutasi Penjualan Sapi</Typography>

              <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack flexDirection={'row'} spacing={2} my={3}>
                  <RHFDatePicker views={['month']} name="startDate" label="Pilih Bulan" />
                </Stack>
              </FormProvider>
            </Stack>
          </Card>

          {elmnt < 700 ? (
            <Card sx={{ height: '100%', py: 2 }}>
              <Box
                rowGap={3}
                gap={3}
                display="grid"
                alignItems="center"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                }}
              >
                {dataOverview.map((item, index) => (
                  <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }} spacing={2}>
                    <Typography typography="h5" sx={{ fontWeight: 'normal' }}>
                      {item.title}
                    </Typography>
                    <Typography typography="h3">
                      {fNumber(item.value)}
                      {item.satuan && (
                        <span
                          style={{ fontSize: 16, fontWeigth: 'normal' }}
                        >{` ${item.satuan}`}</span>
                      )}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            </Card>
          ) : (
            <Box
              rowGap={3}
              gap={3}
              display="grid"
              alignItems="center"
              gridTemplateColumns={{
                xs: layoutColumns(),
              }}
            >
              {dataOverview.map((item, index) => (
                <Card>
                  <Stack justifyContent="center" alignItems="center" sx={{ py: 2 }} spacing={2}>
                    <Typography typography="h5" sx={{ fontWeight: 'normal' }}>
                      {item.title}
                    </Typography>
                    <Typography typography="h3">
                      {fNumber(item.value)}
                      {item.satuan && (
                        <span
                          style={{ fontSize: 16, fontWeigth: 'normal' }}
                        >{` ${item.satuan}`}</span>
                      )}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </Box>
          )}
        </Stack>
      </Scrollbar>
    </Box>
  );
}
