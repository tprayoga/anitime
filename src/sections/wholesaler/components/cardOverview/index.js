import { Box, Card, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { bgGradient } from 'src/theme/css';

export default function CardOverview({ title, value = 0, loading }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        color: 'common.white',
        width: 1,
        borderRadius: 2,
        p: theme.spacing(4),
        ...bgGradient({
          direction: '100deg',
          startColor: '#369DB4',
          endColor: '#274441',
        }),
      }}
    >
      <Card
        sx={{
          width: 'fit-content',
          padding: theme.spacing(1),
        }}
      >
        {title}
      </Card>

      <Typography variant="h2" marginLeft={2} sx={{ mt: 2 }}>
        {loading ? (
          <Iconify
            icon="line-md:loading-loop"
            sx={{
              width: '40px',
              height: '40px',
            }}
          />
        ) : (
          value
        )}{' '}
        Ekor
      </Typography>
    </Box>
  );
}
