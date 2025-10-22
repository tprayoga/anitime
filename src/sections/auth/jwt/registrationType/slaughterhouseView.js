import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { TextField } from '@mui/material';

export default function SlaughterHouseView(props) {
  const password = useBoolean();

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="SlaughterName" label="Nama Rumah Potong Hewa" />
        <RHFTextField name="phone" label="Phone Number" />
        {/* <RHFTextField name="sertificateFarmer" label="Farm Certification" /> */}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="email" label="Email" />
        <RHFTextField name="nameStaff" label="Nama Petugas RPH" />
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
        <RHFTextField type="number" name="totalStaff" label="Jumlah Petugas" />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField type="number" name="nik" label="National ID Number (NIK)" />
        <RHFTextField type="number" name="controlNumber" label="Nomor Kontrol Veteriner" />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField variant="outlined" rows={4} fullWidth multiline label="Alamat" name="address" />
      </Stack>
    </Stack>
  );
}
