import { Button, Divider, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import Scrollbar from "../scrollbar";
import { useCreateKandang, useUpdateKandang } from "src/api/anak-kandang/kandang";
import { useSnackbar } from "notistack";
import { useAuthContext } from "src/auth/hooks";
import { useEffect } from "react";
import { useCreateData, useUpdateData } from "src/api/custom-api";
import { useTheme } from "@emotion/react";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: 800 },
    bgcolor: 'background.paper',
    borderRadius: 1,
};

export default function BCSModal({ open, onClose, ...other }) {

    const theme = useTheme();
    const user = useAuthContext();

    const { enqueueSnackbar } = useSnackbar();





    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Body Conditional Score Reference</Typography>
        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, }}>
            <img src="/assets/bcs/1.png"></img>
            <Divider sx={{ my: 2 }}/>
            <img src="/assets/bcs/2.png"></img>
            <Divider sx={{ my: 2 }}/>

            <img src="/assets/bcs/3.png"></img>
            <Divider sx={{ my: 2 }}/>

            <img src="/assets/bcs/4.png"></img>
            <Divider sx={{ my: 2 }}/>
            <img src="/assets/bcs/5.png"></img>

        </Box>
    )

    const modalFooter = (
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>

            <Button
                color="primary"
                variant="contained"
                onClick={onClose}
            >
                Selesai
            </Button>
        </Box>
    )

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Scrollbar sx={{ maxHeight: '90vh' }}>
                        {modalHeader}
                        {/* <FormProvider methods={methods} onSubmit={onSubmit}> */}
                            {modalBody}
                            {modalFooter}
                        {/* </FormProvider> */}
                    </Scrollbar>
                </Box>
            </Modal>
        </>
    )
}