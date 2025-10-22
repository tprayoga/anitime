import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function SistemDigestiModal({ title, content, action, open, onClose, handleNext, handleBack, formData, isLastForm }) {

    const options = ['Normal', 'Abnormal'];
    const secondOptions = ['Ya', 'TIdak'];


    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>H. Sistem Digesti</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <RHFSelect name="halitosis" label="Halitosis">
                {secondOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="kelenjarLudah" label="Kelenjar Ludah">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="palpasiAbdomen" label="Palpasi Abdomen">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="warnaFeses" label="Warna Feses">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="konsistensiFeses" label="Konsistensi Feses">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
        </Box>
    )

    const modalFooter = (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }} mt={4} p={4}>
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
        halitosis: Yup.string().required('Field Wajib diisi !'),
        kelenjarLudah: Yup.string().required('Field Wajib diisi !'),
        palpasiAbdomen: Yup.string().required('Field Wajib diisi !'),
        warnaFeses: Yup.string().required('Field Wajib diisi !'),
        konsistensiFeses: Yup.string().required('Field Wajib diisi !'),
    });

    const values = {
        halitosis: '',
        kelenjarLudah: '',
        palpasiAbdomen: '',
        warnaFeses: '',
        konsistensiFeses: ''
    };

    const checkDefault = formData?.sistemDigesti && typeof formData.sistemDigesti === 'object'
        ? formData.sistemDigesti
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