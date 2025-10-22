import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useState } from "react";


export default function DiagnosaSementaraModal({ open, onClose, handleNext, handleBack, formData, isLastForm }) {

    const PENGGOLONGAN_DIAGNOSA_OPTIONS = [
        'Defisiensi Nutrisi',
        'Excess Nutrisi',
        'Infeksius',
        'Injuries and Stress',
    ]

    const DEFISIENSI_NUTRISI_OPTIONS = [
        'Pregnancy Toxaemia',
        'Ketosis',
        'Fatty Liver',
        'Milk Fever',
        'Transport Tetany',
        'Asidosis',
        'Bloat',
        'Inanition',
        'Liver Abscesses',
        'Dietary Diarrhoea',
    ]

    const EXCESS_NUTRISI_OPTIONS = [
        'Acidosis',
        'Rumenitis',
        'Polioencephalomalacia',
        'Nutritional diarrhoea',
        'Impaction (sembelit)',
    ]

    const INFEKSIUS_OPTIONS = [
        'Pneumonia',
        'Bovine Ephemeral Fever',
        'Foot rot and foot abscess',
        'Pink Eye',
        'Diarrhoea (infectious)'
    ]

    const INJURIES_OPTIONS = [
        'Heat Stress',
        'Transport Stress',
        'Lumpuh',
        'Luka (Transport)',
        'Downers'
    ]

    const schema = Yup.object().shape({

        penggolonganDiagnosa: Yup.string().required('Field wajib diisi !'),
        diagnosaPenyakit: Yup.string().required('Rencana Tindak Lanjut wajib diisi !'),

    });

    const values = {
        penggolonganDiagnosa: '',
        diagnosaPenyakit: '',

    };

    const checkDefault = formData?.diagnosaSementara && typeof formData.diagnosaSementara === 'object'
        ? formData.diagnosaSementara
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

    const selectedCategory = watch('penggolonganDiagnosa')

    const DIAGNOSA_PENYAKIT_OPTIONS =
      selectedCategory === 'Defisiensi Nutrisi' ? DEFISIENSI_NUTRISI_OPTIONS :
      selectedCategory === 'Excess Nutrisi' ? EXCESS_NUTRISI_OPTIONS :
      selectedCategory === 'Infeksius' ? INFEKSIUS_OPTIONS : 
      selectedCategory === 'Injuries and Stress' ? INJURIES_OPTIONS : [];




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
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>Diagnosa Sementara</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <RHFSelect
                name="penggolonganDiagnosa"
                label="Penggolongan Diagnosa"
            >
                {PENGGOLONGAN_DIAGNOSA_OPTIONS.map((data) => (
                    <MenuItem value={data} key={data}>{data}</MenuItem>
                ))}
            </RHFSelect>

            <RHFSelect
                name="diagnosaPenyakit"
                label="Diagnosa Penyakit"
            >
                {DIAGNOSA_PENYAKIT_OPTIONS.map((data) => (
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