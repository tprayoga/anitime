import {
  Button,
  Card,
  Grid,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import {
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  TableSkeleton,
  useTable,
} from 'src/components/table';
import { IconButton } from 'yet-another-react-lightbox';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'src/hooks/use-debounce';
import { useGetData } from 'src/api/custom-api';
import TableHeadAnitimeCustom from './table-head';
// import { useGetData } from 'src/api/custom-domba-api';

export default function TableAnitimeCustom({
  label,
  filters,
  tableHead,
  tableRowComponent: TableRowComponent,
  collection,
  expand,
  refetch,
  sx,
  ...other
}) {
  const {
    data: tableData,
    error: tableError,
    empty,
    loading: tableLoading,
    totalData: tableCount,
    getData: tableFetch,
  } = useGetData();

  const table = useTable();
  const denseHeight = table.dense ? 60 : 80;
  const debouncedFilter = useDebounce(filters);

  const [dataFiltered, setDataFiltered] = useState([]);
  const [sortValue, setSortValue] = useState();

  let filterValue = `${collection.searchFilter}~"${filters}"`;

  if (collection.filter.length > 0) {
    for (let i = 0; i < collection.filter.length; i++) {
      filterValue += ` && ${collection.filter[i]}`;
    }
  }

  const onCustomSort = (array, sort, data) => {
    if (sort === 'asc') {
      setSortValue(`-${data.id}`);
      table.setOrder('desc');
      table.setOrderBy(data.id);
    } else {
      setSortValue(`${data.id}`);
      table.setOrder('asc');
      table.setOrderBy(data.id);
    }
  };

  useEffect(() => {
    if (tableData) {
      setDataFiltered(tableData);
    }
  }, [tableData]);

  useEffect(() => {
    tableFetch(table.page + 1, table.rowsPerPage, filterValue, sortValue, collection.name, expand);
  }, [table.page, table.rowsPerPage, sortValue, debouncedFilter]);

  useEffect(() => {
    tableFetch(table.page + 1, table.rowsPerPage, filterValue, sortValue, collection.name, expand);
  }, [refetch]);

  return (
    <>
      <Card sx={{ width: '100%', typography: 'caption', ...sx }}>
        <Typography variant="h4" sx={{ ml: 3, my: 3 }}>
          {label}
        </Typography>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
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
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadAnitimeCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={tableHead}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={onCustomSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => row.id)
                  )
                }
                data={dataFiltered}
              />

              <TableBody>
                {tableLoading ? (
                  [...Array(table.rowsPerPage)].map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <>
                    {dataFiltered?.map((row) => (
                      <TableRowComponent
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.name)}
                        onViewRow={() => handleViewRow(row.name)}
                        {...other}
                      />
                    ))}
                  </>
                )}

                <TableNoData notFound={dataFiltered.length === 0} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={tableCount}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </>
  );
}
