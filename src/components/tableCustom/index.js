import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import TableRows from './tableRow';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useListData from 'src/api/wholesaler/list';
import { useDebounce } from 'src/hooks/use-debounce';
import useDeleteData from 'src/api/wholesaler/delete';
import Label from 'src/components/label';
import { useAuthContext } from 'src/auth/hooks';

const getSortOrder = (order, orderBy) => {
  switch (order) {
    case 'asc':
      return `+${orderBy}`;
    case 'desc':
      return `-${orderBy}`;
    default:
      return `+${orderBy}`; // Default Value
  }
};

export default function TableCustom({
  label,
  tableHead,
  //
  statusOptions = [],
  defaultStatusOptions,
  onChangeStatusOptions,
  //
  onClickedFirstColumn,
  customeTableRow,
  //
  collectionId,
  expand,
  //
  filter,
  filterByUser,
  fieldNameCreatedBy = 'createdBy',
  filterByPeternakan,
  fieldNamePeternakan = 'peternakan',
  //
  actionProps,
  listPopovers,
  //
  onRefetchData,
  disabledDelete,
  //
  headers,
  //
  searchFilter,
  excludeFilter = [],
}) {
  const { user } = useAuthContext();

  const table = useTable({
    defaultOrderBy: 'created',
    defaultOrder: 'desc',
  });

  const debounceFilter = useDebounce(filter);
  const loadingDelete = useBoolean();

  const { data: dataDb, total: totalData, empty, loading, error, refetch } = useListData();
  const data = useMemo(() => {
    return dataDb.map((row) => {
      if (row?.expand) {
        return {
          ...row,
          ...row.expand,
        };
      } else {
        return row;
      }
    });
  }, [dataDb]);

  const keys = useMemo(() => {
    return tableHead.map(({ id }) => {
      return id;
    });
  }, [tableHead]);

  const [statusOption, setStatusOption] = useState(
    defaultStatusOptions || statusOptions[0]?.filter || ''
  );

  const [search, setSearch] = useState('');

  const debounceSearch = useDebounce(search);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = (!loading && data.length === 0) || empty;

  const confirm = useBoolean();

  function mapKeysAndSearch(keys, search) {
    const result = keys
      .filter((f) => !excludeFilter.includes(f))
      .map((key) => {
        return key.replace(/expand\./g, '');
      })
      .map((key) => `${key} ~ "${search}"`)
      .join(' || ');

    return result;
  }

  console.log(statusOption);

  useEffect(() => {
    if (collectionId) {
      const { page, rowsPerPage, order, orderBy } = table;

      let filter = '';

      if (statusOption.length) {
        if (debounceFilter || debounceSearch) {
          filter = `${statusOption} && ${mapKeysAndSearch(
            keys,
            debounceSearch || debounceFilter
          )} `;
        } else {
          filter = statusOption;
        }
      } else {
        filter = debounceFilter ? `${keys[0]}~"${debounceFilter}"` : '';
      }

      const orderByFiltered = orderBy.replace(/expand\./g, '');
      refetch(collectionId, page + 1, rowsPerPage, {
        expand,
        sort: getSortOrder(order, orderByFiltered),
        filter: filterByUser
          ? `${fieldNameCreatedBy} = "${user.id}" ${filter ? `&& ${filter}` : ''}`
          : filterByPeternakan
            ? `${fieldNamePeternakan} = "${user.createdBy}" ${filter ? `&& ${filter}` : ''}`
            : filter,
        headers,
      });
    }
  }, [
    table.page,
    table.rowsPerPage,
    table.order,
    table.orderBy,
    collectionId,
    debounceFilter,
    debounceSearch,
    onRefetchData,
    statusOption,
    excludeFilter,
  ]);

  const handleDeleteRow = useCallback(
    async (id) => {
      loadingDelete.onTrue();

      const { page, rowsPerPage, order, orderBy } = table;
      const filter = debounceFilter ? `${keys[0]}~"${debounceFilter}"` : '';
      try {
        await useDeleteData(collectionId, id);
        refetch(collectionId, page + 1, rowsPerPage, {
          expand,
          sort: getSortOrder(order, orderBy),
          filter: `${fieldNameCreatedBy} `,
        });
        loadingDelete.onFalse();
      } catch (error) {
        loadingDelete.onFalse();
        console.log(error);
      }
    },
    [refetch, table, expand]
  );

  const handleDeleteRows = useCallback(async () => {
    loadingDelete.onTrue();

    const { page, rowsPerPage, order, orderBy } = table;
    const filter = debounceFilter ? `${keys[0]}~"${debounceFilter}"` : '';

    try {
      await Promise.all(table.selected.map((id) => useDeleteData(collectionId, id)));
      refetch(collectionId, page + 1, rowsPerPage, {
        expand,
        sort: getSortOrder(order, orderBy),
        filter,
      });
      table.onSelectAllRows(false, []);
      loadingDelete.onFalse();
    } catch (error) {
      loadingDelete.onFalse();
      console.log(error);
    }
  }, [refetch, table, expand]);

  const handleFilterStatus = useCallback((event, newValue) => {
    setStatusOption(newValue);
    onChangeStatusOptions(newValue);
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between">
        {statusOptions.length ? (
          <Tabs
            value={statusOption}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {statusOptions.map((tab) => (
              <Tab
                key={tab.filter}
                iconPosition="end"
                value={tab.filter}
                label={tab.label}
                icon={
                  <Label
                    variant={(tab.filter === statusOption && 'filled') || 'soft'}
                    color={tab.color || 'default'}
                  >
                    {tab.total || 0}
                  </Label>
                }
              />
            ))}
          </Tabs>
        ) : null}
        {searchFilter && (
          <Box>
            <TextField
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </Stack>
      <Card>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ m: 3 }}>
          <Typography variant="h4">{label}</Typography>
          {actionProps}
        </Stack>
        {/* 
          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={data.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                data.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
            disabledDelete={disabledDelete}
          />

          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={tableHead}
                rowCount={totalData?.totalItems || data.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    data.map((row) => row.id)
                  )
                }
                disabledDelete={disabledDelete}
              />

              <TableBody>
                {loading
                  ? [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  : data.map((row, index) => (
                      <TableRows
                        key={index}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onClickedFirstColumn={onClickedFirstColumn}
                        customeTableRow={customeTableRow}
                        keys={keys}
                        //
                        loadingDelete={loadingDelete.value}
                        listPopovers={listPopovers}
                        disabledDelete={disabledDelete}
                      />
                    ))}

                {/* <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, totalData)}
                /> */}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalData?.totalItems || data.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />

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
              onClick={() => {
                handleDeleteRows();
                confirm.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />
      </Card>
    </Stack>
  );
}

TableCustom.propTypes = {
  label: PropTypes.string,
  tableHead: PropTypes.array,
  onClickedFirstColumn: PropTypes.func,
  customeTableRow: PropTypes.arrayOf(PropTypes.object),
  collectionId: PropTypes.string,
  expand: PropTypes.string,
  filter: PropTypes.string,
};
