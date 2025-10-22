import PropTypes from 'prop-types';
import { useRef, useMemo, useState, useImperativeHandle } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import {
  DataGrid,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridLogicOperator,
} from '@mui/x-data-grid';

import { fPercent } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  id: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['id', 'actions'];

export default function DataGridTernak({
  data: rows,
  columns,
  table,
  totalData,
  loading,
  onDataGridChange,
  ...other
}) {
  const [selectedRows, setSelectedRows] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const selected = rows.filter((row) => selectedRows.includes(row.id)).map((_row) => _row.id);

  console.info('SELECTED ROWS', selected);

  return (
    <DataGrid
      {...other}
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: table.pageSize,
            page: table.page,
          },
        },
      }}
      pageSizeOptions={[5, 10, 25]}
      filterDebounceMs={500}
      loading={loading}
      sortingMode="server"
      filterMode="server"
      paginationMode="server"
      onPaginationModelChange={(newPaginationModel) => {
        onDataGridChange({ ...newPaginationModel, page: newPaginationModel?.page + 1 });
      }}
      onSortModelChange={(newSortModel) => {
        if (newSortModel?.length > 0) {
          onDataGridChange({ order: newSortModel[0]?.sort, orderBy: newSortModel[0]?.field });
        } else {
          onDataGridChange({ order: 'desc', orderBy: 'created' });
        }
      }}
      onFilterModelChange={(newFilterModel) => {
        if (newFilterModel?.quickFilterValues?.length > 0) {
          onDataGridChange({ filter: newFilterModel?.quickFilterValues?.join(' ') });
        } else {
          onDataGridChange({ filter: '' });
        }
      }}
      rowCount={totalData}
      onRowSelectionModelChange={(newSelectionModel) => {
        setSelectedRows(newSelectionModel);
      }}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
      slots={{
        toolbar: CustomToolbar,
        noRowsOverlay: () => <EmptyContent title="No Data" />,
        noResultsOverlay: () => <EmptyContent title="No results found" />,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
        columnsPanel: {
          getTogglableColumns,
        },
      }}
    />
  );
}

DataGridTernak.propTypes = {
  data: PropTypes.array,
};

// ----------------------------------------------------------------------

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarColumnsButton />
      {/* <GridToolbarFilterButton /> */}
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

// ----------------------------------------------------------------------
