import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function KelenjarLimpaModal({ title, content, action, open, onClose, handleNext, handleBack, formData, isLastForm }) {

    const options = ['Normal', 'Abnormal']

    const schema = Yup.object().shape({
        prescapular: Yup.string().required('Field Wajib diisi !'),
        axillary: Yup.string().required('Field Wajib diisi !'),
        popliteal: Yup.string().required('Field Wajib diisi !'),
        inguinal: Yup.string().required('Field Wajib diisi !'),
        supramammary: Yup.string().required('Field Wajib diisi !'),

    });

    const values = {
        prescapular: '',
        axillary: '',
        popliteal: '',
        inguinal: '',
        supramammary: ''
    };

    const checkDefault = formData?.kelenjarLimpa && typeof formData.kelenjarLimpa === 'object'
        ? formData.kelenjarLimpa
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
        handleNext(data)
    });

    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>D. Kelenjar Limfa</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <RHFSelect name="prescapular" label="Prescapular Lymp Nodes">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="axillary" label="Axillary Lymp Nodes">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="popliteal" label="Popliteal Lymp Nodes">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="inguinal" label="Inguinal Lymp Nodes">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="supramammary" label="Supramammary Lymp Nodes">
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