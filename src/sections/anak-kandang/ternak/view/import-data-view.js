'use client';

import { useTheme } from "@emotion/react";
import { Button, Card, CardContent, Divider, Grid, Table, TableBody, TableContainer, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettingsContext } from "src/components/settings";
import Papa from "papaparse";
import { useCreateTernak } from "src/api/anak-kandang/ternak";
// import { enqueueSnackbar } from "notistack";
import { useGetKandang, useUpdateKandang } from "src/api/anak-kandang/kandang";
import { useAuthContext } from "src/auth/hooks";

import Iconify from "src/components/iconify";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useRouter } from "next/navigation";
import { paths } from "src/routes/paths";
import HistoryImportRow from "../history-import-row";
import Scrollbar from "src/components/scrollbar";
import TableHeadAnitimeCustom from "src/components/tableAnitimeCustom/table-head";
import OverviewKandang from "../overview-kandang";
import pb from "src/utils/pocketbase";
// import { useSnackbar } from "notistack";
import { useSnackbar } from 'src/components/snackbar';


const TABLE_HEAD = [
    { id: 'row', label: 'Row' },
    { id: 'status', label: 'Status' },
    { id: 'messages', label: 'Messages' },
    { id: 'record', label: 'Record' },

]
export default function ImportDataView() {

    const settings = useSettingsContext();
    const theme = useTheme();
    const user = useAuthContext();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();


    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState();
    const [resultData, setResultData] = useState(null);
    const [failedData, setFailedData] = useState([]);


    const handleUpload = (event) => {
        const files = event.target.files;
        if (files) {
            const uploadedFile = files[0];
            const fileType = uploadedFile.type;

            if (fileType !== 'text/csv') {
                enqueueSnackbar('Please upload a CSV file.', { variant: 'error' });
                return;
            }

            setFile(uploadedFile);
        }
    }

    const handleDelete = () => {
        setFile(null);
    }

    const handleSubmit = async () => {

        if(!file){
            enqueueSnackbar('Please input file !', { variant: 'error' });
            return;
        }
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('csvFile', file);
            formData.append('peternakan', user.user.createdBy)

            // domain
            const response = await axios.post('https://anitime-import.bodha.co.id/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${pb.authStore.token}`
                }
            });

            // local
            // const response = await axios.post('http://localhost:5000/upload', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //         'Authorization' : `${pb.authStore.token}`
            //     }
            // });
            if (response) {
                setResultData(response.data);
                setFailedData(response.data.failedData);
            }


            enqueueSnackbar('Data Successfully Imported', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Something error happened', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
            setFile(null);
        }
    };

    const handleDownloadFormat = () => {
        const fileUrl = '/FORMAT-ANITIME-IMPORT.zip';

        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = 'FORMAT-ANITIME-IMPORT';

        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);
    }

    const handleDownloadFailedData = () => {
        if (failedData.length === 0) {
            enqueueSnackbar('No failed data to download.', { variant: 'error' });
            return;
        }

        const blob = new Blob([failedData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'failed_data.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    useEffect(() => {
        settings.setPageTitle(document.title);
    }, [window.location.pathname]);

    return (
        <>
            {resultData ? (

                <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <OverviewKandang price={resultData?.success} title={'Imported Successfully'} img={'/assets/illustrations/kandang/check.png'} type={'success'} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <OverviewKandang price={resultData?.failed} title={'Imported Failed'} img={'/assets/illustrations/kandang/failed.svg'} type={'failed'} />
                        </Grid>
                        <Grid item xs={12} mt={1}>
                            <Card>
                                <CardContent>
                                    <TableContainer sx={{ position: 'relative', overflow: 'unset', height: 400 }}>

                                        <Scrollbar>
                                            <Table size={'medium'} sx={{ minWidth: 960 }}>

                                                <TableHeadAnitimeCustom
                                                    headLabel={TABLE_HEAD}
                                                    data={resultData?.data}
                                                />

                                                <TableBody>
                                                    <>
                                                        {resultData?.data?.map((row, index) => (
                                                            <HistoryImportRow
                                                                key={index}
                                                                row={row}
                                                                count={index + 1}
                                                            />
                                                        ))}
                                                    </>

                                                </TableBody>
                                            </Table>
                                        </Scrollbar>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Stack flexDirection={'row'} justifyContent={'end'} mt={2} spacing={2}>
                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit"
                            size="large"
                            startIcon={
                                <Iconify
                                    icon="material-symbols:download"
                                />
                            }
                            onClick={handleDownloadFailedData}
                        >
                            Download Failed Data
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            size="large"
                            onClick={() => router.push(paths.anakKandang.ternak.root)}
                        >
                            Selesai
                        </Button>
                    </Stack>
                </Container>
            ) : (
                <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 'medium', mb: 2 }} variant="h5">
                                        Tutorial Import Data
                                    </Typography>
                                    <Box px={1} py={3} sx={{
                                        backgroundColor: theme.palette.grey[200],
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Stack>
                                            <Typography sx={{ fontWeight: 'bold' }}>1. Download CSV Template File</Typography>
                                        </Stack>

                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size='large'
                                            startIcon={
                                                <Iconify
                                                    icon="material-symbols:download"
                                                />
                                            }
                                            onClick={handleDownloadFormat}

                                        >
                                            Unduh
                                        </Button>

                                    </Box>
                                    <Divider />
                                    <Box px={1} py={3} sx={{
                                        backgroundColor: 'inherit',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Stack>
                                            <Typography sx={{ fontWeight: 'bold' }}>2. Perbarui template CSV dengan catatan Anda</Typography>
                                            <Typography ml={2} mt={1}>Menggunakan program seperti Excel, Google Sheets, Open Office atau Meninggalkan baris header di file sejenisnya. Simpan file sebagai file Nilai Dipisahkan Koma (.csv)</Typography>
                                        </Stack>
                                    </Box>
                                    <Divider />
                                    <Box px={1} py={3} sx={{
                                        backgroundColor: theme.palette.grey[200],
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Stack>
                                            <Typography sx={{ fontWeight: 'bold' }}>3. Unggah dan Import File</Typography>
                                        </Stack>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={() => fileInputRef.current.click()}
                                            size='large'
                                            startIcon={
                                                <Iconify
                                                    icon="material-symbols:upload"
                                                />
                                            }
                                        >
                                            Unggah
                                        </Button>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleUpload}
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                        />
                                    </Box>
                                    <Divider />
                                    {file &&
                                        <Box sx={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            mt: 2,
                                            gap: 2,
                                            border: 1,
                                            paddingInline: 2,
                                            paddingBlock: 1,
                                            borderRadius: 1,
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                            '&:hover': {
                                                borderColor: 'rgba(0, 0, 0, 0.5)',
                                            },
                                            '&:focus-within': {
                                                borderColor: '#2196f3',
                                            },
                                        }}>
                                            <Iconify icon={'mdi:file'} variant="primary" sx={{ color: '#22E55E', width: 32, height: 32 }} />
                                            <Box>
                                                <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{file.name}</Typography>
                                                <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.8rem' }}>{file.size} bytes</Typography>
                                            </Box>
                                            <Iconify
                                                icon={'material-symbols-light:close'}
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    ml: 'auto',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        cursor: 'pointer'
                                                    }
                                                }}
                                                onClick={handleDelete}
                                            />

                                        </Box>
                                    }
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={10} p={4}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            backgroundColor: (theme) => theme.palette.text.disabled,
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <LoadingButton
                                        variant="contained"
                                        color="primary"
                                        loading={isSubmitting}
                                        onClick={handleSubmit}
                                        type="submit"
                                        size="large"

                                    >
                                        Rekam Data
                                    </LoadingButton>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </>
    )
}