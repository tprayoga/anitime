import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
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
  RHFSelect,
  RHFTextField,
  RHFUpload,
  RHFUploadAvatar,
  RHFUploadBox,
  RHFUploadField,
} from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useGetData } from 'src/api/custom-domba-api';
import { RHFAutocompleteCustom } from 'src/components/hook-form/rhf-autocomplete';
import { useDebounce } from 'src/hooks/use-debounce';
import { useAuthContext } from 'src/auth/hooks';

export default function AnamnesisModal({
  title,
  content,
  action,
  open,
  onClose,
  handleNext,
  formData,
  dataSurveilans,
}) {
  const { data: dataTernak, getData: getTernak } = useGetData();

  const [ternakOptions, setTernakOptions] = useState([]);
  const [search, setSearch] = useState('');

  const searchDebounce = useDebounce(search, 200);

  const onSearch = (value) => {
    setSearch(value);
  };

  const schema = Yup.object().shape({
    noFID: Yup.string().required('noFID wajib diisi'),
    // kandang: Yup.string().required('Perkiraan Waktu Gejala is required'),
    // jenisBreed: Yup.string().required('Perkiraan Waktu Gejala is required'),
    // jenisHewan: Yup.string().required('Perkiraan Waktu Gejala is required'),
    // jenisKelamin: Yup.string().required('Perkiraan Waktu Gejala is required'),
    anamnesis: Yup.string().required('Anamnesis wajib diisi !'),
  });

  const values = {
    noFID: '',
    kandang: '',
    jenisBreed: '',
    jenisHewan: '',
    jenisKelamin: '',
    anamnesis: '',
  };
  const checkDefault =
    formData?.anamnesis && typeof formData.anamnesis === 'object' ? formData.anamnesis : values;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: checkDefault,
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
    handleNext(data);
  });

  useEffect(() => {
    getTernak(1, 5, '', '-created', 'ternak', 'kandang');
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
    getTernak(1, 5, `noFID~"${search}"`, '-created', 'ternak', 'kandang');
  }, [searchDebounce]);

  useEffect(() => {
    if (getValues('noFID')) {
      const findData = dataTernak.find((e) => e.noFID === getValues('noFID'));

      if (findData) {
        setValue('jenisHewan', findData?.jenisHewan);
        setValue('jenisBreed', findData?.jenisBreed);
        setValue('jenisKelamin', findData?.jenisKelamin);
        setValue('kandang', findData?.expand?.kandang?.namaKandang ?? '');
      }
    } else {
      setValue('jenisHewan', '');
      setValue('jenisBreed', '');
      setValue('jenisKelamin', '');
      setValue('kandang', '');
    }
  }, [watch('noFID')]);

  useEffect(() => {
    if (dataSurveilans) {
      setValue('noFID', dataSurveilans?.expand?.ternak?.noFID);
      setValue('jenisHewan', dataSurveilans?.expand?.ternak?.jenisHewan);
      setValue('jenisBreed', dataSurveilans?.expand?.ternak?.jenisBreed);
      setValue('jenisKelamin', dataSurveilans?.expand?.ternak?.jenisKelamin);
      setValue('kandang', dataSurveilans?.expand?.ternak?.expand?.kandang.namaKandang);
    }
  }, [dataSurveilans]);

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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>
        Anamnesis
      </Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RHFAutocompleteCustom
        name="noFID"
        label="No FID"
        options={ternakOptions}
        sx={{
          mt: 1,
        }}
        onSearch={onSearch}
        disabled={dataSurveilans ? true : false}
      />
      <RHFTextField name="kandang" label="Kandang" disabled />
      <RHFTextField name="jenisBreed" label="Jenis Breed" disabled />
      <RHFTextField name="jenisHewan" label="Jenis Hewan" disabled />
      <RHFTextField name="jenisKelamin" label="Jenis Kelamin" disabled />
      <RHFTextField name="anamnesis" label="Anamnesis" multiline rows={3} />
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={4} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <Button color="primary" variant="contained" type="submit">
        Lanjutkan
      </Button>
    </Box>
  );

  return (
    <>
      {modalHeader}
      <FormProvider methods={methods} onSubmit={onSubmit}>
        {modalBody}
        {modalFooter}
      </FormProvider>
    </>
  );
}
