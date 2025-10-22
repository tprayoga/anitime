import { Box, Card, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { paths } from 'src/routes/paths';
import { bgGradient } from 'src/theme/css';

export default function CardOverview({ title, total = 0, loading, id }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: 1,
        borderRadius: 2,
        py: theme.spacing(4),
        backgroundColor: '#CCFCE4',
        height: { xs: 140, md: 160, xl: 180 },
        cursor: 'pointer',
      }}
      onClick={() => {
        if (id) {
          window.open(`${paths.dombaPeternakan.kandang.detail(id)}`, '_blank');
        }
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1}
        sx={{ height: '100%', width: '100%' }}
      >
        {/* <Typography
          textAlign="center"
          sx={{
            fontSize: { xs: 12, md: 14, xl: 18 },
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography> */}

        <Typography
          sx={{
            fontSize: { xs: 18, md: 20, xl: 26 },
            fontWeight: '800',
            textAlign: 'center',
          }}
        >
          {total}
        </Typography>
      </Stack>
    </Box>
  );
}
