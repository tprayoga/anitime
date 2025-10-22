'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email/Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.email, data.password);

      //   router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Box sx={{ mb: 2, display: 'flex', textAlign: 'left', position: 'relative' }}>
      <Box
        component="img"
        alt="auth"
        src={'/logo/logo_single.png'}
        sx={{
          maxWidth: {
            xs: 100,
            lg: 100,
            xl: 100,
          },
          maxHeight: {
            xs: 100,
            lg: 100,
            xl: 100,
          },
        }}
        marginRight={5}
      />

      <Box>
        <Typography variant="h3" color="#292560">
          Welcome to
        </Typography>

        <Typography variant="h2" color="#16C36C">
          ANITIME
        </Typography>
      </Box>
    </Box>
  );

  const renderBody = (
    <Stack spacing={1} sx={{ textAlign: 'left', mb: 3 }}>
      <Box>
        <Typography textAlign="justify">
          Mengadopsi revolusi dalam manajemen peternakan yang melampaui praktik tradisional,
          menawarkan solusi komprehensif untuk mengawasi setiap aspek peternakan sapi Anda dengan
          mudah.
        </Typography>
      </Box>
      <Box>
        <Typography variant="h3" color="#292560">
          Get Started
        </Typography>
      </Box>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Email" />

      <RHFTextField
        name="password"
        label="Kata Sandi"
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

      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Masuk
      </LoadingButton>

      <Stack>
        <center>
          <Typography variant="body2">
            Belum mempunyai akun?{' '}
            <span>
              <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
                Daftar disini
              </Link>
            </span>
          </Typography>
        </center>
      </Stack>
    </Stack>
  );

  return (
    <center>
      <Container maxWidth="sm">
        <Box
          sx={{
            height: '100vh',
            paddingTop: 8,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {renderHead}

          {/* <Alert severity="info" sx={{ mb: 3 }}>
          Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
        </Alert> */}

          {renderBody}

          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}

          <FormProvider methods={methods} onSubmit={onSubmit}>
            {renderForm}
          </FormProvider>
        </Box>
      </Container>
    </center>
  );
}
