import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, {
  RHFCheckbox,
  RHFMultiCheckbox,
  RHFTextField,
  RHFUpload,
  RHFUploadAvatar,
  RHFUploadBox,
  RHFUploadField,
} from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import RHFDatePicker, { RHFDateTimePicker } from '../../hook-form/rhf-datepicker';
import Scrollbar from '../../scrollbar';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import {
  useCreateData,
  useGetFulLData,
  useUpdateData,
  useUpdateFilesData,
} from 'src/api/custom-domba-api';
import pb from 'src/utils/pocketbase';
import { FILES_API, FILES_DOMAIN_API } from 'src/config-global';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', lg: 1000 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function SurveilansPenyakitModal({
  open,
  onClose,
  dataTernak,
  dataSurveilans,
  type,
  refetch,
  ...other
}) {
  const {
    createData: createSurveilansPenyakit,
    createData: createNotificationSurveilans,
    error: errorCreateSurveilansPenyakit,
    loading: loadingCreateSurveilansPenyakit,
  } = useCreateData();

  const { updateDataFile: updateSurveilansPenyakit } = useUpdateFilesData();
  const { updateData: updateTernak } = useUpdateData();

  const {
    data: dataGejalaMuncul,
    loading: loadingDataGejalaMuncul,
    error: errorDataGejalaMuncul,
    getFullData: getGejalaMuncul,
  } = useGetFulLData();

  const user = useAuthContext();

  const [IMAGE_URL, SET_IMAGE_URL] = useState(
    type === 'EDIT'
      ? dataSurveilans[0]?.fotoGejala.map((data) => {
          return `${FILES_API}/${dataSurveilans[0]?.collectionId}/${dataSurveilans[0]?.id}/${data}?token=${pb.authStore.token}`;
        })
      : ''
  );

  useEffect(() => {
    getGejalaMuncul('listGejalaMuncul');

    return () => {
      reset(defaultValues);
      SET_IMAGE_URL(undefined);
    };
  }, []);

  useEffect(() => {
    if (type === 'EDIT') {
      reset({
        gejalaMuncul: dataSurveilans[0].gejalaMuncul,
        perkiraanWaktu: new Date(dataSurveilans[0].perkiraanWaktu),
      });
    }
  }, [type]);

  const SURVEILANS_PENYAKIT_OPTIONS = dataGejalaMuncul?.map((obj) => ({
    value: obj.name,
    label: obj.name,
  }));

  const schema = Yup.object().shape({
    gejalaMuncul: Yup.array()
      .min(1, 'Pilih minimal satu Gejala')
      .of(Yup.string().required('Pilih minimal satu Gejala')),
    perkiraanWaktu: Yup.date().required('Perkiraan Waktu Gejala wajib diisi'),
    fotoGejala: Yup.mixed().required('Foto Gejala wajib diisi'),
    gejalaLain: Yup.string().when('gejalaLainCb', {
      is: true,
      then: (schema) => schema.required('Satuan Lainnya wajib diisi'),
    }),
  });

  const defaultValues = {
    gejalaMuncul: [],
    perkiraanWaktu: null,
    fotoGejala: undefined,
    gejalaLain: '',
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
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    let transformedImage = [];
    Object.values(data.fotoGejala).forEach(function (value) {
      transformedImage.push(value);
    });

    const body = {
      ...data,
      ternak: dataTernak.id,
      fotoGejala: transformedImage,
      status: 'Pending',
      createdBy: user.user.id,
    };

    if (type === 'CREATE') {
      try {
        await createSurveilansPenyakit(body, 'surveilansTernak');
        // const ternakBody = {
        //   ...dataTernak,
        //   status: body.gejalaMuncul.some((obj) => obj === 'Mati Mendadak') ? 'mati' : 'sakit',
        // };
        // await updateTernak(dataTernak.id, ternakBody, 'ternak');

        // await createNotificationSurveilans(
        //   {
        //     name: 'Laporan Surveilans Ternak',
        //     message: `Gejala penyakit terdeteksi pada hewan ternak ${dataTernak.RFID}`,
        //     read: false,
        //     surveilansTernak: dataCreateSurveilans?.id,
        //   },
        //   'notifications'
        // );

        enqueueSnackbar('Success', { variant: 'success' });

        reset();
        onClose();
        refetch();
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      }
    } else {
      try {
        await updateSurveilansPenyakit(
          dataSurveilans[0].id,
          body,
          'surveilansTernak',
          dataSurveilans[0].fotoGejala
        );
        enqueueSnackbar('Success', { variant: 'success' });

        reset();
        onClose();
        refetch();
      } catch (error) {
        enqueueSnackbar(error, { variant: 'error' });
      }
    }
  });

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
        Surveilans Penyakit
      </Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2 }}>
      <RHFMultiCheckbox
        row
        name="gejalaMuncul"
        label="Gejala Muncul"
        spacing={4}
        options={SURVEILANS_PENYAKIT_OPTIONS}
        sx={{
          display: 'grid',
          gridColumn: 10,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          marginTop: 1,
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <RHFCheckbox name="gejalaLainCb" label="Gejala Lainnya" />

        <RHFTextField
          label="Gejala Lainnya"
          name="gejalaLain"
          sx={{ display: 'inline', marginTop: 2 }}
          disabled={!watch('gejalaLainCb')}
        />
      </Box>
      <Grid container spacing={1} mt={1}>
        <Grid item xs={12}>
          <RHFDateTimePicker
            name="perkiraanWaktu"
            label="Perkiraan Waktu Munculnya Gejala"
            sx={{ mt: 2, width: '100%' }}
            type="date"
          />
        </Grid>
        <Grid item xs={12}>
          <RHFUploadField
            name="fotoGejala"
            label="Foto Gejala"
            multiple={true}
            defaultValue={IMAGE_URL}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={4} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <LoadingButton variant="contained" color="primary" loading={isSubmitting} type="submit">
        {`${type === 'CREATE' ? 'Tambah' : 'Update'}`}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          {loadingDataGejalaMuncul ? (
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
