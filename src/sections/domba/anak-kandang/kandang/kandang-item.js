import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { reset } from 'numeral';

// ----------------------------------------------------------------------

export default function KandangItem({
  folder,
  selected,
  onSelect,
  onDelete,
  resetPage,
  setPenGrid,
  setTernakGrid,
  sx,
  ...other
}) {
  const checkbox = useBoolean();

  const renderAction = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        position: 'absolute',
      }}
    >
      {/* <Checkbox
        color="warning"
        icon={<Iconify icon="eva:star-outline" />}
        checkedIcon={<Iconify icon="eva:star-fill" />}
        checked={favorite.value}
        onChange={favorite.onToggle}
      /> */}

      {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton> */}
    </Stack>
  );

  const renderIcon =
    (checkbox.value || selected) && onSelect ? (
      <Checkbox
        size="medium"
        checked={selected}
        onClick={onSelect}
        icon={<Iconify icon="eva:radio-button-off-fill" />}
        checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
        sx={{ p: 0.75 }}
      />
    ) : (
      // <Box component="img" src="/assets/icons/files/ic_folder.svg" sx={{ width: 36, height: 36 }} />
      <Iconify
        icon={
          folder?.jenisBreed
            ? 'fluent-emoji-high-contrast:goat'
            : folder?.pen
              ? 'mdi:warehouse'
              : 'ph:warehouse'
        }
        sx={{ width: 36, height: 36 }}
      />
    );

  const renderText = (
    <ListItemText
      primary={folder?.namaKandang || folder?.namaPen || folder?.noFID}
      secondary={
        <>
          {folder?.jenisBreed
            ? `${folder?.jenisBreed} - ${folder?.jenisKelamin}`
            : folder?.pen
              ? `${folder?.pen?.length} Pen`
              : typeof folder.jumlahTernakPen === 'number'
                ? `${folder?.jumlahTernakPen} Ternak`
                : null}
        </>
      }
      primaryTypographyProps={{
        noWrap: true,
        typography: 'subtitle1',
      }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        alignItems: 'center',
        typography: 'caption',
        color: 'text.disabled',
        display: 'inline-flex',
      }}
    />
  );

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        spacing={1}
        alignItems="flex-start"
        onClick={() => {
          resetPage();
          if (typeof folder?.pen === 'object') {
            setPenGrid(folder);
          } else if (typeof folder?.jumlahTernakPen === 'number') {
            setTernakGrid(folder);
          }
        }}
        sx={{
          p: 2.5,
          maxWidth: 222,
          borderRadius: 2,
          bgcolor: 'unset',
          cursor: 'pointer',
          position: 'relative',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Box
          onMouseOver={folder?.jenisBreed && checkbox.onTrue}
          onMouseOut={folder?.jenisBreed && checkbox.onFalse}
        >
          {renderIcon}
        </Box>

        {renderAction}

        {renderText}
      </Stack>
    </>
  );
}

KandangItem.propTypes = {
  folder: PropTypes.object,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  sx: PropTypes.object,
};
