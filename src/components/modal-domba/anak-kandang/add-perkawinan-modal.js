import {
  Button,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Box, Stack, width } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUpload,
  RHFUploadAvatar,
  RHFUploadBox,
  RHFUploadCustom,
} from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../scrollbar';
import { useCreateKandang, useUpdateKandang } from 'src/api/anak-kandang/kandang';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { useCallback, useEffect, useState } from 'react';
// import { useCreateData, useUpdateData } from "src/api/custom-api";
import { useTheme } from '@emotion/react';
import { useCreateData, useGetData, useUpdateData } from 'src/api/custom-domba-api';
import RHFDatePicker from 'src/components/hook-form/rhf-datepicker';
import { RHFAutocompleteCustom } from 'src/components/hook-form/rhf-autocomplete';
import { useDebounce } from 'src/hooks/use-debounce';
import Iconify from 'src/components/iconify';
import { Upload, UploadCustom } from 'src/components/upload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 800 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function AddPerkawinanModal({
  open,
  onClose,
  selectedData,
  setSelectedData,
  type,
  setType,
  refetch,
  ...other
}) {
  const theme = useTheme();
  const user = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const METODE_PENGKAWINAN_OPTIONS = [
    { id: 'Kawin Alam', label: 'Kawin Alam' },
    { id: 'Inseminasi Buatan', label: 'Inseminasi Buatan' },
    { id: 'Transfer Buatan', label: 'Transfer Buatan' },
  ];

  const { data: dataTernak, getData: getTernak } = useGetData();

  const {
    createData: createPerkawinan,
    loading: loadingCreatePerkawinan,
    error: errorCreatePerkawinan,
  } = useCreateData();

  const {
    updateData: updateKandang,
    loading: loadingUpdateKandang,
    error: errorUpdateKandang,
  } = useUpdateData();

  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search, 200);

  const [ternakOptions, setTernakOptions] = useState([]);

  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const handleUpload = () => {
    onClose();
    console.info('ON UPLOAD');
  };

  const handleRemoveFile = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const onSearch = (value) => {
    setSearch(value);
  };

  useEffect(() => {
    return () => {
      setSelectedData(null);
    };
  }, []);

  //   useEffect(() => {
  //     if (selectedData) {
  //       const { namaKandang, luasKandang, limitKandang, satuanKandang } = selectedData;

  //       const newValue = {
  //         namaKandang: namaKandang,
  //         luasKandang: satuanKandang === 'Ha' ? luasKandang / 10000 : luasKandang,
  //         limitKandang: limitKandang,
  //         satuanKandang: satuanKandang,
  //       };
  //       reset(newValue);
  //     }
  //   }, [selectedData]);

  useEffect(() => {
    if (dataTernak) {
      const updatedData = dataTernak.map((item) => {
        return item.noFID;
      });

      setTernakOptions(updatedData);
    }
  }, [dataTernak]);

  useEffect(() => {
    getTernak(
      1,
      5,
      `noFID~"${search}" && kandang.peternakan = "${user.createdBy}"`,
      '-created',
      'ternak',
      'kandang'
    );
  }, [searchDebounce]);

  const schema = Yup.object().shape({
    tanggalPerkawinan: Yup.date().required('Tanggal Perkawinan Wajib Diisi'),
    metodePengkawinan: Yup.string().required('Metode Perkawinan Wajib Diisi'),
    ternakJantan: Yup.mixed().required('Ternak Jantan Wajib Diisi'),
    ternakBetina: Yup.mixed().required('Ternak Betina Wajib Diisi'),
  });

  const defaultValues = {
    tanggalPerkawinan: '',
    metodePengkawinan: '',
    ternakJantan: [],
    ternakBetina: [],
    sertifikat: '',
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const generateIdPerkawinan = () => {
    return `BR${Date.now()}`;
  };

  const onSubmit = handleSubmit(async (data) => {
    const body = {
      ...data,
      ternakBetina: data.ternakBetina
        .map((x) => {
          const ternak = dataTernak.find((e) => e.noFID === x);
          return ternak ? ternak.id : null;
        })
        .filter((id) => id !== null),
      ternakJantan: data.ternakJantan
        .map((x) => {
          const ternak = dataTernak.find((e) => e.noFID === x);
          return ternak ? ternak.id : null;
        })
        .filter((id) => id !== null),
      sertifikasiBreed: files,
      id: generateIdPerkawinan(),
      peternakan: user.user.createdBy,
    };

    if (type === 'CREATE') {
      try {
        await createPerkawinan(body, 'perkawinan');
        enqueueSnackbar('Success', { variant: 'success' });
        onClose();
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    } else {
      //   try {
      //     await updateKandang(selectedData.id, body, 'kandang');
      //     onClose();
      //     enqueueSnackbar('Success', { variant: 'success' });
      //   } catch (error) {
      //     enqueueSnackbar('Failed', { variant: 'error' });
      //   }
    }
    reset();
    refetch();
    // setRefetch((x) => !x);
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
        Input Data Perkawinan
      </Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2 }}>
      <Stack spacing={3} mt={3}>
        <Stack
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 3, sm: 1 },
          }}
        >
          <RHFDatePicker
            name="tanggalPerkawinan"
            label="Tanggal Perkawinan"
            sx={{ width: '100%' }}
          />

          <RHFSelect
            name="metodePengkawinan"
            label="Metode Pengkawinan"
            sx={{
              width: { xs: '100%', sm: '50%%' },
            }}
          >
            {METODE_PENGKAWINAN_OPTIONS?.map((option) => (
              <MenuItem value={option.id} key={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <Stack
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 3, sm: 1 },
          }}
        >
          <RHFAutocompleteCustom
            name="ternakJantan"
            label="Ternak Jantan"
            options={ternakOptions}
            sx={{
              mt: 1,
            }}
            multiple
            onSearch={onSearch}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected) =>
              selected.map((option, index) => (
                <Chip
                  sx={{ ml: 1 }}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
          <RHFAutocompleteCustom
            name="ternakBetina"
            label="Ternak Betina"
            options={ternakOptions}
            sx={{
              mt: 1,
            }}
            multiple
            onSearch={onSearch}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected) =>
              selected.map((option, index) => (
                <Chip
                  sx={{ ml: 1 }}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Stack>
        {/* <RHFUpload name="sertifikat" label="Sertifikasi" /> */}
        {/* <UploadCustom/> */}
        <UploadCustom multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />

        {/* <RHFUploadCustom name="sertifikat" label="Sertifikasi" /> */}
        {/* <RHFUpload
          multiple
          thumbnail
          name="sertifikat"
          maxSize={3145728}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
          // onRemoveAll={handleRemoveAllFiles}
          onUpload={() => console.info('ON UPLOAD')}
        /> */}
      </Stack>
    </Box>
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
