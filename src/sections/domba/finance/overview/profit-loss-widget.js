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

export default function ProfitLossWidget() {
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

  return (
    <Card sx={{ py: 2, px: 3, m: 0, height: '100%', overflow: 'auto' }}>
      <Scrollbar>
        <Typography typography="h4">Profit And Lost Statement</Typography>

        <FormProvider methods={methods} onSubmit={onSubmit} sx={{ mb: 5 }}>
          <Stack flexDirection={'row'} spacing={2} my={3}>
            <RHFDatePicker name="startDate" label="Start Date" />
            <RHFDatePicker name="endDate" label="End Date" />
          </Stack>
        </FormProvider>

        {Object.entries(data).map(([key, value]) => (
          <Fragment key={key}>
            <Typography sx={{ textTransform: 'uppercase', mt: 3 }}>{key}</Typography>
            <Divider sx={{ my: 1 }} />
            {value.map((item, index) => (
              <>
                <Stack
                  key={index}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  sx={{ py: 1, px: 2 }}
                >
                  <Typography>{item.name}</Typography>
                  <Typography>
                    <FormatRupiah value={item.value} />
                  </Typography>
                </Stack>
                <Stack
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  mt={2}
                  sx={{ backgroundColor: '#F7F9FB', p: 2 }}
                >
                  <Typography>TOTAL INCOME</Typography>
                  <Typography>
                    <FormatRupiah value={item.value} />
                  </Typography>
                </Stack>
              </>
            ))}
          </Fragment>
        ))}
        <Box
          sx={{
            backgroundColor: '#9DC1E4',
            p: 2,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
          }}
        >
          <Stack flexDirection={'row'} justifyContent={'space-between'}>
            <Typography sx={{ color: 'common.white' }}>Net Profit</Typography>
            <Typography sx={{ color: 'common.white' }}>Rp. 45.000.000</Typography>
          </Stack>
        </Box>
      </Scrollbar>
    </Card>
  );
}
