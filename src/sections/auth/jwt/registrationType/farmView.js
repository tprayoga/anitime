import { useCallback, useState } from 'react';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { MAPBOX_API } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { Button, Card, CardContent } from '@mui/material';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
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

export default function FarmView({ setValue, data }) {
  const { control } = useFormContext();
  const password = useBoolean();

  const [farmerFile, setFarmerFile] = useState(null);
  const [farmFile, setFarmFile] = useState(null);

  const handleChangeFile = (e, setFile) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    // Check if the file size is within the allowed limit (2 MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 2 MB
    if (file.size > maxSizeInBytes) {
      alert('File size exceeds the maximum limit of 5 MB');
      e.target.value = null; // Reset the input
      setFile(null); // Clear the file state
      return;
    }

    setValue(name, file);
    setFile({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const renderFile = useCallback(
    ({ file, preview }, setFile) => {
      return (
        <Stack
          direction="row"
          alignItems="center"
          width={1}
          justifyContent="space-between"
          sx={{
            py: 1,
            pl: 2,
            border: (theme) => `1px dashed ${theme.palette.text.disabled}`,
            borderRadius: 1,
            backgroundColor: 'background.neutral',
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold" noWrap>
            <Link href={preview} target="_blank" variant="subtitle2">
              {file.name.length > 10 ? `${file.name.slice(0, 10)}...` : file.name}
            </Link>
          </Typography>
          <IconButton
            onClick={() => {
              console.log('clicked');
              // setValue(name, null); // Reset the input
              setFile(null);
            }}
          >
            <Iconify icon="mdi:close" />
          </IconButton>
        </Stack>
      );
    },
    [farmFile, farmerFile]
  );

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="start">
        <RHFTextField name="email" label="Email" />
        <Stack width={1}>
          <RHFTextField name="name" label="Nama Peternak" />
        </Stack>
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
        <RHFTextField type="number" name="nik" label="NIK (Nomor Kependudukan)" />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Stack width={1}>
          <RHFTextField fullWidth name="farmName" label="Nama Peternakan" />
        </Stack>
        <RHFTextField type="number" name="nib" label="NIB (Nomor Induk Berusaha)" />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="address" label="Alamat Peternakan" />
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
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Stack flex={1} spacing={2} sx={{ overflow: 'hidden' }}>
          {farmFile && renderFile(farmFile, setFarmFile)}

          <label htmlFor="farm-sertification" style={{ width: '100%' }}>
            <input
              id="farm-sertification"
              name="farmCertification"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                handleChangeFile(e, setFarmFile);
              }}
              accept="image/*,application/pdf"
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<Iconify icon="ion:attach" width={20} />}
              fullWidth
              sx={{
                paddingY: 1.8,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                Sertifikat Peternakan <span style={{ opacity: 0.5 }}>(opsional)</span>
              </Typography>
            </Button>
          </label>
        </Stack>
        <Stack flex={1} spacing={2} sx={{ overflow: 'hidden' }}>
          {farmerFile && renderFile(farmerFile, setFarmerFile)}
          <label htmlFor="farmer-sertification" style={{ width: '100%' }}>
            <input
              id="farmer-sertification"
              name="farmerCertification"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                handleChangeFile(e, setFarmerFile);
              }}
              accept="image/*,application/pdf"
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<Iconify icon="ion:attach" width={20} />}
              fullWidth
              sx={{
                paddingY: 1.8,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" noWrap>
                Sertifikat Peternak <span style={{ opacity: 0.5 }}>(opsional)</span>
              </Typography>
            </Button>
          </label>
        </Stack>
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
