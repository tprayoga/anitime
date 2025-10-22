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
import { useGetGejalaMuncul } from 'src/api/anak-kandang/gejala-muncul';
import { useCreateSurveilansPenyakit } from 'src/api/anak-kandang/surveilans-penyakit';
import { enqueueSnackbar } from 'notistack';
import {
  useCreateData,
  useGetData,
  useGetFulLData,
  useUpdateData,
  useUpdateFilesData,
} from 'src/api/custom-api';
import pb from 'src/utils/pocketbase';
import { FILES_API, FILES_DOMAIN_API } from 'src/config-global';
import Iconify from 'src/components/iconify';
import { useDebounce } from 'src/hooks/use-debounce';
import { RHFAutocompleteCustom } from 'src/components/hook-form/rhf-autocomplete';
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

export default function SurveilansMandiriModal({
  open,
  onClose,
  setRefetchSurveilans,
  dataSurveilansTernak,
  dataSurveilans,
  type,
  ...other
}) {
  const user = useAuthContext();

  const { createData: createSurveilansPenyakit } = useCreateData();
  const { createData: createNotifications } = useCreateData();

  const { updateDataFile: updateSurveilansPenyakit } = useUpdateFilesData();

  const {
    data: dataGejalaMuncul,
    loading: loadingDataGejalaMuncul,
    error: errorDataGejalaMuncul,
    getFullData: getGejalaMuncul,
  } = useGetFulLData();

  const { data: dataTernak, getData: getTernak } = useGetData();

  const { updateData: updateTernak } = useUpdateData();

  const [IMAGE_URL, SET_IMAGE_URL] = useState(
    type === 'EDIT'
      ? dataSurveilans[0]?.fotoGejala.map((data) => {
          return `${FILES_API}/${dataSurveilans[0]?.collectionId}/${dataSurveilans[0]?.id}/${data}?token=${pb.authStore.token}`;
        })
      : ''
  );

  const [ternakOptions, setTernakOptions] = useState([]);
  const [search, setSearch] = useState('');

  const searchDebounce = useDebounce(search, 200);

  const onSearch = (value) => {
    setSearch(value);
  };

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

  useEffect(() => {
    if (dataTernak) {
      const updatedData = dataTernak.map((item) => {
        return item.RFID;
      });

      setTernakOptions(updatedData);
    }
  }, [dataTernak]);

  useEffect(() => {
    getTernak(1, 5, `RFID~"${search}"`, '-created', 'ternak', 'kandang');
  }, [searchDebounce]);

  const SURVEILANS_PENYAKIT_OPTIONS = dataGejalaMuncul?.map((obj) => ({
    value: obj.name,
    label: obj.name,
  }));

  const schema = Yup.object().shape({
    gejalaMuncul: Yup.array()
      .min(1, 'Pilih minimal satu Gejala')
      .of(Yup.string().required('Pilih minimal satu Gejala')),
    perkiraanWaktu: Yup.date().required('Perkiraan Waktu Gejala wajib diisi'),
    // fotoGejala: Yup.mixed().required('Foto Gejala wajib diisi'),
    // jenisSample: Yup.mixed().required('Jenis Sample wajib diisi'),
    gejalaLain: Yup.string().when('gejalaLainCb', {
      is: true,
      then: (schema) => schema.required('Satuan Lainnya wajib diisi'),
    }),
    rfid: Yup.string().required('RFID wajib diisi'),
  });

  const defaultValues = {
    gejalaMuncul: [],
    perkiraanWaktu: null,
    fotoGejala: undefined,
    jenisSample: undefined,
    gejalaLain: '',
    catatan: '',
    rfid: '',
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
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    let transformedImage = [];
    let transformedSample = [];

    if (data.fotoGejala) {
      Object.values(data.fotoGejala).forEach(function (value) {
        transformedImage.push(value);
      });
    }

    if (data.jenisSample) {
      Object.values(data.jenisSample).forEach(function (value) {
        transformedSample.push(value);
      });
    }
    const findTernak = dataTernak.find((e) => e.RFID === getValues('rfid'));

    const body = {
      ...data,
      ternak: findTernak.id,
      fotoGejala: transformedImage ? transformedImage : null,
      jenisSample: transformedSample ? transformedSample : null,
      createdBy: user.user.id,
    };

    if (type === 'CREATE') {
      try {
        await createSurveilansPenyakit(body, 'surveilansDokter');
        const ternakBody = {
          ...findTernak,
          status: body.gejalaMuncul.some((obj) => obj === 'Mati Mendadak') ? 'mati' : 'sakit',
        };
        await updateTernak(findTernak.id, ternakBody, 'ternak');
        const notificationBody = {
          message: `Gejala Penyakit Terdeteksi Pada Ternak Dengan RFID ${findTernak.RFID}`,
          read: false,
          name: 'Surveilans Ternak',
        };
        await createNotifications(notificationBody, 'notifications');

        enqueueSnackbar('Success', { variant: 'success' });

        reset();
        onClose();
        setRefetchSurveilans((x) => !x);
        // refetch();
      } catch (error) {
        enqueueSnackbar('Failed', { variant: 'error' });
      }
    }
    // else {
    //     try {
    //         await updateSurveilansPenyakit(dataSurveilans[0].id, body, 'surveilansTernak', dataSurveilans[0].fotoGejala);
    //         enqueueSnackbar('Success', { variant: 'success' });

    //         reset();
    //         onClose();
    //         refetch();
    //     } catch (error) {
    //         enqueueSnackbar(error, { variant: 'error' });

    //     }
    // }
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
      <RHFAutocompleteCustom
        name="rfid"
        label="RFID"
        options={ternakOptions}
        onSearch={onSearch}
        sx={{
          mb: 1,
        }}
      />
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
        <Grid item xs={12}>
          <RHFUploadField name="jenisSample" label="Jenis Sample" multiple={true} />
        </Grid>
        <Grid item xs={12}>
          <RHFTextField label="Catatan" name="catatan" multiline rows={3} />
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
