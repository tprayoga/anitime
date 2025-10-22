'use client';

import React, { useCallback, useState } from 'react';

import { _roles, _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { Box, Button, Card, Container, Grid, MenuItem, Stack, Typography } from '@mui/material';
import FormProvider from 'src/components/hook-form/form-provider';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const statusOptions = [
  { value: 'pakan', label: 'Pemberian Pakan' },
  { value: 'surveilans', label: 'Surveilans Penyakit' },
];

export default function DetailTernakView({ id }) {
  const settings = useSettingsContext();

  console.log(id);
  const popover = usePopover();

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <AnitimeBreadcrumbs
          links={[{ name: 'Data Ternak', href: paths.domba.ternak.root }, { name: id }]}
          action={
            <Stack spacing={2} direction={'row'}>
              <Button
                color="primary"
                variant="contained"
                endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                onClick={popover.onOpen}
              >
                Rekam Aktivitas
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="ic:baseline-edit" />}
                disabled
              >
                Edit
              </Button>
            </Stack>
          }
        />

        <Grid container spacing={3} marginTop={2}>
          <Grid xs={12} md={4} item>
            <Stack spacing={3}>
              <Card>
                <Box sx={{ pl: 2, py: 0.5, backgroundColor: '#DBE9FC' }}>
                  <Button
                    startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                    variant={'text'}
                    color="inherit"
                    size="large"
                    sx={{ fontSize: 17 }}
                  >
                    Informasi Dasar
                  </Button>
                </Box>
                <Stack sx={{ p: 2, pl: 6 }} spacing={1}>
                  <Typography fontSize={14}>Jenis Hewan : Domba</Typography>
                  <Typography fontSize={14}>Sertifikat SNI : {id.split('-')[0]}</Typography>
                  <Typography fontSize={14}>Lokasi Kandang : Kandang 1</Typography>
                  <Typography fontSize={14}>Jenis Kelamin : Jantan</Typography>
                  <Typography fontSize={14}>Breed Hewan : Domba Garut</Typography>
                </Stack>
              </Card>

              <Card>
                <Box sx={{ pl: 2, py: 0.5, backgroundColor: '#F9FCDB' }}>
                  <Button
                    startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                    variant={'text'}
                    color="inherit"
                    size="large"
                    sx={{ fontSize: 17 }}
                  >
                    Informasi Kelahiran
                  </Button>
                </Box>
                <Stack sx={{ p: 2, pl: 6 }} spacing={1}>
                  <Typography fontSize={14}>Umur : 1 Tahun 3 Bulan</Typography>
                  <Typography fontSize={14}>Tanggal Lahir : 29 Juli 2023</Typography>
                  <Typography fontSize={14}>Berat : 25 Kg</Typography>
                  <Typography fontSize={14}>Asal : Pangalengan</Typography>
                </Stack>
              </Card>
            </Stack>
          </Grid>

          <Grid xs={12} md={8} item>
            <Card sx={{ minHeight: '60vh', p: 3 }}>
              <Stack direction={'row'} spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#E3F8FF', color: 'text.primary', px: 2 }}
                >
                  Aktivitas
                </Button>
                {/* 
                <DatePicker
                  value={currentDate}
                  format="dd-MM-yyyy"
                  onChange={(date) => setCurrentDate(date)}
                /> */}
                <Iconify icon="material-symbols:mail" color="text.secondary" />
                <Typography fontSize={16} color="text.secondary">
                  29 Juli 2023
                </Typography>
                <Typography fontSize={16} fontWeight="bold">
                  Berat 25 kg
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="top-right">
        {statusOptions.map((option, index) => (
          <MenuItem
            key={option.value}
            // selected={option.value === status}
            onClick={() => {
              popover.onClose();
            }}
            divider={index !== statusOptions.length - 1}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
