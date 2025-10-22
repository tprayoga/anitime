'use client';

import uuidv4 from 'src/utils/uuidv4';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Typography, MenuItem } from '@mui/material';

import { useTable, TablePaginationCustom } from 'src/components/table';

import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import DataGridAnitime from 'src/components/dataGridAnitime';
import { RouterLink } from 'src/routes/components';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useDeleteTernak } from 'src/api/anak-kandang/ternak';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { useGetData, useGetOneData } from 'src/api/custom-domba-api';
import { useBoolean } from 'src/hooks/use-boolean';

export default function PlasmaView() {
  const { user } = useAuthContext();

  const table = useTable();
  const popover = usePopover();
  const theme = useTheme();

  const settings = useSettingsContext();

  const {
    data: dataUsers,
    getData: getUsers,
    loading: loadingUsers,
    totalData: totalUsers,
  } = useGetData();

  const { getData: getTotalTernak } = useGetData();

  const { deleteTernak, isSubmitting } = useDeleteTernak();

  const confirm = useBoolean();
  const openModal = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState('');
  const [dataGridTable, setDataGridTable] = useState({
    page: 0,
    pageSize: 5,
    orderBy: '',
    order: 'desc',
    filter: '',
  });

  const onDataGridChange = (page) => {
    setDataGridTable({ ...dataGridTable, ...page });
  };

  const handleDelete = async () => {
    try {
      await deleteTernak(selectedRow.id);
      enqueueSnackbar('Success', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed', { variant: 'error' });
    } finally {
      popover.onClose();
      confirm.onFalse();
      fetchData();
    }
  };

  const fetchData = () => {
    getUsers(
      dataGridTable?.page + 1,
      dataGridTable?.pageSize,
      `role = "peternakan"`,
      dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      'users'
    );
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Nama Plasma',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <Typography
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: '#00BFFF',
            },
            typography: 'caption',
            py: 2,
          }}
          onClick={() => {
            window.open(`${paths.dombaIntiPeternakan.plasma.detail(params?.row?.id)}`, '_blank');
          }}
        >
          {params?.row?.name}
        </Typography>
      ),
    },
    {
      field: 'alamat',
      headerName: 'Alamat',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'phone',
      headerName: 'No Handhpone',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => `+62 ${params.row.phone}`,
    },
    {
      field: 'totalTernak',
      headerName: 'Total Ternak',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => `${params?.row?.totalTernak || 0} Ternak`,
    },
  ];

  useEffect(() => {
    const fetchTernakKandang = async () => {
      if (dataUsers) {
        const updatedData = await Promise.all(
          dataUsers.map(async (user) => {
            let totalTernak = 0;
            try {
              const resJumlahTernak = await getTotalTernak(
                1,
                5,
                `kandang.peternakan = "${user.id}"`,
                '-created',
                'ternak'
              );
              totalTernak = resJumlahTernak.totalItems;
            } catch (error) {
              console.error('Error fetching ternak data:', error);
            }

            return {
              ...user,
              totalTernak,
            };
          })
        );

        setTableData(updatedData);
      }
    };

    fetchTernakKandang();
  }, [dataUsers]);

  useEffect(() => {
    setDataGridTable({ ...dataGridTable, page: 0 });
    if (dataGridTable?.orderBy !== 'no') {
      fetchData();
    }
  }, [dataGridTable?.filter]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    if (dataGridTable?.orderBy !== 'no') {
      fetchData();
    }
  }, [dataGridTable?.page, dataGridTable?.pageSize, dataGridTable?.order, dataGridTable?.orderBy]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                width={'100%'}
              >
                <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                  Data Plasma
                </Typography>

                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    window.open(`${paths.dombaIntiPeternakan.plasma.create}`, '_blank');
                  }}
                  sx={{
                    mr: 2,
                  }}
                >
                  + Tambah Data
                </Button>
              </Stack>
              <Box>
                <DataGridAnitime
                  data={tableData}
                  columns={columns}
                  table={dataGridTable}
                  totalData={totalUsers}
                  loading={loadingUsers}
                  onDataGridChange={onDataGridChange}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  disableMultipleRowSelection
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem href={`${paths.anakKandang.ternak.edit(selectedRow.id)}`} component={RouterLink}>
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ternak ${selectedRow.RFID}?`}
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}
