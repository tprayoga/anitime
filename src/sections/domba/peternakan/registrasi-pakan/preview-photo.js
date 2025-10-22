import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import pbDomba from 'src/utils/pocketbase-domba';

const DB_URL = process.env.NEXT_PUBLIC_DATABASE_DOMBA_API;

export default function PreviewPhoto({ open, onClose, data }) {
  const url = `${DB_URL}/api/files/${data?.collectionId}/${data?.id}/${data?.photo}?token=${pbDomba.authStore.token}`;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle> Bukti pemberian pakan</DialogTitle>

      <DialogContent>
        <img
          src={url}
          alt="preview"
          style={{ width: '100%', maxHeight: '60vh', objectFit: 'cover', borderRadius: 4 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}
