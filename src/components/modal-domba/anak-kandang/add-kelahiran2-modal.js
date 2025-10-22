import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../scrollbar';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { useEffect, useRef, useState } from 'react';
// import { useCreateData, useUpdateData } from "src/api/custom-api";
import { useTheme } from '@emotion/react';
import { useCreateData, useGetFulLData, useUpdateData } from 'src/api/custom-domba-api';
import RHFDatePicker from 'src/components/hook-form/rhf-datepicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 900 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function AddKelahiran2Modal({
  open,
  onClose,
  selectedData,
  setSelectedData,
  type,
  setType,
  perkawinanData,
  formData,
  handleNext,
  refetch,
  ...other
}) {
  const theme = useTheme();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const { createData: createTernak } = useCreateData();
  const { createData: createKelahiran } = useCreateData();

  const { updateData: updateKandang } = useUpdateData();

  const { data: dataBCS, getFullData: getBCS } = useGetFulLData();
  const { data: dataBFS, getFullData: getBFS } = useGetFulLData();
  const { data: dataJenisBreed, getFullData: getJenisBreed } = useGetFulLData();
  const { data: dataKandang, getFullData: getKandang } = useGetFulLData();

  const JENIS_HEWAN_OPTIONS = ['Kambing', 'Domba'];
  const JENIS_KELAMIN_OPTIONS = ['Jantan', 'Betina'];
  const [penOptions, setPenOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getJenisBreed('listBreedHewan');
    getBCS('listBCS');
    getBFS('listBFS');
    getKandang('kandang', 'pen', `peternakan = "${user.createdBy}"`);
  }, []);

  const schema = Yup.object().shape({
    noFID: Yup.string().required('No FID Wajib Diisi'),
    jenisHewan: Yup.string().required('Jenis Hewan Wajib Diisi'),
    jenisKelamin: Yup.string().required('Jenis Kelamin Wajib Diisi'),
    jenisBreed: Yup.string().required('Jenis Breed Wajib Diisi'),
    bodyConditionalScore: Yup.string().required('Body Conditional Score Wajib Diisi'),
    bodyFatScore: Yup.string().required('Body Fat Score Wajib Diisi'),
    berat: Yup.number().required('Berat Wajib Diisi').min(1, 'Berat wajib lebih dari 0'),
    tanggalLahir: Yup.date().required('Tanggal Lahir Wajib Diisi'),
    kandang: Yup.string().required('Kandang Wajib Diisi'),
  });

  const defaultValues = {
    noFID: '',
    jenisHewan: '',
    jenisKelamin: '',
    jenisBreed: '',
    bodyConditionalScore: '',
    bodyFatScore: '',
    berat: 0,
    tanggalLahir: null,
    // asalPeternakan: '',
    kandang: '',
  };

  const formMethodsRefs = useRef([]);

  const createFormMethods = () =>
    useForm({
      resolver: yupResolver(schema),
      defaultValues,
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
        Form Input Ternak
      </Typography>
    </Box>
  );

  const renderForm = (index) => {
    const methods = createFormMethods();
    formMethodsRefs.current[index] = methods;

    const { watch } = methods;

    const watchKandang = watch('kandang');

    useEffect(() => {
      if (watchKandang) {
        const selectedKandang = dataKandang?.find((e) => e.id === watchKandang);
        let newOptions = [...penOptions];
        newOptions[index] = selectedKandang?.expand?.pen || [];

        setPenOptions(newOptions);
      }
    }, [watchKandang]);

    return (
      <FormProvider methods={methods} key={index}>
        <Accordion sx={{ border: '1px solid #F1F1F1' }}>
          <AccordionSummary aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
            <Typography variant="subtitle2">Form #{index + 1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container rowSpacing={3} columnSpacing={1}>
              <Grid item sm={6} xs={12}>
                <RHFTextField name="noFID" label="No FID" />
              </Grid>

              <Grid item sm={6} xs={12}>
                <RHFSelect name="jenisKelamin" label="Jenis Kelamin">
                  {JENIS_KELAMIN_OPTIONS.map((options) => (
                    <MenuItem value={options} key={options}>
                      {options}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={6}>
                <RHFSelect name="jenisHewan" label="Jenis Hewan">
                  {JENIS_HEWAN_OPTIONS.map((option) => (
                    <MenuItem value={option} key={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={6}>
                <RHFSelect name="jenisBreed" label="Jenis Breed">
                  {dataJenisBreed?.map((options) => (
                    <MenuItem value={options.name} key={options.name}>
                      {options.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item sm={6} xs={12}>
                <RHFDatePicker
                  name="tanggalLahir"
                  label="Tanggal Lahir"
                  sx={{ width: '100%' }}
                  disableFuture
                />
                <Typography sx={{ mt: 1 }} typography={'caption'}>
                  {/* Umur Saat Ini : {umur.label} */}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <RHFTextField
                  name="berat"
                  label="Berat Awal"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="start">kg</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <RHFSelect name="bodyConditionalScore" label="Body Conditional Score (BCS)">
                  {dataBCS?.map((options) => (
                    <MenuItem value={options.id} key={options.id}>
                      {options.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={6}>
                <RHFSelect name="bodyFatScore" label="Body Fat Score">
                  {dataBFS?.map((options) => (
                    <MenuItem value={options.id} key={options.id}>
                      {options.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={6}>
                <RHFSelect name="kandang" label="Kandang">
                  {dataKandang?.map((options) => (
                    <MenuItem value={options.id} key={options.id}>
                      {options.namaKandang}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={6}>
                <RHFSelect name="pen" label="Pen">
                  {penOptions[index]?.map((options) => (
                    <MenuItem value={options.id} key={options.id}>
                      {options.namaPen}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </FormProvider>
    );
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);

    let allData = [];
    let hasError = false;

    for (let i = 0; i < formMethodsRefs.current.length; i++) {
      const { handleSubmit, getValues } = formMethodsRefs.current[i];
      await handleSubmit(
        (data) => {
          allData.push(data);
        },
        () => {
          hasError = true;
        }
      )();

      if (hasError) break;
    }

    if (!hasError) {
      const ternakResponse = [];
      for (const data of allData) {
        const body = {
          ...data,
          indukJantan: perkawinanData.ternakJantan[0],
          indukBetina: formData.ternakBetina,
          perkawinan: perkawinanData.id,
        };
        const response = await createTernak(body, 'ternak');
        ternakResponse.push(response.id);
      }
      const kelahiranBody = {
        ...formData,
        ternakAnakan: ternakResponse,
        perkawinan: perkawinanData.id,
      };
      await createKelahiran(kelahiranBody, 'kelahiran');
      enqueueSnackbar('All forms submitted successfully', { variant: 'success' });
      onClose();
      refetch();
    } else {
      enqueueSnackbar('Error in one of the forms', { variant: 'error' });
    }

    setIsSubmitting(false);
  };

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array(parseInt(formData?.jumlahAnak))
        .fill()
        .map((_, index) => renderForm(index))}
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <LoadingButton
        color="primary"
        variant="contained"
        onClick={handleFormSubmit}
        loading={isSubmitting}
      >
        {type === 'CREATE' ? 'Submit' : 'Update'}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Scrollbar sx={{ maxHeight: '80vh' }}>
            {modalHeader}
            {modalBody}
            {modalFooter}
          </Scrollbar>
        </Box>
      </Modal>
    </>
  );
}
