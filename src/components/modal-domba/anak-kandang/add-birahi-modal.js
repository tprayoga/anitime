import { Button, Chip, Grid, MenuItem, Modal, TextField, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import Scrollbar from '../../scrollbar';
import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { useEffect, useState } from 'react';
// import { useCreateData, useUpdateData } from "src/api/custom-api";
import { useTheme } from '@emotion/react';
import { useCreateData, useGetData, useUpdateData } from 'src/api/custom-domba-api';
import { RHFAutocompleteCustom } from 'src/components/hook-form/rhf-autocomplete';
import { useDebounce } from 'src/hooks/use-debounce';
import { RHFDateTimePicker } from 'src/components/hook-form/rhf-datepicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 600 },
  bgcolor: 'background.paper',
  borderRadius: 1,
};

export default function AddBirahiModal({
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
  const { user } = useAuthContext();

  const { data: dataTernak, getData: getTernak } = useGetData();
  const { createData: createBirahi } = useCreateData();
  const { enqueueSnackbar } = useSnackbar();

  const GEJALA_BIRAHI_OPTIONS = [
    'Vulva Kemerahan',
    'Lendir pada Vulva',
    'Ternak Gelisah',
    'Vulva Membengkak',
    'Temperatura Vulva Meningkat',
  ];

  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search, 200);
  const [ternakOptions, setTernakOptions] = useState([]);

  const schema = Yup.object().shape({
    ternak: Yup.string().required('Ternak Wajib Diisi'),
    gejalaBirahi: Yup.mixed().required('Gejala Birahi Wajib Diisi'),
    waktuBirahi: Yup.date().required('Waktu Birahi Wajib Diisi'),
  });

  const defaultValues = {
    ternak: '',
    gejalaBirahi: undefined,
    waktuBirahi: undefined,
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // console.log(data.ternak);
    const ternakData = dataTernak.find((e) => e.noFID === data.ternak);
    // console.log(ternakData);
    // console.log(dataTernak);

    const body = {
      ...data,
      peternakan: user.createdBy,
      ternak: ternakData.id,
    };

    // console.log(body);
    if (type === 'CREATE') {
      try {
        await createBirahi(body, 'birahi');
        enqueueSnackbar('Success', { variant: 'success' });
        onClose();
        refetch();
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
  });

  const onSearch = (value) => {
    setSearch(value);
  };

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
        Input Data Birahi
      </Typography>
    </Box>
  );

  const modalBody = (
    <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RHFAutocompleteCustom
        name="ternak"
        label="Ternak"
        options={ternakOptions}
        sx={{
          mt: 1,
        }}
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
        name="gejalaBirahi"
        label="Gejala Birahi"
        options={GEJALA_BIRAHI_OPTIONS}
        sx={{
          mt: 1,
        }}
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
        onSearch={onSearch}
        multiple
      />
      <RHFDateTimePicker label="Waktu Birahi" name="waktuBirahi" />
    </Box>
  );

  const modalFooter = (
    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
      <Button variant="outlined" onClick={onClose}>
        Batal
      </Button>
      <LoadingButton color="primary" variant="contained" type="submit" loading={isSubmitting}>
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
