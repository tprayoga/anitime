import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { enqueueSnackbar } from 'notistack';
import { useUpdateFilesData } from 'src/api/custom-domba-api';
import pbDomba from 'src/utils/pocketbase-domba';
import { useBoolean } from 'src/hooks/use-boolean';

export default function UploadPakan({ open, onClose, data, refetch }) {
  const loadingSubmit = useBoolean();

  const [file, setFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const handleChangeFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewFile(reader.result);
      };
    }
  };

  const handleSubmit = async () => {
    loadingSubmit.onTrue();

    const body = {
      photo: file,
      given: true,
    };
    try {
      await pbDomba.collection('pemberianPakan').update(data.id, body);

      enqueueSnackbar('Success Upload pemberian pakan', { variant: 'success' });
      onClose();
      refetch();
      loadingSubmit.onFalse();
    } catch (error) {
      loadingSubmit.onFalse();
      enqueueSnackbar('Terjadi kesalahan', { variant: 'error' });
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload bukti pemberian pakan</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          Silahkan upload bukti pemberian pakan yang telah diberikan kepada hewan ternak
        </Typography>

        <Stack spacing={2}>
          {previewFile && (
            <img
              src={previewFile}
              alt="preview"
              style={{ width: '100%', maxHeight: '40vh', objectFit: 'cover', borderRadius: 4 }}
            />
          )}

          <label htmlFor="upload-pakan">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<Iconify icon="bi:file-earmark-arrow-up" width={16} />}
            >
              Upload
            </Button>

            <input
              id="upload-pakan"
              type="file"
              style={{ display: 'none' }}
              accept="image/*, application/pdf"
              onChange={handleChangeFile}
            />
          </label>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Batal
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          variant="contained"
          disabled={!file}
          loading={loadingSubmit.value}
        >
          Kirim
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
