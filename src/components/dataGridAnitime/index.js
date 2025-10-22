import PropTypes from 'prop-types';
import { useRef, useMemo, useState, useImperativeHandle, useEffect } from 'react';
import { alpha, styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
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
  gridClasses,
} from '@mui/x-data-grid';

import { fPercent } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  id: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['id', 'actions'];

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export default function DataGridAnitime({
  data: rows,
  columns,
  table,
  totalData,
  loading,
  onDataGridChange,
  sxCell,
  ...other
}) {
  const [selectedRows, setSelectedRows] = useState([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);
  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const selected = rows.filter((row) => selectedRows.includes(row.id)).map((_row) => _row.id);

  const buttonRef = useRef(null);

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
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'odd' : 'even')}
      sortingMode="server"
      filterMode="server"
      paginationMode="server"
      onPaginationModelChange={(newPaginationModel) => {
        onDataGridChange({ ...newPaginationModel, page: newPaginationModel?.page });
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
      // getRowHeight={() => 'auto'}
      rowCount={totalData}
      onRowSelectionModelChange={(newSelectionModel) => {
        setSelectedRows(newSelectionModel);
      }}
      // columnVisibilityModel={columnVisibilityModel}
      // onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
      slots={{
        toolbar: CustomToolbar,
        loadingOverlay: LinearProgress,
        noRowsOverlay: () => <EmptyContent title="No Data" />,
        noResultsOverlay: () => <EmptyContent title="No results found" />,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
        panel: {
          anchorEl: filterButtonEl,
        },
        toolbar: {
          setFilterButtonEl,
        },
        // columnsPanel: {
        //   getTogglableColumns,
        // },
      }}
      sx={{
        typography: 'caption',
        // '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
        // '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
        // '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
        '& .MuiDataGrid-cell': {
          borderBottom: `none`,
          ...sxCell,
          // display: 'flex',
          // // justifyContent: 'start',
          // alignItems: 'center',
        },
      }}
    />
  );
}

DataGridAnitime.propTypes = {
  data: PropTypes.array,
};

// ----------------------------------------------------------------------

function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarColumnsButton ref={setFilterButtonEl} />
      {/* <GridToolbarFilterButton /> */}
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

// ----------------------------------------------------------------------
