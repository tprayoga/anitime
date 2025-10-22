import { Button, Grid, InputAdornment, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import Scrollbar from "../../scrollbar";
import { useGetGejalaMuncul } from "src/api/anak-kandang/gejala-muncul";
import { useEffect } from "react";
import { useGetBodyConditionalScore } from "src/api/anak-kandang/body-conditional-score";
import { useCreateCatatanWelfare } from "src/api/anak-kandang/catatan-welfare";
import { enqueueSnackbar } from "notistack";
import { useCreateData, useGetFulLData, useUpdateData } from "src/api/custom-api";
import { LoadingButton } from "@mui/lab";
import Iconify from "src/components/iconify";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: 800 },
    bgcolor: 'background.paper',
    borderRadius: 1,
};
export default function CatatanWelfareModal({ open, onClose, dataTernak, dataCatatanWelfare, refetch, type, ...other }) {

    const {
        createData: createCatatanWelfare,
    } = useCreateData();

    const {
        updateData: updateCatatanWelfare,
    } = useUpdateData();

    const {
        updateData: updateTernak,
    } = useUpdateData();

    const {
        data: dataBCS,
        loading: loadingDataBCS,
        getFullData
    } = useGetFulLData();


    useEffect(() => {
        getFullData('listBCS');
    }, [])

    useEffect(() => {
        if (type === 'EDIT') {
            reset({
                berat: dataCatatanWelfare[0].berat,
                bodyConditionalScore: dataCatatanWelfare[0].bodyConditionalScore,
                jumlahFeses: dataCatatanWelfare[0].jumlahFeses,
            });
        }
    }, [type])


    const schema = Yup.object().shape({
        berat: Yup.number()
            .required('Berat Wajib Diisi')
            .min(1, 'Berat wajib lebih dari 0'),
        bodyConditionalScore: Yup.string().required('BCS Wajib Diisi'),
        jumlahFeses: Yup.number()
            .required('Jumlah Feses Wajib Diisi')
            .min(1, 'Jumlah Feses wajib lebih dari 0')
    });

    const defaultValues = {
        berat: 0,
        bodyConditionalScore: '',
        jumlahFeses: 0
    };

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {

        const body = {
            ...data,
            ternak: dataTernak.id
        }

        if (type === 'CREATE') {

            try {
                await createCatatanWelfare(body, 'catatanWelfareTernak');
                const updatedDataTernak = {
                    ...dataTernak,
                    berat : data.berat,
                    bodyConditionalScore : data.bodyConditionalScore
                }
                await updateTernak(body.ternak,updatedDataTernak,'ternak');
                enqueueSnackbar('Success', { variant: 'success' });

                reset();
                onClose();
                refetch();

            } catch (error) {
                enqueueSnackbar('Failed', { variant: 'error' });

            }
        } else {
            try {
                await updateCatatanWelfare(dataCatatanWelfare[0].id, body, 'catatanWelfareTernak');
                const updatedDataTernak = {
                    ...dataTernak,
                    berat : data.berat,
                    bodyConditionalScore : data.bodyConditionalScore
                }
                await updateTernak(body.ternak,updatedDataTernak,'ternak');
                enqueueSnackbar('Success', { variant: 'success' });

                reset();
                onClose();
                refetch();

            } catch (error) {
                enqueueSnackbar('Failed', { variant: 'error' });

            }
        }

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
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Catatan Kondisi Ternak</Typography>
        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, }}>
            <RHFTextField
                type="number"
                name="berat"
                label="Berat"
                sx={{ mt: 1 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            Kg
                        </InputAdornment>
                    ),
                }}
            />
            <RHFSelect name="bodyConditionalScore" label="Body Conditional Score (BCS)" sx={{ mt: 3 }}>
                {dataBCS?.map((options) => (
                    <MenuItem value={options.name} key={options.name}>{options.name}</MenuItem>
                ))}
            </RHFSelect>
            <RHFTextField
                type="number"
                name="jumlahFeses"
                label="Jumlah Feses"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">
                            Kg
                        </InputAdornment>
                    ),
                }}
                sx={{ mt: 3 }}
            />
        </Box>
    )

    const modalFooter = (
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
            {/* <Button
                variant="contained"
                size="large"
                sx={{
                    backgroundColor: (theme) => theme.palette.text.disabled,
                }}
                onClick={onClose}
            >
                Batal
            </Button> */}
            <Button variant="outlined" onClick={onClose}>
                Batal
            </Button>
            <LoadingButton
                color="primary"
                variant="contained"
                type="submit"
                loading={isSubmitting}

            >
                {type === 'CREATE' ? 'Tambah' : 'Update'}
            </LoadingButton>
        </Box>
    )

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>

                    {loadingDataBCS ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '100px',
                            flexDirection: 'column'
                        }}>
                            <Iconify
                                icon="eos-icons:loading"
                                sx={{
                                    width: '40px',
                                    height: '40px',
                                }}
                            />
                            Loading ...
                        </Box>
                    ) : (

                        <Scrollbar sx={{ maxHeight: '80vh' }}>
                            {modalHeader}
                            <FormProvider methods={methods} onSubmit={onSubmit}>
                                {modalBody}
                                {modalFooter}
                            </FormProvider>
                        </Scrollbar>
                    )}
                </Box>
            </Modal>
        </>
    )
}