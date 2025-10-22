import { Button, Grid, MenuItem, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFRadioGroup, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import Scrollbar from "../../scrollbar";
import { FormatRupiah } from "@arismun/format-rupiah";
import { useEffect, useState } from "react";
import { useGetOneData } from "src/api/custom-api";
import { fDate } from "src/utils/format-time";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: 800 },
    bgcolor: 'background.paper',
    borderRadius: 1,
};

export default function InvoiceModal({ title, content, action, open, onClose, scannedData, setScannedData, ...other }) {

    const { data: dataInvoice, getOneData: getInvoice } = useGetOneData();

    const [invoiceData, setInvoiceData] = useState('');

    useEffect(() => {
        const fetchData = async () => {

            const response = await getInvoice(scannedData, 'pembelianTernak', 'wholesaler, ternak');
            // console.log(dataPembelianTernak);
            // setInvoiceData(dataPembelianTernak);
        }
        fetchData();

    }, [scannedData])

    const shorterPaddingStyle = {
        paddingTop: '8px',
        paddingBottom: '8px',
    }

    const rows = [
        {
            item: 'Sapi Brahman',
            qty: 1,
            unitPrice: 20000000,
            total: 20000000
        },
        {
            item: 'Sapi Limousin',
            qty: 1,
            unitPrice: 10000000,
            total: 20000000
        },
        {
            item: 'Sapi Aceh',
            qty: 1,
            unitPrice: 10000000,
            total: 10000000
        },
        {
            item: 'Sapi Aceh',
            qty: 1,
            unitPrice: 10000000,
            total: 10000000
        },
        {
            item: 'Sapi Aceh',
            qty: 1,
            unitPrice: 10000000,
            total: 10000000
        },
        {
            item: 'Sapi Aceh',
            qty: 1,
            unitPrice: 10000000,
            total: 10000000
        },

    ]

    const modalHeader = (
        <Box sx={{
            backgroundColor: '#EAFFEA',
            borderRadius: 1,
            px: 4,
            py: 2,
            position: 'sticky',
            top: 0,
            zIndex: '9999',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Invoice</Typography>
            <Stack flexDirection="row" spacing={1} alignItems="center">

                <Box
                    component="img"
                    alt="auth"
                    src={'/logo/logo_single.png'}
                    sx={{
                        maxWidth: {
                            xs: 30,

                        },
                        maxHeight: {
                            xs: 30,

                        },
                    }}
                />
                <Typography color="primary" sx={{ fontWeight: 'bold' }} variant="h5">ANITIME</Typography>
            </Stack>
        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, px: 4, py: 2 }}>
            <Stack flexDirection="row" alignItems="flex-start" justifyContent="space-between">
                <Box>
                    <Typography>Invoice to:</Typography>
                    <Typography sx={{ textTransform : 'capitalize' }}>{dataInvoice?.expand.wholesaler.name}</Typography>
                </Box>
                <Box>
                    <Stack flexDirection={'row'}>
                        <Typography style={{ minWidth: 100 }} flexGrow={1}>Invoice#</Typography>
                        {/* <Typography></Typography> */}

                        <Typography>: {dataInvoice?.id}</Typography>
                    </Stack>
                    <Stack flexDirection={'row'}>
                        <Typography style={{ minWidth: 100 }} flexGrow={1}>Date</Typography>

                        <Typography>: {fDate(dataInvoice?.created)}</Typography>
                    </Stack>
                </Box>
            </Stack>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table
                    sx={{
                        '& .MuiTableCell-sizeMedium': {
                            padding: '10px 16px',
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* {rows.map((row) => (
                            <TableRow
                                key={row.item}
                            >
                                <TableCell component="th" scope="row">
                                    {row.item}
                                </TableCell>
                                <TableCell align="right">{row.qty}</TableCell>
                                <TableCell align="right">
                                    <FormatRupiah value={row.unitPrice} />
                                </TableCell>
                                <TableCell align="right">
                                    <FormatRupiah value={row.total} />
                                </TableCell>
                            </TableRow>
                        ))} */}
                        <TableRow
                            
                        >
                            <TableCell component="th" scope="row">
                                {dataInvoice?.expand.ternak.jenisBreed}
                            </TableCell>
                            <TableCell align="right">1</TableCell>
                            <TableCell align="right">
                                <FormatRupiah value={dataInvoice?.harga} />
                            </TableCell>
                            <TableCell align="right">
                                <FormatRupiah value={Number(1 * dataInvoice?.harga)} />
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ borderTop: '1px solid #000' }}>
                            <TableCell>
                                Payment Method
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rp. 50.000.000</TableCell>

                        </TableRow>
                        <TableRow sx={shorterPaddingStyle}>
                            <TableCell>
                                <Typography>{dataInvoice?.metodePembayaran}</Typography>

                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Biaya Layanan</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rp. 1.500.000</TableCell>
                        </TableRow>
                        <TableRow sx={shorterPaddingStyle}>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Tax(0%)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rp. 0</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right" style={{ borderTop: '1px solid #000', fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell align="right" style={{ borderTop: '1px solid #000', fontWeight: 'bold' }}>Rp. 51.500.000</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    )

    const modalFooter = (
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={5} p={4}>
            <Button
                variant="contained"
                size="large"
                sx={{
                    backgroundColor: (theme) => theme.palette.text.disabled,
                }}
                onClick={onClose}
            >
                Batal
            </Button>
            <Button
                color="primary"
                variant="contained"
                size="large"
                type="submit"

            >
                Bayar
            </Button>
        </Box>
    )

    // const schema = Yup.object().shape({
    //     kategori: Yup.string().required('Nama Kandang is required'),
    //     tipe: Yup.string().required('Area is required'),
    //     jumlah: Yup.string().required('Nama Kandang is required'),
    //     nilai: Yup.string().required('Area is required'),
    // });

    // const defaultValues = {
    //     kategori: '',
    //     tipe: '',
    //     jumlah: '',
    //     nilai: '',
    // };

    // const methods = useForm({
    //     resolver: yupResolver(schema),
    //     defaultValues,
    // });

    // const {
    //     reset,
    //     handleSubmit,
    //     formState: { isSubmitting },
    // } = methods;

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={style}>
                    <Scrollbar sx={{ maxHeight: '80vh' }}>
                        {modalHeader}
                        {/* <FormProvider onSubmit={onSubmit}> */}
                        {modalBody}
                        {modalFooter}
                        {/* </FormProvider> */}
                    </Scrollbar>
                </Box>
            </Modal>

        </>
    )
}