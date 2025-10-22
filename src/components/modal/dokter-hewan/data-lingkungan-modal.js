import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import RHFDatePicker from "../../hook-form/rhf-datepicker";
import Scrollbar from "../../scrollbar";
import { useState } from "react";
import { useCreateData } from "src/api/custom-api";
import { useSnackbar } from "notistack";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: 600 },
    bgcolor: 'background.paper',
    borderRadius: 1,
};
export default function DataLingkunganModal({ open, onClose, setRefetchLingkungan, setCategory, ...other }) {

    const {
        createData: createLingkungan,
    } = useCreateData();

    const { enqueueSnackbar } = useSnackbar();

    const schema = Yup.object().shape({
        suhu: Yup.number()
            .required('Perkiraan Waktu Gejala is required')
            .min(1, 'Suhu wajib lebih dari 0'),
        kelembaban: Yup.number()
            .required('Perkiraan Waktu Gejala is required')
            .min(1, 'Kelembaban wajib lebih dari 0'),
        kondisiVentilasi: Yup.string().required('Kondisi Ventilasi is required'),
        kebersihan: Yup.string().required('Kebersihan is required'),
        deskripsiKondisiSekitar: Yup.string().required('Deskripsi is required'),
    });

    const defaultValues = {
        suhu: 0,
        kelembaban: 0,
        kondisiVentilasi: '',
        kebersihan: '',
        deskripsiKondisiSekitar: '',
        keterangan: '',
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

    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Data Lingkungan</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <RHFTextField
                name="suhu"
                label="Suhu"
                type={'number'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            ℃
                        </InputAdornment>
                    ),
                }}
            />
            <RHFTextField
                name="kelembaban"
                label="Kelembaban"
                type={'number'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            %
                        </InputAdornment>
                    ),
                }}
            />
            <RHFSelect name="kondisiVentilasi" label="Kondisi Ventilasi">
                <MenuItem value="baik">Baik</MenuItem>
                <MenuItem value="tidakBaik">Tidak Baik</MenuItem>
            </RHFSelect>
            <RHFSelect name="kebersihan" label="Kebersihan">
                <MenuItem value="baik">Baik</MenuItem>
                <MenuItem value="tidakBaik">Tidak Baik</MenuItem>
            </RHFSelect>
            <RHFSelect name="deskripsiKondisiSekitar" label="Deskripsi Kondisi Sekitar">
                <MenuItem value="tidakAdaKondisiAnomali">Tidak Ada Kondisi Anomali</MenuItem>
                <MenuItem value="ditemukanKondisiAnomali">Ditemukan Kondisi Anomali</MenuItem>
            </RHFSelect>

        </Box>
    )

    const modalFooter = (
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={4} p={4}>

            <Button
                variant="outlined"
                onClick={onClose}
            >
                Batal
            </Button>
            <LoadingButton
                color="primary"
                variant="contained"
                type="submit"
                loading={isSubmitting}
            >
                Tambah
            </LoadingButton>
        </Box>
    )



    const onSubmit = handleSubmit(async (data) => {
        try {
            await createLingkungan(data, 'dataLingkungan');
            enqueueSnackbar('Success', { variant: 'success' });
            onClose();
            reset();
            setRefetchLingkungan((x) => !x);
            setCategory('dataLingkungan')
        } catch (error) {
            enqueueSnackbar('Failed', { variant: 'error' });
        }
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
    )
}