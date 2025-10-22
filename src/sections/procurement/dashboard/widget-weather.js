import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme, styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { bgGradient } from 'src/theme/css';
import Scrollbar from 'src/components/scrollbar';
import { Box, Card, Grid } from '@mui/material';
import { textAlign } from '@mui/system';

// ----------------------------------------------------------------------

export default function WidgetWeather({ title, description, action, img, ...other }) {
  const theme = useTheme();

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    color: '#369DB4',
    height: 30,
    borderRadius: 15,
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: '#369DB4',
      borderRadius: 15,
    },
  }));

  const data = {
    temperature: 27,
    detailTemp: 'H:16° L:8°',
    location: 'Lampung, Indonesia',
    weather: 'Showers',
    rain: [
      { time: '7 PM', value: 44 },
      { time: '8 PM', value: 35 },
      { time: '9 PM', value: 66 },
      { time: '10 PM', value: 75 },
      { time: '11 PM', value: 23 },
    ],
  };

  const detailData = [
    {
      icon: '/assets/illustrations/dashboard/wind.png',
      title: 'Wind Speed',
      value: '3 mps',
    },
    {
      icon: '/assets/illustrations/dashboard/cloudy.png',
      title: 'Sunset',
      value: '5:30 PM',
    },
    {
      icon: '/assets/illustrations/dashboard/humidity.png',
      title: 'Humidity',
      value: '75 %',
    },
  ];

  return (
    <Card
      sx={{
        ...bgGradient({
          direction: '135deg',
          startColor: '#292560',
          endColor: '#4C076C',
        }),
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Scrollbar>
        <Stack
          flexDirection={{ xs: 'column', md: 'row' }}
          sx={{
            borderRadius: 2,
            position: 'relative',
            color: 'common.white',
          }}
        >
          <Stack
            flexGrow={1}
            // justifyContent="center"
            // alignItems={{ xs: 'center', md: 'flex-start' }}
            sx={{
              p: {
                xs: theme.spacing(5, 3, 0, 3),
                md: theme.spacing(5),
              },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              Todays Weather
            </Typography>

            <Box
              sx={{
                color: 'common.white',
                borderRadius: 2,
                p: theme.spacing(2, 0, 2, 2),
                // ...bgGradient({
                //   direction: '100deg',
                //   startColor: '#369DB4',
                //   endColor: '#274441',
                // }),
                backgroundImage: `url(${'/assets/illustrations/dashboard/rectangle.png'})`,
                backgroundRepeat: 'no-repeat',
                // backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <Grid container>
                <Grid item md={7}>
                  <Stack spacing={1}>
                    <Box>
                      <Typography sx={{ fontSize: 48 }}>{`${data.temperature}°`}</Typography>
                    </Box>

                    <Box>
                      <Typography>{data.detailTemp}</Typography>
                      <Typography sx={{ fontSize: 16 }}>{data.location}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item md={5} sx={{ textAlign: 'end' }}>
                  <Box
                    component="img"
                    alt="weather"
                    src="/assets/illustrations/dashboard/sun.png"
                    sx={{
                      mt: -4,
                      position: 'relative',
                      filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
                    }}
                  />

                  <Typography sx={{ fontSize: 14, mr: 2 }}>{data.weather}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                color: 'common.white',
                mt: 2,
                width: '100%',
              }}
            >
              <Grid
                container
                gridColumn={3}
                gap={1}
                sx={{
                  flexWrap: 'nowrap',
                }}
              >
                {detailData.map((item, index) => (
                  <Grid
                    key={index}
                    item
                    md={4}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.07)',
                      borderRadius: 2,
                      p: theme.spacing(2, 2, 2, 2),
                    }}
                  >
                    <Box
                      component="img"
                      alt={item.title}
                      src={item.icon}
                      sx={{
                        width: 40,
                        position: 'relative',
                        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))',
                      }}
                    />
                    <Typography sx={{ fontSize: 14 }}>{item.title}</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>{item.value}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Typography variant="h5" sx={{ my: 3, whiteSpace: 'pre-line' }}>
              Change of Rain
            </Typography>

            {data.rain.map((item, index) => (
              <Grid
                key={index}
                container
                alignItems="center"
                gridColumn={3}
                gap={2}
                sx={{
                  flexWrap: 'nowrap',
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                <Grid item md={2}>
                  <Typography>{item.time}</Typography>
                </Grid>
                <Grid item md={8}>
                  <BorderLinearProgress variant="determinate" value={item.value} />
                </Grid>
                <Grid item md={2}>
                  <Typography>{`${item.value}%`}</Typography>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </Stack>
      </Scrollbar>
    </Card>
  );
}

WidgetWeather.propTypes = {
  img: PropTypes.node,
  action: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};
