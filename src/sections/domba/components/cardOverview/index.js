import { Box, Card, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { bgGradient } from 'src/theme/css';

export default function CardOverview({ title, total = 0, loading }) {
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
          startColor: theme.palette.primary.dark,
          endColor: theme.palette.primary.light,
        }),
        height: { xs: 140, md: 160, xl: 180 },
      }}
    >
      <Stack alignItems="center" justifyContent="space-between" spacing={1} height={1}>
        <Typography
          textAlign="center"
          sx={{
            fontSize: { xs: 16, md: 18, xl: 24 },
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 24, md: 24, xl: 32 },
            fontWeight: '800',
          }}
        >
          {total}
        </Typography>
      </Stack>
    </Box>
  );
}
