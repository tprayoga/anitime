import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useGetFulLData } from "src/api/custom-api";


export default function PemeriksaanFisikModal({ handleNext, handleBack, formData }) {

    const schema = Yup.object().shape({
        suhuRektal: Yup.number()
            .min(1, 'Suhu wajib lebih dari 0'),
        frekuensiDetakJantung: Yup.number()
            .min(1, 'Frekuensi Detak Jantung wajib lebih dari 0'),
        frekuensiPernafasan: Yup.number()
            .min(1, 'Frekuensi Pernafasan wajib lebih dari 0'),
        bcs: Yup.string().required('Body Conditional Score wajib diisi !'),
        berat: Yup.string().required('Berat Wajib diisi'),
    });

    const values = {
        suhuRektal: 0,
        frekuensiDetakJantung: 0,
        frekuensiPernafasan: 0,
        bcs: '',
        berat: '',
    };

    const checkDefault = formData?.pemeriksaanFisik && typeof formData.pemeriksaanFisik === 'object'
        ? formData.pemeriksaanFisik
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
            suhuRektal: `${data.suhuRektal} ℃`,
            frekuensiDetakJantung: `${data.frekuensiDetakJantung} denyut/menit`,
            frekuensiPernafasan: `${data.frekuensiPernafasan} kali/menit`,
            bcs: data.bcs,
            berat: `${data.berat} kg`,
        }
        handleNext(updatedData);
    });

    const { data: dataBCS, getFullData: getBCS } = useGetFulLData();

    useEffect(() => {
        getBCS('listBCS');
    }, [])

    const modalHeader = (

        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textTransform: 'capitalize' }}>Pemeriksaan Fisik</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

            <RHFTextField
                name="suhuRektal"
                label="Suhu Rektal"
                type={'number'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            ℃
                        </InputAdornment>
                    ),
                }}
            />
            <RHFTextField
                name="frekuensiDetakJantung"
                label="Frekuensi Detak Jantung"
                type={'number'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            denyut/menit
                        </InputAdornment>
                    ),
                }}
            />
            <RHFTextField
                name="frekuensiPernafasan"
                label="Frekuensi Pernafasan"
                type={'number'}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            kali/menit
                        </InputAdornment>
                    ),
                }}
            />

            <RHFSelect name="bcs" label="Body Conditional Score (BCS)">
                {dataBCS.map((data) => (
                    <MenuItem value={data.name} key={data.name}>{data.name}</MenuItem>
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