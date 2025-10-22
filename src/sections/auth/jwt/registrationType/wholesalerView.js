import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { TextField, Typography } from '@mui/material';

export default function WholeSalerView(props) {
  const password = useBoolean();

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="email" label="Email" />
        <RHFTextField name="name" label="Nama User" />
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
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="address" label="Alamat Kantor" multiline rows={4} />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="middlemanAddress" label="Alamat Tengkulak" multiline rows={4} />
      </Stack>
    </Stack>
  );
}
