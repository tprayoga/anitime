import PropTypes from 'prop-types';
import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';

import KandangItem from './kandang-item';
import KandangActionSelected from './kandang-action-selected';
import EmptyContent from 'src/components/empty-content/empty-content';

// ----------------------------------------------------------------------

export default function KandangGridView({
  table,
  dataFiltered,
  resetPage,
  onOpenConfirm,
  setPenGrid,
  setTernakGrid,
}) {
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const containerRef = useRef(null);

  const share = useBoolean();

  const folders = useBoolean();

  return (
    <>
      <Box ref={containerRef}>
        <Collapse in={!folders.value} unmountOnExit>
          {dataFiltered?.length > 0 ? (
            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
            >
              {dataFiltered.map((folder) => (
                <KandangItem
                  key={folder.id}
                  folder={folder}
                  resetPage={resetPage}
                  setPenGrid={setPenGrid}
                  setTernakGrid={setTernakGrid}
                  selected={selected?.filter((item) => item.id === folder.id)[0]?.id === folder.id}
                  onSelect={() => onSelectItem(folder)}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}
            </Box>
          ) : (
            <EmptyContent
              filled
              title="No Data"
              sx={{
                py: 10,
              }}
            />
          )}
        </Collapse>

        {!!selected?.length && (
          <KandangActionSelected
            numSelected={selected.length}
            rowCount={dataFiltered.length}
            selected={selected}
            onSelectAllItems={(checked) =>
              onSelectAllItems(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
            action={
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:transfer-fill" />}
                  onClick={onOpenConfirm}
                  sx={{ mr: 1 }}
                >
                  Move Here
                </Button>
              </>
            }
          />
        )}
      </Box>
    </>
  );
}

KandangGridView.propTypes = {
  dataFiltered: PropTypes.array,
  onDeleteItem: PropTypes.func,
  onOpenConfirm: PropTypes.func,
  table: PropTypes.object,
};
