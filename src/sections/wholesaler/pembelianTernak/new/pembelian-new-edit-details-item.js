import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import { RHFAutocomplete, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { NumericFormatCustom } from '../../components/numberFormat';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

export default function PembelianNewEditDetailsItem({
  //   listRfid,
  listBreed,
  index,
  disabledRemove,
  onSelectBreed,
  onSelectRfid,
  onRemove,
  dataTernak,
  rfids,
  selectedTernak,
}) {
  const listRfid = useMemo(() => {
    let dataRfids = [];
    if (selectedTernak) {
      dataRfids = dataTernak.filter((f) => f.jenisBreed === selectedTernak).map(({ RFID }) => RFID);
    } else {
      dataRfids = dataTernak.map(({ RFID }) => RFID);
    }
    // if there any rfid that already in the list, remove it
    return dataRfids.filter((rfid) => !rfids.some((item) => item === rfid));
  }, [dataTernak, rfids, selectedTernak]);

  return (
    <Stack alignItems="flex-end" spacing={1.5}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
        <RHFAutocomplete
          name={`items[${index}].filteredBreed`}
          label="Jenis Breed"
          options={listBreed}
          getOptionLabel={(option) => option || ''}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={onSelectBreed}
          size="small"
          fullWidth
        />
        <RHFAutocomplete
          name={`items[${index}].rfid`}
          label="RFID"
          options={listRfid}
          getOptionLabel={(option) => option || ''}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={onSelectRfid}
          size="small"
          fullWidth
        />

        <RHFTextField
          size="small"
          name={`items[${index}].berat`}
          label="Berat"
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
        <RHFTextField
          size="small"
          name={`items[${index}].bcs`}
          label="Body Conditional Score"
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
        {/* <RHFTextField
                size="small"
                name={`items[${index}].sertifikatKesehatan`}
                label="Sertifikat Kesehatan"
              /> */}
        {/* <RHFTextField
                size="small"
                name={`items[${index}].jenisBreed`}
                label="Jenis Breed"
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}

        <RHFTextField
          size="small"
          name={`items[${index}].harga`}
          label="Harga"
          InputProps={{
            inputComponent: NumericFormatCustom,
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="subtitle2" color="text.disabled">
                  Rp.
                </Typography>
              </InputAdornment>
            ),
          }}
          disabled
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Stack>

      <Button
        size="small"
        color="error"
        startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        onClick={onRemove}
        disabled={disabledRemove}
      >
        Hapus
      </Button>
    </Stack>
  );
}
