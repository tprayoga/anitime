import { Container, Stack } from '@mui/material';
import BlankPage from 'src/app/dashboard/blank/page';
import ComingSoonView from 'src/sections/coming-soon/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Anitime: Lalu Lintas',
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
