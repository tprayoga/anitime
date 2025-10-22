import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { Card, CardContent, TextField, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import dynamic from 'next/dynamic';
import { MAPBOX_API } from 'src/config-global';
import { Controller, useFormContext } from 'react-hook-form';

const MapDraggableMarkers = dynamic(() => import('../map'));

const StyledMapContainer = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 360,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

const baseSettings = {
  mapboxAccessToken: MAPBOX_API,
  minZoom: 1,
};

// veterinarian
export default function DokterHewanView({ setValue, data }) {
  const { control } = useFormContext();
  const password = useBoolean();

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="email" label="Email" />
        <RHFTextField name="name" label="Nama Dokter Hewan" />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField
          name="password"
          label="Password"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField type="number" name="nik" maxLength={16} label="NIK (Nomor Kependudukan)" />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField
          type="number"
          name="phone"
          label="Nomor Handphone"
          InputProps={{
            startAdornment: (
              <InputAdornment sx={{ mr: 1 }}>
                <Typography variant="subtitle2">+62 </Typography>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField name="license" label="Surat Izin Praktik" />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="address" label="Alamat Kantor" multiline rows={4} />
      </Stack>

      <Controller
        name="location"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Card
            sx={
              error && {
                border: (theme) => `1px solid ${theme.palette.error.main}`,
              }
            }
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="start">
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Farm Location Tag
                </Typography>
                <Tooltip title="Double click to set location" placement="top">
                  <IconButton>
                    <Iconify icon="mdi:information-outline" width={16} color="text.secondary" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <StyledMapContainer>
                <MapDraggableMarkers
                  {...baseSettings}
                  name="location"
                  setValue={setValue}
                  lon={data.location.longitude}
                  lat={data.location.latitude}
                />
              </StyledMapContainer>
              <Typography variant="body2" color="error" paddingTop={2}>
                {error?.message}
              </Typography>
            </CardContent>
          </Card>
        )}
      />
    </Stack>
  );
}
