import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function SistemRespirasiModal({ title, content, action, open, onClose, handleNext, handleBack, formData, isLastForm }) {

    const options = ['Normal', 'Abnormal'];
    const secondOptions = ['Ya', 'Tidak'];
    const batukOptions = ['Basah', 'Kering'];


    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>G. Sistem Respirasi</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <RHFSelect name="sistemRespirasi" label="Sistem Respirasi">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="nasalDischarge" label="Nasal Discharge">
                {secondOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="dypsnea" label="Dypsnea">
                {secondOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="batuk" label="Batuk">
                {batukOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
        </Box>
    )

    const modalFooter = (
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={4} p={4}>
            <Button
                variant="outlined"
                onClick={handleBack}
            >
                Back
            </Button>
            <Button
                color="primary"
                variant="contained"
                type="submit"
            >
                {`${isLastForm ? 'Submit' : 'Lanjutkan'}`}
            </Button>
        </Box>
    )

    const schema = Yup.object().shape({
        sistemRespirasi: Yup.string().required('Perkiraan Waktu Gejala is required'),
        nasalDischarge: Yup.string().required('Perkiraan Waktu Gejala is required'),
        dypsnea: Yup.string().required('Perkiraan Waktu Gejala is required'),
        batuk: Yup.string().required('Perkiraan Waktu Gejala is required'),
    });

    const values = {
        sistemRespirasi: '',
        nasalDischarge: '',
        dypsnea: '',
        batuk: '',
    };

    const checkDefault = formData?.sistemRespirasi && typeof formData.sistemRespirasi === 'object'
        ? formData.sistemRespirasi
        : values;

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: checkDefault,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
        watch,

    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        handleNext(data);
    });

    return (
        <>

            {modalHeader}
            <FormProvider methods={methods} onSubmit={onSubmit}>
                {modalBody}
                {modalFooter}
            </FormProvider>

        </>
    )
}