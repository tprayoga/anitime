import {
    Button, Checkbox, Chip, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, MenuItem, Modal, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, {
    RHFAutocomplete, RHFCheckbox, RHFMultiCheckbox, RHFSelect, RHFTextField, RHFUpload, RHFUploadAvatar, RHFUploadBox, RHFUploadField
} from 'src/components/hook-form';
import { LoadingButton } from "@mui/lab";
import RHFDatePicker from "../../hook-form/rhf-datepicker";
import Scrollbar from "../../scrollbar";
import { useEffect, useState } from "react";
import { useCreateData } from "src/api/custom-api";
import { useSnackbar } from "notistack";
import TableHeadAnitimeCustom from "src/components/tableAnitimeCustom/table-head";
import Iconify from "src/components/iconify";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: 900 },
    bgcolor: 'background.paper',
    borderRadius: 1,
};

const TABLE_HEAD = [
    { id: 'obat', label: 'Obat', disabled: true },
    { id: 'dosis', label: 'Dosis', disabled: true },
    { id: 'caraPemberian', label: 'Cara Pemberian', disabled: true },
    { disabled: true },
]

const NAMA_OBAT_OPTIONS = [
    { label: 'Vaksin PMK', value: 'Vaksin PMK' },
    { label: 'BEF (Bovine Ephemeral Fever)', value: 'BEF (Bovine Ephemeral Fever)' },
    { label: 'HS (P. Multicoda Robert type B)', value: 'HS (P. Multicoda Robert type B)' },
    { label: 'Black Quarters', value: 'Black Quarters' },
    { label: 'Anthrax', value: 'Anthrax' },
    { label: 'LSD (Lumpy Skin Disease)', value: 'LSD (Lumpy Skin Disease)' },
    { label: 'Liquid Paraffin', value: 'Liquid Paraffin' },
    { label: 'Bloat Oil (Intervet)', value: 'Bloat Oil (Intervet)' },
    { label: 'Cetrigen (Fly Repellent)', value: 'Cetrigen (Fly Repellent)' },
    { label: 'Gusanex (Fly Repellent)', value: 'Gusanex (Fly Repellent)' },
    { label: 'Orbenin (Eye Ointment)', value: 'Orbenin (Eye Ointment)' },
    { label: 'Bicarbonate of Soda', value: 'Bicarbonate of Soda' },
    { label: 'Cuka', value: 'Cuka' },
    { label: 'Garam Epsom', value: 'Garam Epsom' },
    { label: 'Alkohol 70%', value: 'Alkohol 70%' },
    { label: 'Larutan Povidone Iodine 1%', value: 'Larutan Povidone Iodine 1%' },
    { label: 'Disinfektan Klorheksidin 0.5%', value: 'Disinfektan Klorheksidin 0.5%' },
    { label: 'Short Acting Penicillin (Broad Spectrum)', value: 'Short Acting Penicillin (Broad Spectrum)' },
]

const NAMA_VAKSIN_OPTIONS = []

const JENIS_OBAT_OPTIONS = [
    { label: 'Vaksin', value: 'Vaksin' },
    { label: 'Parasiticedes', value: 'Parasiticedes' },
    { label: 'Antibiotik', value: 'Antibiotik' },
    { label: 'Anti-inflammatory drugs', value: 'Anti-inflammatory drugs' },
    { label: 'Eye Preparations', value: 'Eye Preparations' },
    { label: 'Topical Wound Treatments', value: 'Topical Wound Treatments' },
]

export default function DiagnosisModal({ open, onClose, diagnosisData, handleNext,...other }) {

    const { createData: createLingkungan } = useCreateData();
    const { enqueueSnackbar } = useSnackbar();
    const [daftarObatList, setDaftarObatList] = useState([]);

    const handleAddButton = () => {
        const data = {
            namaObat: '',
            dosis: '',
            caraPemberian: ''
        }
        setDaftarObatList([
            ...daftarObatList,
            data
        ])
    }

    const handleChangeOptions = (event, index) => {
        const { name, value } = event.target;
        const updatedList = [...daftarObatList];
        updatedList[index] = {
            ...updatedList[index],
            [name]: value,
            dosis: '20 ml/kg BB',
            caraPemberian: 'Intramuscular IM'
        };
        setDaftarObatList(updatedList);
    }
    const handleDelete = (index) => {
        const updatedList = daftarObatList.filter((_, i) => i !== index);
        setDaftarObatList(updatedList);
    }

    const schema = Yup.object().shape({
        diagnosis: Yup.string().required('Diagnosis wajib diisi !'),
        hasilUjiLab: Yup.mixed().required('Hasil Uji Lab wajib diisi !'),
        keterangan: Yup.string().required('Keterangan wajib diisi !'),
        // prognosis: Yup.string().required('Kebersihan is required'),
        // deskripsiKondisiSekitar: Yup.string().required('Deskripsi is required'),
    });

    const defaultValues = {
        diagnosis: diagnosisData,
        hasilUjiLab: undefined,
        keterangan: '',
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
        setValue
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
            <Typography sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize' }}>Diagnosis</Typography>
        </Box>
    )

    const modalBody = (
        <Box sx={{ borderRadius: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <RHFTextField name="diagnosis" label="Diagnosis" />
            <RHFUploadField name="hasilUjiLab" label="Lampiran Hasil Uji Lab" multiple={true} />
            <RHFTextField name="keterangan" label="Keterangan Hasil Lab" multiline rows={3}/>
            {/* <RHFSelect name="prognosis" label="Prognosis">
                <MenuItem value="fausta">Fausta</MenuItem>
                <MenuItem value="infausta">Infausta</MenuItem>
                <MenuItem value="dubius">Dubius</MenuItem>
            </RHFSelect>
            {watch('prognosis') !== 'infausta' &&
                <RHFAutocomplete
                    name="Terapi"
                    placeholder="+ Terapi"
                    multiple
                    options={JENIS_OBAT_OPTIONS?.map((option) => option.value)}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => (
                        <li {...props} key={option}>
                            {option}
                        </li>
                    )}
                    renderTags={(selected) =>
                        selected.map((option, index) => (
                            <Chip
                                sx={{ ml: 1 }}
                                key={option}
                                label={option}
                                size="small"
                                color="info"
                                variant="soft"
                            />
                        ))
                    }
                    onChange={(event, newValue) => {
                        setValue('skills', newValue);
                        const newestValue = newValue[newValue.length - 1];
                        handleAddButton(newestValue);
                    }}
                />
            }
            {daftarObatList.length > 0 &&
                <TableContainer sx={{ position: 'relative', overflow: 'unset', mt: 1 }}>
                    <Table size={'medium'}>
                        <TableHeadAnitimeCustom headLabel={TABLE_HEAD} data={daftarObatList} />
                        <TableBody>
                            {daftarObatList.map((data, index) => (
                                <TableRow hover key={index}>
                                    <TableCell sx={{ width: '30%' }}>
                                        <Select
                                            value={data.namaObat}
                                            name="namaObat"
                                            label="Nama Obat"
                                            fullWidth
                                            size="small"
                                            onChange={(event) => handleChangeOptions(event, index)}
                                        >
                                            {NAMA_OBAT_OPTIONS.map((option) => (
                                                <MenuItem value={option.value} key={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell>{data.dosis}</TableCell>
                                    <TableCell>{data.caraPemberian}</TableCell>
                                    <TableCell width={'5%'}>
                                        <Iconify
                                            icon="ph:trash-bold"
                                            color="red"
                                            sx={{ '&:hover': { cursor: 'pointer' } }}
                                            onClick={() => handleDelete(index)}

                                        // onClick={() => { handleDelete(RFID); }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }

            <RHFSelect
                name="statusHewan"
                label="Status Hewan"
                fullWidth
            >
                <MenuItem value={'aktif'} >Aktif</MenuItem>
                <MenuItem value={'mati'} >Mati</MenuItem>
                <MenuItem value={'sakit'} >Sakit</MenuItem>
            </RHFSelect> */}
        </Box>
    )

    const modalFooter = (
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1 }} mt={4} p={4}>
            <Button
                variant="outlined"
                onClick={onClose}
            >
                Batal
            </Button>
            <LoadingButton
                color="primary"
                variant="contained"
                type="submit"
                loading={isSubmitting}
            >
                Next &gt;&gt;
            </LoadingButton>
        </Box>
    )

    const onSubmit = handleSubmit(async (data) => {
        handleNext();
    });

    useEffect(() => {
        setValue('diagnosis', diagnosisData);
    }, [diagnosisData])

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
