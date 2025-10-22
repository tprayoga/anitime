'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// _mock
import { _userList, _roles, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';
//
import ManageTableRow from '../manage-table-row';
import ManageTableToolbar from '../manage-table-toolbar';
import ManageTableFiltersResult from '../manage-table-filters-result';
// import { useDeleteGroup, useGetGroups, useGetUsers } from 'src/api/manageuser/database/manageuser';
// import { useDeleteUser } from 'src/api/manageuser/api/manageuser';
import { Box, Stack, Typography } from '@mui/material';
import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import { useDeleteUser, useGetUser } from 'src/api/peternakan/manage-user';
import { useDebounce } from 'src/hooks/use-debounce';
// import SvgIcon from 'src/components/svg-icon';

// ----------------------------------------------------------------------

export default function ManageUserListView() {
  const { user } = useAuthContext();
  const table = useTable();

  const TABLE_HEAD = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email', width: 180 },
    { id: 'role', label: 'Role', width: 180 },
    { id: 'popover', width: 100 },
  ];

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const adminToken = sessionStorage.getItem('adminToken');

  const router = useRouter();

  const confirm = useBoolean();

  const [currentTab, setCurrentTab] = useState('user');

  const { data: dataUser, getUser, loadingUser, totalData } = useGetUser();
  const { dataUser: dataDelete, deleteUser } = useDeleteUser();

  const [tableData, setTableData] = useState([]);
  const [searchData, setSearchData] = useState('');

  const [loadingDelete, setLoadingDelete] = useState(false);

  const debouncedSearch = useDebounce(searchData);

  // const dataInPage = dataFiltered.slice(
  //   table.page * table.rowsPerPage,
  //   table.page * table.rowsPerPage + table.rowsPerPage
  // );

  const denseHeight = table.dense ? 52 : 72;

  // const canReset = !isEqual(defaultFilters, filters);

  // const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const userRefetch = useCallback(() => {
    getUser(
      table.page + 1,
      table.rowsPerPage,
      `createdBy = "${user.id}" ${debouncedSearch ? `&& name ~ "${debouncedSearch}"` : ''}`,
      table.orderBy ? `${table.order === 'asc' ? '' : '-'}${table.orderBy}` : '-created',
      adminToken
    );
  }, []);

  const handleDeleteRow = useCallback(
    async (id) => {
      setLoadingDelete(true);
      try {
        await deleteUser(id, adminToken);

        enqueueSnackbar(`Success Delete User`, { variant: 'success' });

        userRefetch();
      } catch (error) {
        enqueueSnackbar(`Failed Delete User`, { variant: 'error' });

        console.error('Error delete', error);

        userRefetch();
      } finally {
        confirm.onFalse();
        setLoadingDelete(false);
      }
    },
    [userRefetch]
  );

  const handleDeleteRows = useCallback(async () => {
    setLoadingDelete(true);
    try {
      await Promise.all(
        table.selected.map(async (id) => {
          await deleteUser(id, adminToken);
        })
      );
      enqueueSnackbar(`Success Delete Users`, { variant: 'success' });
      userRefetch();
    } catch (error) {
      confirm.onFalse();
      enqueueSnackbar(`Failed Delete`, { variant: 'error' });
      console.error('Error delete', error);
    } finally {
      confirm.onFalse();
      table.setSelected([]);
      setLoadingDelete(false);
    }
  }, [userRefetch, table]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.peternakan.manageUser.edit(id));
    },
    [router]
  );

  useEffect(() => {
    if (dataUser) {
      setTableData(dataUser);
    }
  }, [dataUser]);

  useEffect(() => {
    table.onResetPage();
    if (table.orderBy !== 'no')
      getUser(
        table.page + 1,
        table.rowsPerPage,
        `createdBy = "${user.id}" ${debouncedSearch ? `&& name ~ "${debouncedSearch}"` : ''}`,
        table.orderBy ? `${table.order === 'asc' ? '' : '-'}${table.orderBy}` : '-created',
        adminToken
      );
  }, [debouncedSearch]);

  useEffect(() => {
    if (table.orderBy !== 'no')
      getUser(
        table.page + 1,
        table.rowsPerPage,
        `createdBy = "${user.id}" ${debouncedSearch ? `&& name ~ "${debouncedSearch}"` : ''}`,
        table.orderBy ? `${table.order === 'asc' ? '' : '-'}${table.orderBy}` : '-created',
        adminToken
      );
  }, [table.page, table.rowsPerPage, table.order, table.orderBy]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography variant="h4" sx={{ my: 2 }}>
        Manage User
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" width={'100%'}>
        <Box flexGrow={1}>
          <ManageTableToolbar filters={searchData} setFilters={setSearchData} />
        </Box>

        <Button
          color="primary"
          variant="contained"
          component={RouterLink}
          href={paths.peternakan.manageUser.new}
          size="large"
        >
          + Tambah User
        </Button>
      </Stack>

      <Card>
        <Box>
          <TableContainer sx={{ position: 'relative', overflow: 'unset', height: '45vh' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table stickyHeader size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  data={tableData}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {loadingUser ? (
                    [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {tableData?.map((row, index) => (
                        <ManageTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          rowIndex={table.page * table.rowsPerPage + index + 1}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          loadingDelete={loadingDelete}
                        />
                      ))}
                    </>
                  )}

                  {/* <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                    /> */}

                  <TableNoData notFound={tableData.length === 0} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalData}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Box>
      </Card>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            disabled={loadingDelete}
            onClick={() => {
              handleDeleteRows();
              // confirm.onFalse();
            }}
          >
            {loadingDelete ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </Container>
  );
}
