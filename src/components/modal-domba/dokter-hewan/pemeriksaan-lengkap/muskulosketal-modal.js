import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function MuskulosketalModal({ handleNext, handleBack, formData, isLastForm }) {

    const options = ['Normal', 'Abnormal'];

    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>E. Muskulosketal</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>


            <RHFSelect name="posisiKepalaLeher" label="Posisi Kepala-Leher">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="palpasiSendiKepalaLeher" label="Palpasi Sendi Kepala-Leher">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="palpasiSendiKakiKananDepan" label="Palpasi Sendi Kaki Kanan Depan">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="palpasiSendiKakiKiriDepan" label="Palpasi Sendi Kaki Kiri Depan">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="palpasiSendiKakiKananBelakang" label="Palpasi Sendi Kaki Kanan Belakang">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="palpasiSendiKakiKiriBelakang" label="Palpasi Sendi Kaki Kiri Belakang">
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
        posisiKepalaLeher: Yup.string().required('Field Wajib diisi !'),
        palpasiSendiKepalaLeher: Yup.string().required('Field Wajib diisi !'),
        palpasiSendiKakiKananDepan: Yup.string().required('Field Wajib diisi !'),
        palpasiSendiKakiKiriDepan: Yup.string().required('Field Wajib diisi !'),
        palpasiSendiKakiKananBelakang: Yup.string().required('Field Wajib diisi !'),
        palpasiSendiKakiKiriBelakang: Yup.string().required('Field Wajib diisi !'),
    });

    const values = {
        posisiKepalaLeher: '',
        palpasiSendiKepalaLeher: '',
        palpasiSendiKakiKananDepan: '',
        palpasiSendiKakiKiriDepan: '',
        palpasiSendiKakiKananBelakang: '',
        palpasiSendiKakiKiriBelakang: '',
    };

    const checkDefault = formData?.muskulosketal && typeof formData.muskulosketal === 'object'
        ? formData.muskulosketal
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