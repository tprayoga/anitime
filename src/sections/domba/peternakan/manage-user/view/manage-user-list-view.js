'use client';

import uuidv4 from 'src/utils/uuidv4';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Button,
  Card,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import DataGridAnitime from 'src/components/dataGridAnitime';
import { useGetData } from 'src/api/custom-domba-api';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useDebounce } from 'src/hooks/use-debounce';
import { TablePaginationCustom } from 'src/components/table';
import { paths } from 'src/routes/paths';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import { useDeleteUser, useGetUser } from 'src/api/domba/manage-user';
import { RouterLink } from 'src/routes/components';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export default function ManageUserView() {
  const { user } = useAuthContext();

  const { data: dataUser, loading: loadingUser, totalData: totalUser, getUser } = useGetUser();
  const { dataUser: dataDelete, deleteUser } = useDeleteUser();

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [loadingDelete, setLoadingDelete] = useState(false);

  const [idDelete, setIdDelete] = useState(null);

  const confirm = useBoolean();

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

  const roleConvert = (role) => {
    const result = role.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);

    return finalResult;
  };

  const adminToken = sessionStorage.getItem('adminToken');

  const refetchUser = () => {
    getUser(1, dataGridTable?.rowsPerPage, options()?.filter, options()?.sort, adminToken);
  };

  const handleDeleteRow = useCallback(
    async (id) => {
      setLoadingDelete(true);
      try {
        await deleteUser(idDelete, adminToken);

        enqueueSnackbar(`Success Delete User`, { variant: 'success' });

        refetchUser();
      } catch (error) {
        enqueueSnackbar(`Failed Delete User`, { variant: 'error' });

        console.error('Error delete', error);

        refetchUser();
      } finally {
        confirm.onFalse();
        setLoadingDelete(false);
      }
    },
    [refetchUser]
  );

  const columns = [
    {
      field: 'no',
      headerName: 'No',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      hideable: false,
      sortable: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      hideable: false,
      renderCell: (params) => `${params?.row?.name}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      renderCell: (params) => `${params?.row?.email}`,
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params) => `${roleConvert(params?.row?.role)}`,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: 'Actions',
      align: 'center',
      headerAlign: 'center',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          component={RouterLink}
          href={paths.dombaPeternakan.manageUser.edit(params.row.id)}
          // onClick={() => console.info('EDIT', params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            setIdDelete(params.row.id);
            confirm.onTrue();
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const options = () => {
    return {
      filter: `createdBy = "${user?.id}" ${
        dataGridTable?.filter
          ? `&& (name ~ "${dataGridTable?.filter}"
          || email ~ "${dataGridTable?.filter}"
          || role ~ "${dataGridTable?.filter}"
          )`
          : ''
      }`,
      sort: dataGridTable?.orderBy
        ? `${dataGridTable?.order === 'asc' ? '' : '-'}${dataGridTable?.orderBy}`
        : '-created',
      expand: 'createdBy',
      collection: 'users',
    };
  };

  useEffect(() => {
    setTableData(dataUser.map((item, index) => ({ ...item, no: index + 1 })));
  }, [dataUser]);

  useEffect(() => {
    setDataGridTable({ ...dataGridTable, page: 0 });

    getUser(1, dataGridTable?.rowsPerPage, options()?.filter, options()?.sort, adminToken);
  }, [dataGridTable?.filter]);

  useEffect(() => {
    getUser(
      dataGridTable?.page + 1,
      dataGridTable?.rowsPerPage,
      options()?.filter,
      options()?.sort,
      adminToken
    );
  }, [dataGridTable?.page, dataGridTable?.pageSize, dataGridTable?.order, dataGridTable?.orderBy]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card>
            <Stack
              spacing={2}
              direction={{ xs: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'center' }}
            >
              <Typography variant="h4" sx={{ ml: 2, my: 3 }}>
                Manage User
              </Typography>

              <Button
                color="primary"
                variant="contained"
                sx={{
                  ml: 'auto',
                }}
                component={RouterLink}
                href={paths.dombaPeternakan.manageUser.new}
              >
                + Tambah User
              </Button>
            </Stack>

            <DataGridAnitime
              data={tableData}
              columns={columns}
              table={dataGridTable}
              totalData={totalUser}
              loading={loadingUser}
              onDataGridChange={onDataGridChange}
              disableRowSelectionOnClick
              disableColumnMenu
              disableMultipleRowSelection
            />
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            disabled={loadingDelete}
            variant="contained"
            color="error"
            onClick={() => handleDeleteRow()}
          >
            {loadingDelete ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </Container>
  );
}
