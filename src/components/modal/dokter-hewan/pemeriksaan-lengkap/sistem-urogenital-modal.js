import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function SistemUrogenitalModal({ title, content, action, open, onClose, handleNext, handleBack, formData, isLastForm }) {

    const intensitasMinumOptions = ["Naik", "Turun"];
    const intensitasUrineOptions = ["Naik", "Turun", "Dysuria"];
    const options = ["Normal", "Abnormal"];

    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>I. Sistem Urogenital</Typography>
        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <RHFSelect name="intensitasUmum" label="Intensitas Umum">
                {intensitasMinumOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="intensitasUrin" label="Intensitas Urin">
                {intensitasUrineOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="palpasiKiri" label="Palpasi Saluran Kemih/Ginjal Kiri">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="palpasiKanan" label="Palpasi Saluran Kemih/Ginjal Kanan">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="konsistensiFeses" label="Konsistensi Feses">
                {options.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            {formData?.anamnesis?.jenisKelamin === 'Jantan' &&
                <>
                    <RHFSelect name="kondisiPenis" label="Kondisi Penis">
                        {options.map((data) => (
                            <MenuItem value={data} key={data}>{data}</MenuItem>
                        ))}
                    </RHFSelect>
                    <RHFSelect name="kondisiPreputium" label="Kondisi Preputium">
                        {options.map((data) => (
                            <MenuItem value={data} key={data}>{data}</MenuItem>
                        ))}
                    </RHFSelect>
                    <RHFSelect name="kondisiScortum" label="Kondisi Scortum">
                        {options.map((data) => (
                            <MenuItem value={data} key={data}>{data}</MenuItem>
                        ))}
                    </RHFSelect>
                    <RHFSelect name="kondisiTestis" label="Kondisi Testis">
                        {options.map((data) => (
                            <MenuItem value={data} key={data}>{data}</MenuItem>
                        ))}
                    </RHFSelect>
                    <RHFSelect name="kondisiProstat" label="Kondisi Prostat">
                        {options.map((data) => (
                            <MenuItem value={data} key={data}>{data}</MenuItem>
                        ))}
                    </RHFSelect>
                </>
            }
            {formData?.anamnesis?.jenisKelamin === 'Betina' &&
                <>
                    <RHFSelect name="kondisiVulva" label="Kondisi Vulva">
                        {options.map((data) => (
                            <MenuItem value={data} key={data}>{data}</MenuItem>
                        ))}
                    </RHFSelect>
                    <RHFSelect name="kondisiVagina" label="Kondisi Vagina">
                        {options.map((data) => (
                            <MenuItem value={data} key={data}>{data}</MenuItem>
                        ))}
                    </RHFSelect>
                </>
            }
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
        intensitasUmum: Yup.string().required('Intensitas Umum is required'),
        intensitasUrin: Yup.string().required('Intensitas Urin is required'),
        palpasiKiri: Yup.string().required('Palpasi Saluran Kemih/Ginjal Kiri is required'),
        palpasiKanan: Yup.string().required('Palpasi Saluran Kemih/Ginjal Kanan is required'),
        konsistensiFeses: Yup.string().required('Konsistensi Feses is required'),
        ...(formData?.anamnesis?.jenisKelamin === 'Jantan' && {
            kondisiPenis: Yup.string().required('Kondisi Penis is required'),
            kondisiPreputium: Yup.string().required('Kondisi Preputium is required'),
            kondisiScortum: Yup.string().required('Kondisi Scortum is required'),
            kondisiTestis: Yup.string().required('Kondisi Testis is required'),
            kondisiProstat: Yup.string().required('Kondisi Prostat is required'),
        }),
        ...(formData?.anamnesis?.jenisKelamin === 'Betina' && {
            kondisiVulva: Yup.string().required('Kondisi Vulva is required'),
            kondisiVagina: Yup.string().required('Kondisi Vagina is required'),
        }),
    });

    const values = {
        intensitasUmum: '',
        intensitasUrin: '',
        palpasiKiri: '',
        palpasiKanan: '',
        konsistensiFeses: '',
        ...(formData?.anamnesis?.jenisKelamin === 'Jantan' && {
            kondisiPenis: '',
            kondisiPreputium: '',
            kondisiScortum: '',
            kondisiTestis: '',
            kondisiProstat: '',
        }),
        ...(formData?.anamnesis?.jenisKelamin === 'Betina' && {
            kondisiVulva: '',
            kondisiVagina: '',
        }),
    };

    const checkDefault = formData?.sistemUrogenital && typeof formData.sistemUrogenital === 'object'
        ? formData.sistemUrogenital
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