import { Container, Stack } from '@mui/material';
import ComingSoonView from 'src/sections/coming-soon/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Anitime: Transaksi',
};

export default function OverviewPage() {
  return (
    <Container maxWidth="sm">
      <Stack minHeight="80vh" justifyContent="center" alignItems="center">
        <ComingSoonView />
      </Stack>
    </Container>
  );
}
