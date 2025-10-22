import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function MembranMukosaModal({ title, content, action, open, onClose, handleNext, handleBack, formData, isLastForm }) {

    const membranOralOptions = ['Merah Muda', 'Pucat', 'Sianosis', 'Ikterus', 'Hiperemis']
    const membranKonjungtivaOptions = ['Merah Muda', 'Pucat', 'Sianosis', 'Ikterus', 'Hiperemis']


    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>C. Membran Mukosa</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>


            <RHFSelect name="membranMukosaOral" label="Membran Mukosa Oral">
                {membranOralOptions.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>
            <RHFSelect name="membranMukosaKonjungVita" label="Membran Mukosa Konjungvita">
                {membranKonjungtivaOptions.map((data) => (
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
        membranMukosaOral: Yup.string().required('Field Wajib Diisi !'),
        membranMukosaKonjungVita: Yup.string().required('Field Wajib Diisi !'),
    });

    const values = {
        membranMukosaOral: '',
        membranMukosaKonjungVita: '',
    };
    const checkDefault = formData?.membranMukosa && typeof formData.membranMukosa === 'object'
        ? formData.membranMukosa
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