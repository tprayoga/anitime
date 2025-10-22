'use client';

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Checkbox, IconButton, MenuItem } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify/iconify';
import { useAuthContext } from 'src/auth/hooks';
import { useEditUser, useCreateUser } from 'src/api/domba/manage-user';

// ----------------------------------------------------------------------

export default function ManageNewEditForm({ currentUser }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { user, register } = useAuthContext();

  const { dataUser, loadingUser, editUser } = useEditUser();
  const { dataUser: dataCreate, loadingUser: loadingCreate, createUser } = useCreateUser();

  const [pass, setPass] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const password = useBoolean();
  const confirmPassword = useBoolean();
  const oldPassword = useBoolean();

  const adminToken = sessionStorage.getItem('adminToken');

  const UserSchema = Yup.object().shape({
    role: Yup.string().required('Role harus diisi'),
    name: Yup.string().required('Nama harus diisi'),
    email: Yup.string().required('Email harus diisi').email('Email harus valid'),
    nik: Yup.number()
      .required('NIK harus diisi')
      .integer('NIK harus berupa angka')
      .positive('NIK harus berupa angka positif')
      .test('len', 'NIK harus terdiri dari 16 digit', (val) => val.toString().length === 16),
    phone: Yup.string()
      .required('Nomor Handphone harus diisi')
      .min(9, 'Nomor handphone minimal terdiri dari 9 digit'),
    password: currentUser ? Yup.string() : Yup.string().required('Password harus diisi'),
  });

  const UserPasswordSchema = Yup.object().shape({
    role: Yup.string().required('Role harus diisi'),
    name: Yup.string().required('Nama harus diisi'),
    email: Yup.string().required('Email harus diisi').email('Email harus valid'),
    nik: Yup.number()
      .required('NIK harus diisi')
      .integer('NIK harus berupa angka')
      .positive('NIK harus berupa angka positif')
      .test('len', 'NIK harus terdiri dari 16 digit', (val) => val.toString().length === 16),
    phone: Yup.string()
      .required('Nomor Handphone harus diisi')
      .min(9, 'Nomor handphone minimal terdiri dari 9 digit'),
    password: Yup.string().required('Password harus diisi'),
    confirmPassword: Yup.string()
      .required('Konfirmasi Password harus diisi')
      .oneOf([Yup.ref('password'), null], 'Password tidak sama'),
  });

  const defaultValues = useMemo(
    () => ({
      role: currentUser?.role || '',
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      nik: currentUser?.nik || 0,
      phone: currentUser?.phone || 0,
      password: '',
      confirmPassword: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(pass ? UserPasswordSchema : UserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
  } = methods;

  const values = watch();

  const generateRandomNumber = () => {
    let randomNumber = Math.floor(Math.random() * 90000000) + 10000000;
    return parseInt(`${randomNumber}00000`);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (currentUser) {
      const formData = {
        name: values.name,
        nik: values.nik,
        phone: values.phone,
      };

      if (values.name !== user.name || values.phone !== user.phone || values.nik !== user.nik) {
        if (pass) {
          await editUser(
            currentUser?.id,
            {
              password: values.password,
              passwordConfirm: values.confirmPassword,
            },
            adminToken
          )
            .then(() => {
              enqueueSnackbar('Update Success', { variant: 'success' });
            })
            .catch((err) => {
              console.log(err);
              enqueueSnackbar('Update Failed', { variant: 'error' });
            });
        }

        await editUser(currentUser?.id, formData, adminToken)
          .then(() => {
            enqueueSnackbar('Update Success', { variant: 'success' });
          })
          .catch((error) => {
            console.log(error);
            enqueueSnackbar(
              error?.email
                ? 'Email Sudah Digunakan'
                : error?.nik
                  ? 'NIK Sudah Digunakan'
                  : error?.nib
                    ? 'NIB Sudah Digunakan'
                    : typeof error === 'string'
                      ? error
                      : error?.message,
              { variant: 'error' }
            );
          });
      } else {
        if (pass) {
          try {
            await editUser(
              currentUser?.id,
              {
                password: values.password,
                passwordConfirm: values.confirmPassword,
              },
              adminToken
            );
            enqueueSnackbar('Update Success', { variant: 'success' });
          } catch (error) {
            console.log(error);
            enqueueSnackbar(
              error?.email
                ? 'Email Sudah Digunakan'
                : error?.nik
                  ? 'NIK Sudah Digunakan'
                  : error?.nib
                    ? 'NIB Sudah Digunakan'
                    : typeof error === 'string'
                      ? error
                      : error?.message,
              { variant: 'error' }
            );
          }
        } else {
          enqueueSnackbar('Nothing to change', { variant: 'info' });
        }
      }
    } else {
      setLoadingRegister(true);

      try {
        await createUser?.('users', {
          name: values.name,
          email: values.email,
          phone: values.phone,
          nik: values.nik,
          nib: Date.now(),
          role: values.role,
          address: user.address,
          createdBy: user.id,
          password: values.password,
          passwordConfirm: values.password,
        });
        enqueueSnackbar('Create User Success', { variant: 'success' });
        setLoadingRegister(false);
        router.push(paths.dombaIntiPeternakan.manageUser.root);
      } catch (error) {
        console.log(error);
        enqueueSnackbar(
          error?.email
            ? 'Email Sudah Digunakan'
            : error?.nik
              ? 'NIK Sudah Digunakan'
              : error?.nib
                ? 'NIB Sudah Digunakan'
                : typeof error === 'string'
                  ? error
                  : error?.message,
          { variant: 'error' }
        );
        setLoadingRegister(false);
      }
    }
  });

  // const onSubmit = handleSubmit(async (data) => {
  //   console.log(data);
  // });

  const RegistrationOption = [
    { value: 'intiAnakKandang', label: 'Anak Kandang' },
    { value: 'intiFinance', label: 'Finance' },
    { value: 'intiDokterHewan', label: 'Dokter Hewan' },
  ];

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Informasi User
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Masukan informasi user
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFSelect
              name="role"
              label="Registrasi Sebagai : "
              sx={{
                width: 1,
              }}
              disabled={currentUser}
            >
              <Divider sx={{ borderStyle: 'dashed' }} />
              {RegistrationOption.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField name="name" label="Nama" />
            <RHFTextField name="email" label="Email" disabled={currentUser} />
            <RHFTextField
              type="number"
              name="phone"
              label="Nomor Handphone"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 1 }}>
                    <Typography variant="subtitle2">+62 </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <RHFTextField type="number" name="nik" label="NIK (Nomor Kependudukan)" />

            {!currentUser ? (
              <>
                <RHFTextField
                  name="password"
                  label="Password"
                  type={password.value ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={password.onToggle} edge="end">
                          <Iconify
                            icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            ) : (
              <>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography>Change Password</Typography>
                  <Checkbox size="medium" onChange={() => setPass(!pass)} />
                </Stack>

                <RHFTextField
                  name="password"
                  label="Password Baru"
                  disabled={!pass}
                  type={password.value ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={password.onToggle} edge="end">
                          <Iconify
                            icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <RHFTextField
                  name="confirmPassword"
                  label="Konfirmasi Password Baru"
                  disabled={!pass}
                  type={confirmPassword.value ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={confirmPassword.onToggle} edge="end">
                          <Iconify
                            icon={
                              confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
      >
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={loadingUser || loadingCreate}
        >
          {!currentUser ? 'Buat' : 'Simpan Perubahan'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ManageNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
