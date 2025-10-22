import PropTypes from 'prop-types';
import {
  Button,
  Card,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
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
      return `-${orderBy}`; // Default Value
  }
};

export default function TableAnitime({
  label,
  tableHead,
  statusOptions = [],
  onClickedFirstColumn,
  customeTableRow,
  customConfirmDialog,
  //
  collectionId,
  expand,
  //
  filter,
  //
  actionProps,
  listPopovers,
  //
  onRefetchData,
  disabledDelete,
}) {
  const table = useTable({
    defaultOrderBy: 'updated',
    defaultOrder: 'desc',
  });

  const { user } = useAuthContext();

  const debounceFilter = useDebounce(filter);
  const loadingDelete = useBoolean();

  const { data: dataDb, total: totalData, empty, loading, error, refetch } = useListData();
  const data = useMemo(() => {
    return dataDb.map((row, index) => {
      if (row?.expand) {
        return {
          no: table.page * table.rowsPerPage + index + 1,
          ...row,
          ...row.expand,
          berat: `${row.berat} Kg`,
          jumlah: `${row.jumlah} Ekor`,
        };
      } else {
        return {
          no: table.page * table.rowsPerPage + index + 1,
          ...row,
          berat: `${row.berat} Kg`,
          jumlah: `${row.jumlah} Ekor`,
        };
      }
    });
  }, [dataDb]);

  const keys = useMemo(() => {
    return tableHead.map(({ id }) => {
      return id;
    });
  }, [tableHead]);

  const [statusOptionsData, setStatusOptionsData] = useState(statusOptions);
  const [statusOption, setStatusOption] = useState(statusOptions[0]?.value || '');

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = (!loading && data.length === 0) || empty;

  const confirm = useBoolean();

  useEffect(() => {
    if (collectionId) {
      const { page, rowsPerPage, order, orderBy } = table;

      let filter = '';

      if (statusOption.length) {
        const splitFilter = statusOption.split('.');
        const key = splitFilter[0];
        const value = splitFilter[1];

        if (debounceFilter) {
          if (value !== 'All') {
            filter = `${key} = "${value}" && ${keys[1]} ~ "${debounceFilter}" && peternakan = "${user.id}"`;
          } else {
            filter = `${keys[1]} ~ "${debounceFilter}" && peternakan = "${user.id}"`;
          }
        } else {
          if (value !== 'All') {
            filter = `${key} = "${value}" && peternakan = "${user.id}"`;
          } else {
            filter = `peternakan = "${user.id}"`;
          }
        }
      } else {
        filter = debounceFilter ? `${keys[1]}~"${debounceFilter}"` : '';
      }

      refetch(collectionId, page + 1, rowsPerPage, {
        expand,
        sort: getSortOrder(order, orderBy),
        filter,
      });
    }
  }, [
    table.page,
    table.rowsPerPage,
    table.order,
    table.orderBy,
    collectionId,
    debounceFilter,
    onRefetchData,
    statusOption,
  ]);

  const handleDeleteRow = useCallback(
    async (id) => {
      loadingDelete.onTrue();

      const { page, rowsPerPage, order, orderBy } = table;
      const filter = debounceFilter ? `${keys[1]}~"${debounceFilter}"` : '';
      try {
        await useDeleteData(collectionId, id);
        refetch(collectionId, page + 1, rowsPerPage, {
          expand,
          sort: getSortOrder(order, orderBy),
          filter,
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
    const filter = debounceFilter ? `${keys[1]}~"${debounceFilter}"` : '';

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
    table.onResetPage();
    setStatusOption(newValue);
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const sumArrayofObjects = (arr, key) => {
    const sum = arr.reduce((accumulator, object) => {
      return accumulator + (object[key] || 0);
    }, 0);

    return sum;
  };

  return (
    <>
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
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={(tab.value === statusOption && 'filled') || 'soft'}
                  color={tab.color || 'default'}
                >
                  {tab.label === 'Semua'
                    ? sumArrayofObjects(statusOptions, 'total')
                    : tab.total || 0}
                </Label>
              }
            />
          ))}
        </Tabs>
      ) : null}
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
                        onConfirm={customConfirmDialog}
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
    </>
  );
}

TableAnitime.propTypes = {
  label: PropTypes.string,
  tableHead: PropTypes.array,
  onClickedFirstColumn: PropTypes.func,
  customeTableRow: PropTypes.arrayOf(PropTypes.object),
  collectionId: PropTypes.string,
  expand: PropTypes.string,
  filter: PropTypes.string,
};
