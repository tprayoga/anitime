import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function PemilihanFormModal({ title, content, action, open, onClose, handleChooseForm, handleBack, formData }) {



    const FORM_OPTIONS = [
        { label: 'Kondisi Umum', value: 'kondisiUmum' },
        { label: 'Kulit Bulu', value: 'kulitBulu' },
        { label: 'Membran Mukosa', value: 'membranMukosa' },
        { label: 'Kelenjar Limpa', value: 'kelenjarLimpa' },
        { label: 'Muskulosketal', value: 'muskulosketal' },
        { label: 'Sistem Sirkulasi', value: 'sistemSirkulasi' },
        { label: 'Sistem Respirasi', value: 'sistemRespirasi' },
        { label: 'Sistem Digesti', value: 'sistemDigesti' },
        { label: 'Sistem Urogenital', value: 'sistemUrogenital' },
        { label: 'Sistem Syaraf', value: 'sistemSyaraf' },
        { label: 'Mata dan Telinga', value: 'mataDanTelinga' }
    ];


    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>Pemilihan Form</Typography>

        </Box>
    )



    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <RHFMultiCheckbox
                row
                name="gejalaMuncul"
                // label="Gejala Muncul"
                spacing={4}
                options={FORM_OPTIONS}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    },
                    marginTop: 1
                }}
            />


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
                Lanjutkan
            </Button>
        </Box>
    )

    const schema = Yup.object().shape({
        gejalaMuncul: Yup.array()
            .min(1, 'At least one gejala must be selected')
            .of(Yup.string().required('At least one gejala must be selected')),

    });

    const values = {
        gejalaMuncul: [],
    };

    const checkDefault = formData.pemilihanForm
    ? formData.pemilihanForm
    : values;

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues : checkDefault,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
        watch,

    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        // console.log(data);
        handleChooseForm(data)
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