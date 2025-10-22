'use client';

import { paths } from 'src/routes/paths';
import uuidv4 from 'src/utils/uuidv4';
import { RouterLink } from 'src/routes/components';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Breadcrumbs,
  Card,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import KandangTableRow from '../pemeriksaan-lengkap-table-row';
import KandangTableToolbar from '../ternak-table-toolbar';
import KandangTableHead from '../ternak-table-head';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import OverviewKandang from '../overview-kandang';
import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';
import Label from 'src/components/label';
import ComponentBlock from 'src/sections/_examples/component-block';
import Link from 'next/link';
import AnitimeBreadcrumbs from 'src/components/custom-breadcrumbs/anitime-breadcrumbs';
import RiwayatTableRow from '../riwayat-table-row';
import { RHFSelect } from 'src/components/hook-form';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TernakDetailView({ id }) {
  const { user } = useMockedUser();

  const popover = usePopover();

  const table = useTable();

  const theme = useTheme();

  const settings = useSettingsContext();

  const denseHeight = table.dense ? 60 : 80;

  const confirm = useBoolean();

  const [filters, setFilters] = useState('');
  const [status, setStatus] = useState('');
  const [dataFiltered, setDataFiltered] = useState([]);
  const [kandangLoading, setKandangLoading] = useState(false);

  const data = [
    {
      id: '1',
      kandang: 'Kandang 1',
      luas: 100,
      jumlahTernak: 200,
    },
    {
      id: '2',
      kandang: 'Kandang 2',
      luas: 100,
      jumlahTernak: 200,
    },
    {
      id: '3',
      kandang: 'Kandang 3',
      luas: 100,
      jumlahTernak: 200,
    },
    {
      id: '4',
      kandang: 'Kandang 4',
      luas: 100,
      jumlahTernak: 200,
    },
  ];

  const dataRiwayat = [
    {
      id: '1',
      tanggal: '2023-12-25',
      jenisHewan: 'Sapi Potong',
      jumlahTernak: 200,
      status: 'In',
      deskripsi: 'Deskripsi',
    },
    {
      id: '2',
      tanggal: '2023-12-25',
      jenisHewan: 'Sapi Potong',
      jumlahTernak: 200,
      status: 'Out',
      deskripsi: 'Deskripsi',
    },
    {
      id: '3',
      tanggal: '2023-12-25',
      jenisHewan: 'Sapi Potong',
      jumlahTernak: 200,
      status: 'Out',
      deskripsi: 'Deskripsi',
    },
    {
      id: '4',
      tanggal: '2023-12-25',
      jenisHewan: 'Sapi Potong',
      jumlahTernak: 200,
      status: 'In',
      deskripsi: 'Deskripsi',
    },
    {
      id: '5',
      tanggal: '2023-12-25',
      jenisHewan: 'Sapi Potong',
      jumlahTernak: 200,
      status: 'Out',
      deskripsi: 'Deskripsi',
    },
    {
      id: '6',
      tanggal: '2023-12-25',
      jenisHewan: 'Sapi Potong',
      jumlahTernak: 200,
      status: 'In',
      deskripsi: 'Deskripsi',
    },
  ];

  const handleFilters = (name, value) => {
    setFilters(value);
    setDataFiltered(
      data.filter((item) => item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
    );
  };

  const onCustomSort = (array, sort) => {
    if (sort === 'asc') {
      setDataFiltered(array.slice().sort((a, b) => b.name.localeCompare(a.name)));
      table.setOrder('desc');
    } else {
      setDataFiltered(array.slice().sort((a, b) => a.name.localeCompare(b.name)));
      table.setOrder('asc');
    }
  };

  const TABLE_HEAD = [
    { id: 'tanggal', label: 'Tanggal' },
    { id: 'jenisHewan', label: 'Jenis Hewan' },
    { id: 'jumlahTernak', label: 'Jumlah Ternak' },
    { id: 'status', label: 'Status' },
    { id: 'deskripsi', label: 'Deskripsi' },
    { id: '' },
  ];

  const statusOptions = [
    { value: 'pakan', label: 'Pemberian Pakan' },
    { value: 'welfare', label: 'Catatan Welfare' },
    { value: 'surveilans', label: 'Surveilans Penyakit' },
  ];

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  useEffect(() => {
    if (id) {
      setDataFiltered(data.filter((item) => item.id === id));
    }
  }, []);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AnitimeBreadcrumbs
            links={[
              { name: 'Data Ternak', href: paths.peternakan.ternak.root },
              { name: `${dataFiltered[0]?.kandang}` },
            ]}
            action={
              <Stack spacing={2} direction={'row'}>
                <Button
                  color="primary"
                  variant="contained"
                  endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  onClick={popover.onOpen}
                  // sx={{ textTransform: 'capitalize' }}
                >
                  Rekam Aktivitas
                </Button>
                <Button
                  component={RouterLink}
                  href={paths.dashboard.user.new}
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="ic:baseline-edit" />}
                >
                  Edit
                </Button>
              </Stack>
            }
            // sx={{ mb: { xs: 3, md: 5 } }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Stack spacing={3}>
            <Card>
              <Box sx={{ pl: 2, py: 1, backgroundColor: '#DBE9FC' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  size="large"
                  sx={{ fontSize: 17, color: 'black' }}
                >
                  Informasi Dasar
                </Button>
              </Box>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                <Typography>Jenis Hewan : Sapi Potong</Typography>
                <Typography>No Tag (FID) : A0001 (Telinga Kiri)</Typography>
                <Typography>Medical History : N/A</Typography>
                <Typography>Lokasi Kandang : Kandang 1</Typography>
              </Stack>
            </Card>

            <Card>
              <Box sx={{ pl: 2, py: 1, backgroundColor: '#F9FCDB' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  size="large"
                  sx={{ fontSize: 17, color: 'black' }}
                >
                  Informasi Kelahiran
                </Button>
              </Box>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                <Typography>Umur : 3 Bulan</Typography>
                <Typography>Tanggal Lahir : 12 November 2023</Typography>
                <Typography>Berat : 50 Kg</Typography>
                <Typography>Asal : Australia</Typography>
              </Stack>
            </Card>

            <Card>
              <Box sx={{ pl: 2, py: 1, backgroundColor: '#EAFFEA' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  size="large"
                  sx={{ fontSize: 17, color: 'black' }}
                >
                  Informasi Tambahan
                </Button>
              </Box>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                <Typography>RFID : 009288816766271</Typography>
                <Typography>ID Indentik PKH : 0890237765</Typography>
                <Typography>Rata-rata Pakan/Hari : 200</Typography>
              </Stack>
            </Card>

            <Card>
              <Box sx={{ pl: 2, py: 1, backgroundColor: '#FFE8E8' }}>
                <Button
                  startIcon={<Iconify icon="material-symbols:info" sx={{ color: 'blue' }} />}
                  variant={'text'}
                  size="large"
                  sx={{ fontSize: 17, color: 'black' }}
                >
                  Karakter Fisik
                </Button>
              </Box>
              <Stack sx={{ p: 3, pl: 6 }} spacing={1}>
                <Typography>Jenis Kelamin : Jantan</Typography>
                <Typography>Breed : Limosin</Typography>
                <Typography>Warna : Coklat</Typography>
                <Typography>Berat : 100 Kg</Typography>
                <Typography>Body Conditional Score (BCS): 3 (Sedang)</Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ minHeight: '100vh', p: 3 }}>
            <Stack direction={'row'} spacing={2}>
              <Button
                component={RouterLink}
                href={paths.dashboard.user.new}
                variant="contained"
                sx={{ backgroundColor: '#E3F8FF', color: 'black' }}
              >
                Aktivitas
              </Button>

              <Button
                startIcon={<Iconify icon="material-symbols:mail" />}
                variant={'text'}
                color="inherit"
                sx={{ fontWeight: 'normal' }}
              >
                23 Nov 2023
              </Button>

              <Button variant={'text'} color="inherit" sx={{ fontWeight: 'bold' }}>
                Berat 100 Kg
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        // sx={{ width: 140 }}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === status}
            onClick={() => {
              popover.onClose();
              handleChangeStatus(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </Container>
  );
}
