'use client';

import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { MAPBOX_API, PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { Box } from '@mui/system';
import { Button, Card, CardContent, CardHeader, Divider, MenuItem } from '@mui/material';
import Paper from '@mui/material/Paper';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import FarmView from './registrationType/farmView';
import WholeSalerView from './registrationType/wholesalerView';
import DokterHewanView from './registrationType/dokterHewanView';
import SlaughterHouseView from './registrationType/slaughterhouseView';

// ----------------------------------------------------------------------

const RegistrationOption = [
  { value: 'peternakan', label: 'Peternak' },
  { value: 'wholesaler', label: 'Wholesaler' },
  { value: 'dokterHewan', label: 'Dokter Hewan' },
  // { value: 'rumahpotonghewan', label: 'Rumah Potong Hewan' },
];

const RegisterSchema = Yup.object().shape({
  role: Yup.string().required('Registration Type harus diisi'),
});

const defaultValueForm = {
  role: 'peternakan',

  // optional for avoid error
  middlemanAddress: '',
  license: '',
  farmName: '',
};

const defaultValueFormPeternakan = {
  name: '',
  farmerCertification: '',
  farmName: '',
  farmCertification: '',
  email: '',
  password: '',
  nib: 0,
  nik: 0,
  phone: 0,
  address: '',
  location: {
    longitude: '',
    latitude: '',
  },
};

const defaultValueFormWholesaler = {
  name: '',
  phone: 8,
  nik: 0,
  middlemanAddress: '',
  email: '',
  password: '',
  address: '',
};

const defaultValueFormDokterHewan = {
  name: '',
  phone: 8,
  nik: 0,
  license: '',
  email: '',
  password: '',
  address: '',
  location: {
    longitude: '',
    latitude: '',
  },
};

const validationSchemaPeternakan = {
  name: Yup.string().required('Nama Peternakan harus diisi'),
  // farmerCertification: Yup.string().required('Farmer Certification harus diisi'),
  farmName: Yup.string().required('Nama Peternak harus diisi'),
  // farmCertification: Yup.string().required('Farm Certification harus diisi'),
  email: Yup.string().required('Email harus diisi'),
  password: Yup.string().required('Password harus diisi'),
  nib: Yup.number().required('NIB harus diisi').min(1, 'NIB harus diisi'),
  nik: Yup.number()
    .required('NIK harus diisi')
    .integer('NIK harus berupa angka')
    .positive('NIK harus diisi')
    .test('len', 'NIK harus terdiri dari 16 digit', (val) => val.toString().length === 16),
  phone: Yup.number().required('Nomor Handphone harus diisi').min(1, 'Nomor Handphone harus diisi'),
  address: Yup.string().required('Alamat Peternakan harus diisi'),
  location: Yup.object()
    .shape({
      longitude: Yup.string().required('Silahkan masukkan longitude'),
      latitude: Yup.string().required('Silahkan masukkan latitude'),
    })
    .test('location', 'Silahkan pilih lokasi peternakan', function (value) {
      return value && value.longitude && value.latitude;
    }),
};

const validationSchemaWholesaler = {
  name: Yup.string().required('Nama User harus diisi'),
  phone: Yup.number().required('Nomor Handphone harus diisi').min(1, 'Nomor Handphone harus diisi'),
  nik: Yup.number()
    .required('NIK harus diisi')
    .integer('NIK harus berupa angka')
    .positive('NIK harus diisi')
    .test('len', 'NIK harus terdiri dari 16 digit', (val) => val.toString().length === 16),
  middlemanAddress: Yup.string().required('Alamat Tengkulak harus diisi'),
  email: Yup.string().required('Email harus diisi'),
  password: Yup.string().required('Password harus diisi'),
  address: Yup.string().required('Alamat Kantor harus diisi'),
};

const validationSchemaDokterHewan = {
  name: Yup.string().required('Nama Dokter Hewan harus diisi'),
  phone: Yup.number().required('Nomor Handphone harus diisi').min(1, 'Nomor Handphone harus diisi'),
  nik: Yup.number()
    .required('NIK harus diisi')
    .integer('NIK harus berupa angka')
    .positive('NIK harus diisi')
    .test('len', 'NIK harus terdiri dari 16 digit', (val) => val.toString().length === 16),
  license: Yup.string().required('License harus diisi'),
  email: Yup.string().required('Email harus diisi'),
  password: Yup.string().required('Password harus diisi'),
  address: Yup.string().required('Alamat Kantor harus diisi'),
  location: Yup.object()
    .shape({
      longitude: Yup.string().required('Silahkan masukkan longitude'),
      latitude: Yup.string().required('Silahkan masukkan latitude'),
    })
    .test('location', 'Silahkan pilih lokasi praktek dokter hewan', function (value) {
      return value && value.longitude && value.latitude;
    }),
};

export default function JwtRegisterView() {
  const { register } = useAuthContext();

  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState({
    ...defaultValueForm,
    ...defaultValueFormPeternakan,
  });
  const [validationSchema, setValidationSchema] = useState(RegisterSchema);
  const [errorMsg, setErrorMsg] = useState('');

  // console.log(validationSchema);
  // console.log(defaultValues);

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
    setValue,
    watch,
    clearErrors,
  } = methods;

  const value = watch();

  useEffect(() => {
    clearErrors();

    if (value.role === 'peternakan') {
      setDefaultValues({ role: 'peternakan', ...defaultValueFormPeternakan });
      const newValidationSchema = Yup.object().shape({
        ...RegisterSchema.fields,
        ...validationSchemaPeternakan,
      });
      setValidationSchema(newValidationSchema);
    } else if (value.role === 'wholesaler') {
      setDefaultValues({ role: 'wholesaler', ...defaultValueFormWholesaler });
      const newValidationSchema = Yup.object().shape({
        ...RegisterSchema.fields,
        ...validationSchemaWholesaler,
      });
      setValidationSchema(newValidationSchema);
    } else if (value.role === 'dokterHewan') {
      setDefaultValues({ role: 'dokterHewan', ...defaultValueFormDokterHewan });
      const newValidationSchema = Yup.object().shape({
        ...RegisterSchema.fields,
        ...validationSchemaDokterHewan,
      });
      setValidationSchema(newValidationSchema);
    }
  }, [value.role]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.({
        ...data,
        phone: data.phone,
        nib: data.nib <= 1 ? Date.now() : data.nib,
      });
      // router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      // reset();
      const isErrorEmail = error?.email || false;
      const isErrorNib = error?.nib || false;
      const isErrorNik = error?.nik || false;

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      if (isErrorEmail) {
        setErrorMsg('Email sudah terdaftar');
      } else if (isErrorNib) {
        setErrorMsg('NIB sudah digunakan');
      } else if (isErrorNik) {
        setErrorMsg('NIK sudah digunakan');
      } else {
        setErrorMsg(typeof error === 'string' ? error : error?.message);
      }
    }
  });

  const renderHead = (
    <Stack direction="row" alignItems="center" spacing={{ md: 4, xs: 2 }}>
      <Box
        component="img"
        alt="auth"
        src={'/logo/logo_single.png'}
        sx={{
          width: { md: '120px', xs: '80px' },
          height: { md: '120px', xs: '80px' },
        }}
      />

      <Box>
        <Typography
          sx={{
            fontSize: { md: '42px', xs: '30px' },
            fontWeight: '500',
            lineHeight: '60px',
          }}
        >
          Welcome to
        </Typography>
        <Typography
          color="success.main"
          sx={{
            fontSize: { md: '60px', xs: '42px' },
            fontWeight: '900',
            lineHeight: { md: '60px', xs: '30px' },
          }}
        >
          ANITIME
        </Typography>
      </Box>
    </Stack>
  );

  const renderTerms = (
    <Stack marginTop={1.5}>
      <center>
        <Typography variant="body2">
          Sudah mempunyai akun?{' '}
          <span>
            <Link component={RouterLink} href={paths.auth.jwt.login} variant="subtitle2">
              Masuk
            </Link>
          </span>
        </Typography>
      </center>
    </Stack>
  );

  const renderForm = (
    <Stack
      justifyContent="space-between"
      marginTop={6}
      sx={{
        minHeight: 'calc(75vh - 64px)',
        gap: 3,
      }}
    >
      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect
            name="role"
            label="Registrasi Sebagai:"
            sx={{
              // width: { md: 1 / 2, xs: 1 },
              width: 1,
            }}
          >
            <Divider sx={{ borderStyle: 'dashed' }} />
            {RegistrationOption.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>

        {value.role === 'peternakan' ? (
          <FarmView setValue={setValue} data={value} />
        ) : value.role === 'wholesaler' ? (
          <WholeSalerView setValue={setValue} data={value} />
        ) : value.role === 'dokterHewan' ? (
          <DokterHewanView setValue={setValue} data={value} />
        ) : (
          value.role === 'Rumah Potong Hewan' && <SlaughterHouseView />
        )}
      </Stack>

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Daftar
      </LoadingButton>
    </Stack>
  );

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - 64px)`,
        paddingY: 8,
      }}
    >
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ my: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>

      {renderTerms}
    </Box>
  );
}
