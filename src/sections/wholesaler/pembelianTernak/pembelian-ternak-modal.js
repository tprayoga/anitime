import ModalWholesaler from '../components/modal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, IconButton, InputAdornment, Link, Stack, Typography } from '@mui/material';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import Iconify from 'src/components/iconify';
import { useCallback, useState } from 'react';

const defaultValues = {
  RFID: '',
  berat: '',
  idKandang: '',
  metodePengiriman: '',
  idPeternakan: '',
  ternak: '',
  lokasiTujuan: '',
  sertifikat: '',
  tujuanPembelian: '',
  petugas: '',
  bodyConditionalScore: '',
  fotoSertifikat: '',
};

const FormSchema = Yup.object().shape({
  RFID: Yup.string().required('RFID harus diisi'),
  berat: Yup.string().required('Berat harus diisi'),
  metodePengiriman: Yup.string().required('Metode Pengiriman harus diisi'),
  lokasiTujuan: Yup.string().required('Lokasi Tujuan harus diisi'),
  // sertifikat: Yup.string().required('No Sertifikat harus diisi'),
  bodyConditionalScore: Yup.string().required('Body Conditional Score harus diisi'),
  tujuanPembelian: Yup.string().required('Tujuan Pembelian harus diisi'),
});

export default function PembelianTernakModal({
  open,
  close,
  onSubmitData,
  //
  rfidOptions = [],
  loadingRfidOptions,
  //
  metodePengirimanOptions = [],
  loadingMetodePengirimanOptions,
  //
  tujuanPembelianOptions = [],
  loadingTujuanPembelianOptions,
  //
  bcsOptions = [],
  loadingBcsOptions,
  data,
}) {
  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues: data || defaultValues,
  });

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit((data) => {
    onSubmitData(data);
  });

  const [fotoSertifikat, setFotoSertifikat] = useState(data?.fotoSertifikat || null);

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

    setValue(name, {
      file,
      preview: URL.createObjectURL(file),
    });
    setFile({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const renderFile = useCallback(
    ({ file, preview, ...other }, setFile) => {
      return (
        <Stack
          direction="row"
          alignItems="center"
          width={'78%'}
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
            <span>
              <Link href={preview} target="_blank" variant="subtitle2">
                {file?.name}
              </Link>
            </span>
          </Typography>
          <IconButton
            onClick={() => {
              setFile(null);
            }}
          >
            <Iconify icon="mdi:close" />
          </IconButton>
        </Stack>
      );
    },
    [fotoSertifikat]
  );

  return (
    <ModalWholesaler
      open={open}
      close={close}
      title="Pembelian Ternak"
      buttonText="Pembayaran"
      //
      isForm
      methods={methods}
      onSubmit={onSubmit}
      onClickBack={() => {}}
      disabledButtonBack
    >
      <Stack spacing={2}>
        <Stack
          spacing={2}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {/* <RHFTextField name="RFID" label="RFID" /> */}
          <RHFAutocomplete
            name="RFID"
            label={
              <>
                RFID <sup>*</sup>
              </>
            }
            options={rfidOptions}
            loading={loadingRfidOptions}
            fullWidth
            onChange={(_, value) => {
              setValue('RFID', value?.value);
              setValue('idKandang', value?.idKandang);
              setValue('idPeternakan', value?.idPeternakan);
              setValue('ternak', value?.ternak);
              setValue('berat', value?.berat);
              setValue('bodyConditionalScore', value?.bsc);
            }}
            required
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {option.label}
              </li>
            )}
          />
          <RHFTextField
            name="berat"
            type="number"
            label={
              <>
                Berat <sup>*</sup>
              </>
            }
            InputProps={{
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            }}
          />
        </Stack>
        <Stack
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
          }}
          spacing={2}
        >
          <RHFTextField name="idKandang" label="ID Kandang" disabled />
          <RHFAutocomplete
            name="metodePengiriman"
            label={
              <>
                Metode Pengiriman <sup>*</sup>
              </>
            }
            options={metodePengirimanOptions}
            loading={loadingMetodePengirimanOptions}
            fullWidth
            onChange={(_, item) => {
              setValue('metodePengiriman', item?.value || '');
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {option.label}
              </li>
            )}
          />
        </Stack>
        <Stack
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
          }}
          spacing={2}
        >
          <RHFTextField name="idPeternakan" label="ID Peternakan" disabled />
          <RHFTextField
            name="lokasiTujuan"
            label={
              <>
                Lokasi Tujuan <sup>*</sup>
              </>
            }
          />
        </Stack>
        <Stack
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
          }}
          spacing={2}
        >
          <RHFTextField
            name="sertifikat"
            label="Sertifikat Kesehatan Hewan"
            type="number"
            placeholder="No Surat Keterangan Hewan"
          />
          <RHFAutocomplete
            name="tujuanPembelian"
            label={
              <>
                Tujuan Pembelian <sup>*</sup>
              </>
            }
            options={tujuanPembelianOptions}
            loading={loadingTujuanPembelianOptions}
            fullWidth
            onChange={(_, item) => {
              setValue('tujuanPembelian', item?.value || '');
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {option.label}
              </li>
            )}
          />
        </Stack>
        <Stack
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
          }}
          spacing={2}
        >
          <RHFTextField name="petugas" label="Petugas/Dokter Hewan" />
          <RHFAutocomplete
            name="bodyConditionalScore"
            label={
              <>
                Body Conditional Score (BSC) <sup>*</sup>
              </>
            }
            options={bcsOptions}
            loading={loadingBcsOptions}
            fullWidth
            onChange={(_, item) => {
              setValue('bodyConditionalScore', item?.value);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.value}>
                {option.label}
              </li>
            )}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: { sm: 1, md: 1 / 2 },
          }}
        >
          {fotoSertifikat && renderFile(fotoSertifikat, setFotoSertifikat)}
          <label htmlFor="fotoSertifikat" style={{ width: !fotoSertifikat ? '100%' : '20%' }}>
            <input
              id="fotoSertifikat"
              name="fotoSertifikat"
              type="file"
              style={{ display: 'none' }}
              accept="image/*, application/pdf"
              onChange={(e) => {
                handleChangeFile(e, setFotoSertifikat);
              }}
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
                Foto Sertifikat
              </Typography>
            </Button>
          </label>
          {/* <div style={{ width: 1 }} /> */}
        </Stack>
      </Stack>
    </ModalWholesaler>
  );
}
