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
import RHFDatePicker from '../../hook-form/rhf-datepicker';
import Scrollbar from '../../scrollbar';
import { useEffect, useState } from 'react';
import AnamnesisModal from './pemeriksaan-lengkap/anamnesis-modal';
import PemeriksaanFisikModal from './pemeriksaan-lengkap/pemeriksaan-fisik-modal';
import PemilihanFormModal from './pemeriksaan-lengkap/pemilihan-form-modal';
import MembranMukosaModal from './pemeriksaan-lengkap/membran-mukosa-modal';
import MuskulosketalModal from './pemeriksaan-lengkap/muskulosketal-modal';
import KulitBuluModal from './pemeriksaan-lengkap/kulit-bulu-modal';
import SistemUrogenitalModal from './pemeriksaan-lengkap/sistem-urogenital-modal';
import KelenjarLimpaModal from './pemeriksaan-lengkap/kelenjar-limpa-modal';
import SistemSirkulasiModal from './pemeriksaan-lengkap/sistem-sirkulasi-modal';
import SistemRespirasiModal from './pemeriksaan-lengkap/sistem-respirasi-modal';
import SistemDigestiModal from './pemeriksaan-lengkap/sistem-digesti-modal';
import SistemSyarafModal from './pemeriksaan-lengkap/sistem-syaraf-modal';
import MataDanTelingaModal from './pemeriksaan-lengkap/mata-telinga-modal';
import { useCreateData } from 'src/api/custom-domba-api';
import { useSnackbar } from 'notistack';
import KondisiUmumModal from './pemeriksaan-lengkap/kondisi-umum-modal';
import DiagnosaSementaraModal from './pemeriksaan-lengkap/diagnosa-sementara-modal';
import { useAuthContext } from 'src/auth/hooks';
import { ProductItemSkeleton } from 'src/sections/product/product-skeleton';

const FORM_LIST = [
  { value: 'anamnesis', label: 'Anamnesis', width: 600, type: 'required' },
  { value: 'pemeriksaanFisik', label: 'Pemeriksaan Fisik', width: 600, type: 'required' },
  { value: 'pemilihanForm', label: 'Pemilihan Form', width: 900, type: 'required' },
  { value: 'kondisiUmum', label: 'Kondisi Umum', width: 600, type: 'optional' },
  { value: 'kulitBulu', label: 'Kulit Bulu', width: 600, type: 'optional' },
  { value: 'membranMukosa', label: 'Membran Mukosa', width: 600, type: 'optional' },
  { value: 'kelenjarLimpa', label: 'Kelenjar Limpa', width: 600, type: 'optional' },
  { value: 'muskulosketal', label: 'Muskulosketal', width: 600, type: 'optional' },
  { value: 'sistemSirkulasi', label: 'Sistem Sirkulasi', width: 600, type: 'optional' },
  { value: 'sistemRespirasi', label: 'Sistem Respirasi', width: 600, type: 'optional' },
  { value: 'sistemDigesti', label: 'Sistem Digesti', width: 600, type: 'optional' },
  { value: 'sistemUrogenital', label: 'Sistem Urogenital', width: 800, type: 'optional' },
  { value: 'sistemSyaraf', label: 'Sistem Syaraf', width: 600, type: 'optional' },
  { value: 'mataDanTelinga', label: 'Mata Dan Telinga', width: 600, type: 'optional' },
  { value: 'diagnosaSementara', label: 'Diagnosa Sementara', width: 600, type: 'required' },
];

export default function PemeriksaanLengkapMandiriModal({ open, onClose, setRefetch, ...other }) {
  const { createData: createPemeriksaanLengkap, loading: loading } = useCreateData();

  const { enqueueSnackbar } = useSnackbar();
  const user = useAuthContext();

  const [formList, setFormList] = useState(FORM_LIST);
  const [currentStep, setCurrentStep] = useState(formList[0]);
  const [formData, setFormData] = useState();

  const handleNext = async (data) => {
    const findIndex = formList.findIndex((e) => e.value === currentStep.value);
    if (findIndex !== formList.length - 1) {
      setCurrentStep(formList[findIndex + 1]);
    } else {
      const body = {
        ...formData,
        [currentStep.value]: data,
        // createdBy: user.user.id,
      };

      console.log(body);

      await createPemeriksaanLengkap(body, 'pemeriksaanLengkap');
      onClose();
      setFormData([]);

      enqueueSnackbar('Success', { variant: 'success' });
      setRefetch((x) => !x);
    }
    setFormData({
      ...formData,
      [currentStep.value]: data,
    });
  };

  const handleBack = () => {
    const findIndex = formList.findIndex((e) => e.value === currentStep.value);
    if (findIndex !== 0) {
      setCurrentStep(formList[findIndex - 1]);
    }
  };

  const handleChooseForm = (data) => {
    const updatedFormList = FORM_LIST.filter((item) => {
      if (item.type === 'required' || data.gejalaMuncul.includes(item.value)) {
        return true;
      }
      return false;
    });
    setFormList(updatedFormList);

    setFormData({
      ...formData,
      [currentStep.value]: data,
    });
  };

  const isLastForm =
    formList.findIndex((e) => e.value === currentStep.value) === formList.length - 1;

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: currentStep.width },
    bgcolor: 'background.paper',
    borderRadius: 1,
  };

  useEffect(() => {
    const findIndex = formList.findIndex((e) => e.value === currentStep.value);
    if (findIndex !== formList.length - 1 && findIndex !== 0) {
      setCurrentStep(formList[findIndex + 1]);
    }
  }, [formList]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Scrollbar sx={{ maxHeight: '80vh' }}>
            {currentStep.value === 'anamnesis' && (
              <AnamnesisModal handleNext={handleNext} formData={formData} onClose={onClose} />
            )}
            {currentStep.value === 'pemeriksaanFisik' && (
              <PemeriksaanFisikModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                onClose={onClose}
              />
            )}
            {currentStep.value === 'pemilihanForm' && (
              <PemilihanFormModal
                handleChooseForm={handleChooseForm}
                handleBack={handleBack}
                formData={formData}
              />
            )}
            {currentStep.value === 'kondisiUmum' && (
              <KondisiUmumModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'kulitBulu' && (
              <KulitBuluModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'membranMukosa' && (
              <MembranMukosaModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'kelenjarLimpa' && (
              <KelenjarLimpaModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'muskulosketal' && (
              <MuskulosketalModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'sistemSirkulasi' && (
              <SistemSirkulasiModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'sistemRespirasi' && (
              <SistemRespirasiModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'sistemDigesti' && (
              <SistemDigestiModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'sistemUrogenital' && (
              <SistemUrogenitalModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'sistemSyaraf' && (
              <SistemSyarafModal
                handleNext={handleNext}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'mataDanTelinga' && (
              <MataDanTelingaModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
            {currentStep.value === 'diagnosaSementara' && (
              <DiagnosaSementaraModal
                handleNext={handleNext}
                handleBack={handleBack}
                formData={formData}
                isLastForm={isLastForm}
              />
            )}
          </Scrollbar>
        </Box>
      </Modal>
    </>
  );
}
