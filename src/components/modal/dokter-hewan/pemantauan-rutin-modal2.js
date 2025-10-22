import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import RHFDatePicker from "../../hook-form/rhf-datepicker";
import Scrollbar from "../../scrollbar";
import { useState } from "react";
import { useCreateData } from "src/api/custom-api";
import { useSnackbar } from "notistack";
import { useAuthContext } from "src/auth/hooks";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: 800 },
    bgcolor: 'background.paper',
    borderRadius: 1,
};

export default function PemantauanRutinModal2({ open, onClose, handleBack, formData, setFormData, setRefetch, ...other }) {


    const { createData } = useCreateData();
    const { enqueueSnackbar } = useSnackbar();
    const user = useAuthContext();


    const schema = Yup.object().shape({
        subjektif: Yup.string().required('Subjektif wajib diisi !'),
        objektif: Yup.string().required('Objektif wajib diisi !'),
        asesmen: Yup.string().required('Asesmen wajib diisi !'),
        plan: Yup.string().required('Plan wajib diisi !'),
        pemeriksaan: Yup.string().required('Pemeriksaan wajib diisi !'),
    });

    const defaultValues = {
        subjektif: '',
        objektif: '',
        asesmen: '',
        plan: '',
        pemeriksaan: '',
    };

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
        watch,

    } = methods;

    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Formulir SOAP</Typography>

        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <RHFTextField name="subjektif" label="Subjektif" multiline rows={3}/>
            <RHFTextField name="objektif" label="Objektif" multiline rows={3}/>
            <RHFTextField name="asesmen" label="Asesmen" multiline rows={3}/>
            <RHFTextField name="plan" label="Plan" multiline rows={3}/>
            <RHFTextField name="pemeriksaan" label="Pemeriksaan" multiline rows={3}/>
        </Box>
    )

    const modalFooter = (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }} mt={4} p={4}>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: (theme) => theme.palette.text.disabled,
                }}
                onClick={handleBack}
                type="button"
            >
                Back
            </Button>
            <LoadingButton
                color="primary"
                variant="contained"
                type="submit"
                loading={isSubmitting}
            >
                + Record Data
            </LoadingButton>
        </Box>
    )

    const onSubmit = handleSubmit(async (data) => {
        const body = {
            ...formData,
            ...data,
            createdBy : user.user.id
        }
        try {
            await createData(body, 'pemantauanRutin')

            onClose();
            enqueueSnackbar('Success', { variant: 'success' });
            setRefetch((x) => !x);

        } catch (error) {
            enqueueSnackbar('Failed', { variant: 'failed' });

        }
    });

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Scrollbar sx={{ maxHeight: '80vh' }}>
                        {modalHeader}
                        <FormProvider methods={methods} onSubmit={onSubmit}>
                            {modalBody}
                            {modalFooter}
                        </FormProvider>
                    </Scrollbar>
                </Box>
            </Modal>
        </>
    )
}