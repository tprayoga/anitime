import {
  Autocomplete,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../scrollbar';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useCreateData, useGetData, useGetFulLData, useUpdateData } from 'src/api/custom-domba-api';
import { FILES_API, FILES_DOMAIN_API } from 'src/config-global';
import pb from 'src/utils/pocketbase';
import { RHFAutocompleteCustom } from 'src/components/hook-form/rhf-autocomplete';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 800 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function PencatatanLaluLintasModal({
  open,
  onClose,
  selectedData,
  setSelectedData,
  type,
  setType,
  // setRefetch,
  ...other
}) {
  const { data: dataTujuanPembelian, getFullData: getTujuanPembelian } = useGetFulLData();

  const {
    data: dataBCS,
    loading: loadingDataBCS,
    error: errorDataBCS,
    getFullData: getBCS,
  } = useGetFulLData();

  const { data: dataTernak, getData: getTernak } = useGetData();
  const { createData: createLaluLintasTernak } = useCreateData();
  const { updateData: updateLaluLintasTernak } = useUpdateData();

  const { user } = useAuthContext();
  const [ternakOptions, setTernakOptions] = useState([]);

  // const IMAGE_URL = type === 'EDIT' && selectedData?.fotoSertifikat? `${FILES_DOMAIN_API}/${selectedData?.collectionId}/${selectedData?.id}/${selectedData?.fotoSertifikat}?token=${pb.authStore.token}` : '';
  const IMAGE_URL =
    type === 'EDIT' && selectedData?.fotoSertifikat
      ? `${FILES_API}/${selectedData?.collectionId}/${selectedData?.id}/${selectedData?.fotoSertifikat}?token=${pb.authStore.token}`
      : '';

  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search, 200);

  const onSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    getTujuanPembelian('listTujuanPembelian');
    getBCS('listBCS');

    return () => {
      setSelectedData('');
      setType('');
      reset(defaultValues);
    };
  }, []);

  useEffect(() => {
    if (dataTernak) {
      const updatedData = dataTernak.map((item) => {
        return item.noFID;
      });

      setTernakOptions(updatedData);
    }
  }, [dataTernak]);

  useEffect(() => {
    if (selectedData) {
      reset({
        ...selectedData,
        berat: selectedData?.expand?.ternak.berat,
        pen: selectedData?.expand?.pen?.namaKandang,
        bodyConditionalScore: selectedData?.expand?.ternak?.bodyConditionalScore,
        noFID: selectedData.expand.ternak.noFID,
      });
    }
  }, [selectedData]);

  useEffect(() => {
    getTernak(
      1,
      5,
      `kandang.peternakan = "${user.createdBy}" && noFID~"${search}"`,
      '-created',
      'ternak',
      'pen, bodyConditionalScore, kandang'
    );
  }, [searchDebounce]);

  const schema = Yup.object().shape({
    tujuan: Yup.string().required('Tujuan wajib diisi'),
    lokasiTujuan: Yup.string().required('Lokasi Tujuan wajib diisi'),
    noFID: Yup.string().required('noFID wajib diisi'),
  });

  const defaultValues = {
    noFID: null,
    tujuan: '',
    sertifikat: '',
    petugas: '',
    lokasiTujuan: '',
    fotoSertifikat: undefined,
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    getValues,
    setValue,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const findData = dataTernak.find((e) => e.noFID === data.noFID);
    const body = {
      ternak: findData.id,
      pen: findData.expand.pen.id,
      sertifikat: data.sertifikat,
      petugas: data.petugas,
      tujuan: data.tujuan,
      lokasiTujuan: data.lokasiTujuan,
      fotoSertifikat: data.fotoSertifikat ? data.fotoSertifikat[0] : null,
      jumlah: data.jumlah,
      peternakan: user.createdBy,
    };

    if (type === 'CREATE') {
      try {
        await createLaluLintasTernak(body, 'laluLintasTernak');
        enqueueSnackbar('Success', { variant: 'success' });
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      } finally {
        onClose();
        reset(defaultValues);
        // setRefetch((x) => !x);
      }
    } else {
      // try {
      //   await updateLaluLintasTernak(selectedData.id, body, 'laluLintasTernak');
      //   enqueueSnackbar('Success', { variant: 'success' });
      // } catch (error) {
      //   enqueueSnackbar('Failed', { variant: 'error' });
      // } finally {
      //   onClose();
      //   reset(defaultValues);
      //   setRefetch((x) => !x);
      // }
    }
  });

  useEffect(() => {
    if (getValues('noFID')) {
      const findData = dataTernak.find((e) => e.noFID === getValues('noFID'));
      if (findData) {
        setValue('bodyConditionalScore', findData?.expand?.bodyConditionalScore?.name);
        setValue('berat', findData.berat);
        setValue('pen', findData?.expand?.pen?.namaPen ?? '');
      }
    } else {
      setValue('bodyConditionalScore', '');
      setValue('berat', '');
      setValue('pen', '');
    }
  }, [watch('noFID')]);

  const modalHeader = (
    <Box
      sx={{
        backgroundColor: '#EAFFEA',
        borderRadius: 1,
        p: 2,
        position: 'sticky',
        top: 0,
        zIndex: '9999',
      }}
    >
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>
        Pencatatan Lalu Lintas
      </Typography>
    </Box>
  );
  const modalBody = (
    <Grid container spacing={1} p={2}>
      <Grid item xs={12} sm={6}>
        <RHFAutocompleteCustom
          name="noFID"
          label="No FID"
          options={ternakOptions}
          sx={{
            mt: 1,
          }}
          onSearch={onSearch}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFSelect name="tujuan" label="Tujuan" sx={{ mt: 1 }}>
          {dataTujuanPembelian?.map((option, index) => (
            <MenuItem value={option.name} key={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </RHFSelect>
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField name="pen" label="Pen" sx={{ mt: 1 }} disabled />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField name="lokasiTujuan" label="Lokasi Tujuan" sx={{ mt: 1 }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField
          name="berat"
          label="Berat"
          sx={{ mt: 1 }}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="start">kg</InputAdornment>,
          }}
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFTextField name="sertifikat" label="Sertifikat Kesehatan Hewan" sx={{ mt: 1 }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <RHFSelect
          name="bodyConditionalScore"
          label="Body Conditional Score (BCS)"
          sx={{ mt: 1 }}
          disabled
        >
          {dataBCS?.map((option) => (
            <MenuItem value={option.name} key={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </RHFSelect>
      </Grid>

      <Grid item xs={12} sm={6}>
        <RHFTextField name="petugas" label="Petugas/Dokter Hewan" sx={{ mt: 1 }} />
      </Grid>
      <Grid item xs={12}>
        <RHFUploadField
          name="fotoSertifikat"
          label="Foto Sertifikat Kesehatan Hewan"
          defaultValue={IMAGE_URL}
        />
      </Grid>
    </Grid>
  );
  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <LoadingButton color="primary" variant="contained" type="submit" loading={isSubmitting}>
        {type === 'CREATE' ? 'Tambah' : 'Update'}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          {loadingDataBCS ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100px',
                flexDirection: 'column',
              }}
            >
              <Iconify
                icon="eos-icons:loading"
                sx={{
                  width: '40px',
                  height: '40px',
                }}
              />
              Loading ...
            </Box>
          ) : (
            <Scrollbar sx={{ maxHeight: '80vh' }}>
              {modalHeader}
              <FormProvider methods={methods} onSubmit={onSubmit}>
                {modalBody}
                {modalFooter}
              </FormProvider>
            </Scrollbar>
          )}
        </Box>
      </Modal>
    </>
  );
}
