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
import { Box, Stack, height } from '@mui/system';
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
import RHFDatePicker from '../../hook-form/rhf-datepicker';
import Scrollbar from '../../scrollbar';
import { useEffect, useState } from 'react';
import { useDebounce } from 'src/hooks/use-debounce';
import { useGetData } from 'src/api/custom-api';
import { RHFAutocompleteCustom } from 'src/components/hook-form/rhf-autocomplete';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 800 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};
export default function PemantauanRutinModal({
  open,
  onClose,
  handleNext,
  formData,
  setFormData,
  ...other
}) {
  const { data: dataTernak, getData: getTernak } = useGetData();

  const [ternakOptions, setTernakOptions] = useState([]);
  const [search, setSearch] = useState('');

  const searchDebounce = useDebounce(search, 200);

  const onSearch = (value) => {
    setSearch(value);
  };

  const schema = Yup.object().shape({
    rfid: Yup.string().required('RFID wajib diisi'),
    anamnesis: Yup.string().required('Anamnesis wajib diisi !'),
  });

  const defaultValues = {
    rfid: '',
    kandang: '',
    jenisBreed: '',
    jenisHewan: '',
    jenisKelamin: '',
    warna: '',
    anamnesis: '',
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

  useEffect(() => {
    if (getValues('rfid')) {
      const findData = dataTernak.find((e) => e.RFID === getValues('rfid'));

      if (findData) {
        setValue('jenisHewan', findData?.jenisHewan);
        setValue('jenisBreed', findData?.jenisBreed);
        setValue('jenisKelamin', findData?.jenisKelamin);
        setValue('warna', findData?.warna);
        setValue('kandang', findData?.expand?.kandang?.namaKandang ?? '');
      }
    } else {
      setValue('jenisHewan', '');
      setValue('jenisBreed', '');
      setValue('jenisKelamin', '');
      setValue('warna', '');
      setValue('kandang', '');
    }
  }, [watch('rfid')]);

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
      <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Formulir SOAP</Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RHFAutocompleteCustom
        name="rfid"
        label="RFID"
        options={ternakOptions}
        sx={{
          mt: 1,
        }}
        onSearch={onSearch}
      />
      <RHFTextField name="kandang" label="Kandang" disabled />
      <RHFTextField name="jenisBreed" label="Jenis Breed" disabled />
      <RHFTextField name="jenisHewan" label="Jenis Hewan" disabled />
      <RHFTextField name="jenisKelamin" label="Jenis Kelamin" disabled />
      <RHFTextField name="warna" label="Warna" disabled />
      <RHFTextField name="anamnesis" label="Anamnesis" multiline rows={4} />
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={4} p={4}>
      <Button
        variant="contained"
        sx={{
          backgroundColor: (theme) => theme.palette.text.disabled,
        }}
        onClick={onClose}
        type="button"
      >
        Batal
      </Button>
      <Button color="primary" variant="contained" type="submit">
        Next &gt;&gt;
      </Button>
    </Box>
  );

  const onSubmit = handleSubmit(async (data) => {
    const findTernak = dataTernak.find((e) => e.RFID === getValues('rfid'));
    setFormData({
      anamnesis: data.anamnesis,
      ternak: findTernak.id,
    });
    handleNext();
  });

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Scrollbar sx={{ maxHeight: '80vh' }}>
            {modalHeader}
            <FormProvider methods={methods} onSubmit={onSubmit}>
              {modalBody}
              {modalFooter}
            </FormProvider>
          </Scrollbar>
        </Box>
      </Modal>
    </>
  );
}
