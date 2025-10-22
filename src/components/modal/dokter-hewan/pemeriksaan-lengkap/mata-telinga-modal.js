import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function MataDanTelingaModal({ title, content, action, open, onClose, handleNext, handleBack, formData, isLastForm }) {

    const kondisiMataOptions = ["Normal", "Entropion", "Ektropion", "Distichiasis", "Epiphora"];
    const korneaOptions = ["Normal", "Ulcer", "Laserasi", "Keratitis"];
    const kondisiTelingaOptions = ["Normal", "Abnormal"];
    const pinnaOptions = ["Normal", "Luka", "Lesi"];
    const kannalOptions = ["Wax", "Infeksi", "Ektoparasit", "Normal"];

    const schema = Yup.object().shape({
        kondisiMata: Yup.string().required('Field Wajib diisi !'),
        kornea: Yup.string().required('Field Wajib diisi !'),
        kondisiTelinga: Yup.string().required('Field Wajib diisi !'),
        pinna: Yup.string().required('Field Wajib diisi !'),
        kannal: Yup.string().required('Field Wajib diisi !'),
    });

    const values = {
        kondisiMata: '',
        kornea: '',
        kondisiTelinga: '',
        pinna: '',
        kannal: ''
    };

    const checkDefault = formData?.mataDanTelinga && typeof formData.mataDanTelinga === 'object'
        ? formData.mataDanTelinga
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
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>K. Mata dan Telinga</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <RHFSelect name="kondisiMata" label="Kondisi Mata">
                {kondisiMataOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="kornea" label="Kornea">
                {korneaOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="kondisiTelinga" label="Kondisi Telinga">
                {kondisiTelingaOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="pinna" label="Pinna">
                {pinnaOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="kannal" label="Kannal">
                {kannalOptions.map((data) => (
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