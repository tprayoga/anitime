import { Container, Stack } from '@mui/material';
import ComingSoonView from 'src/sections/coming-soon/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Anitime: Import Data',
};

export default function ImportDataPage() {
  return (
    <Container maxWidth="sm">
      <Stack minHeight="80vh" justifyContent="center" alignItems="center">
        <ComingSoonView />
      </Stack>
    </Container>
  );
}
