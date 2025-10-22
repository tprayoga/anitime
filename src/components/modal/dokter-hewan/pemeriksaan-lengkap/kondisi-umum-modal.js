import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { da } from "date-fns/locale";


export default function KondisiUmumModal({ title, content, action, open, onClose, handleNext, handleBack, formData, isLastForm }) {

    const options = ['Normal', 'Abnormal']

    const schema = Yup.object().shape({
        kondisiUmum: Yup.string().required('Kondisi Umum wajib diisi !'),
        berat: Yup.number().min(1, 'Berat wajib lebih dari 0 !'),
        caraBerjalan: Yup.string().required('Cara Berjalan wajib diisi !'),

    });

    const values = {
        kondisiUmum: '',
        berat: 0,
        caraBerjalan: '',

    };

    const checkDefault = formData?.kondisiUmum && typeof formData.kondisiUmum === 'object'
        ? formData.kondisiUmum
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
        const updatedData = {
            ...data,
            berat : `${data.berat} kg` 
        }
        handleNext(updatedData)
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
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>A. Kondisi Umum</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <RHFSelect name="kondisiUmum" label="Kondisi Umum">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>

            <RHFTextField
                name="berat"
                label="Berat"
                type={'number'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            kg
                        </InputAdornment>
                    ),
                }}
            />


            <RHFSelect name="caraBerjalan" label="Cara Berjalan">
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