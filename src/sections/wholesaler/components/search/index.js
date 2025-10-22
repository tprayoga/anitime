import { Button, InputAdornment, Stack, TextField } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function SearchFilter({
  onChange,
  handleClickedAddButton,
  titleSearch = 'Search..',
  titleButton = 'Tambah Data',
  ...other
}) {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={2}>
      <TextField
        fullWidth
        onChange={onChange}
        placeholder={titleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      <Button
        color="primary"
        variant="contained"
        size="large"
        startIcon={<Iconify icon="eva:plus-fill" />}
        sx={{
          width: { xs: '100%', md: '180px' },
        }}
        onClick={handleClickedAddButton}
        {...other}
      >
        {titleButton}
      </Button>
    </Stack>
  );
}
