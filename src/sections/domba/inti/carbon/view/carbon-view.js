'use client';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useGetTernak } from 'src/api/peternakan/ternak';

// ----------------------------------------------------------------------

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppWidget from 'src/sections/overview/dashboard/app-widget';
import AppWelcome from 'src/sections/overview/dashboard/app-welcome';
import AppFeatured from 'src/sections/overview/dashboard/app-featured';
import AppNewInvoice from 'src/sections/overview/dashboard/app-new-invoice';
import AppTopAuthors from 'src/sections/overview/dashboard/app-top-authors';
import AppTopRelated from 'src/sections/overview/dashboard/app-top-related';
import AppAreaInstalled from 'src/sections/overview/dashboard/app-area-installed';
import AppWidgetSummary from 'src/sections/overview/dashboard/app-widget-summary';
import AppCurrentDownload from 'src/sections/overview/dashboard/app-current-download';
import AppTopInstalledCountries from 'src/sections/overview/dashboard/app-top-installed-countries';
import { useEffect } from 'react';
import AppWidgetSummary1 from 'src/sections/overview/dashboard/app-widget-summary-1';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import List from '@mui/material/List';

import ChartRadialBar from 'src/sections/_examples/extra/chart-view/chart-radial-bar';
import ChartRadialBar1 from 'src/sections/_examples/extra/chart-view/chart-radial-bar1';
import ChartColumnMultiple from 'src/sections/_examples/extra/chart-view/chart-column-multiple';
import ChartColumnStacked from 'src/sections/_examples/extra/chart-view/chart-column-stacked';
import ChartPie from 'src/sections/_examples/extra/chart-view/chart-pie';
import ChartPie1 from 'src/sections/_examples/extra/chart-view/chart-pie1';
import ComponentBlock from 'src/sections/_examples/component-block';
import Iconify from 'src/components/iconify';
export default function CarbonView() {
  const faktorEmisiFuel = 0.00271;
  const jarakPengirimanAwal = 4800;
  const truckDouble = 1 / 5;

  const FEEntericMethane = 28;
  const PopulasiTernakAktif = 45000;
  const konversiCH4keCO2 = 27;

  const FEMethaneManure = 8.73;
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();
  const { data: dataTernak, getTernak, loadingTernak, totalData: totalTernak } = useGetTernak();
  console.log('dataTernakTernak', totalTernak);
  useEffect(() => {
    getTernak();
  }, []);
  return (
    // <Container>

    //   <Box>
    //     <Typography variant="h6" sx={{ mt: 3 }}>
    //       Pre-farm Activities
    //     </Typography>
    //     <Typography variant="h6" sx={{ mt: 3 }}>
    //       pengiriman awal ({truckDouble * jarakPengirimanAwal * faktorEmisiFuel} ton CO2 -e/ tahun)
    //     </Typography>
    //     <Typography variant="h6" sx={{ mt: 3 }}>
    //       pengiriman pakan ({truckDouble * jarakPengirimanAwal * faktorEmisiFuel} ton CO2 -e/ tahun)
    //     </Typography>
    //     <Typography variant="h6" sx={{ mt: 3 }}>
    //       On-farm Activities
    //     </Typography>
    //     <Typography variant="h6" sx={{ mt: 3 }}>
    //       Enteric Methane ({FEEntericMethane * ((PopulasiTernakAktif * konversiCH4keCO2) / 1000)}
    //       ton CO2 -e/ tahun)
    //     </Typography>
    //     <Typography variant="h6" sx={{ mt: 3 }}>
    //       Manure (Methane) ({FEMethaneManure * ((PopulasiTernakAktif * konversiCH4keCO2) / 1000)}
    //       ton CO2 -e/ tahun)
    //     </Typography>
    //   </Box>
    // </Container>
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box>
        <Typography variant="h4" sx={{ my: 3 }}>
          Carbon Accounting
        </Typography>
      </Box>
      <Grid sx={{ my: 3 }}>
        <AppWidgetSummary1
          title="Carboon Footprint"
          percent={2.6}
          total={98765}
          chart={{
            series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
          }}
        />
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Pre-farm Activities"
            percent={2.6}
            total={18765}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="On-farm Activities"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Post-farm Activities"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Total Emission Pre-farm Activities" sx={{ mb: 5 }} />
            <ChartRadialBar1 series={[44, 55, 66]} />
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <Card>
            <CardHeader title="Total Emission On-farm Activities" />
            <CardContent>
              <ChartColumnStacked
                series={[
                  { name: 'Enteric Methane', data: [44, 55, 41, 67, 22, 43] },
                  { name: 'Manure (Methane)', data: [13, 23, 20, 8, 13, 27] },
                  { name: 'Manure (N2O)', data: [11, 17, 15, 15, 21, 14] },
                  { name: 'Electricity Usage', data: [21, 7, 25, 13, 22, 8] },
                  { name: 'Fuel Usage', data: [21, 7, 25, 13, 22, 8] },
                  { name: 'Carbon Sequestration', data: [21, 7, 25, 13, 22, 8] },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} lg={8}>
          <Card>
            <CardHeader title="Carbon Sequestration" />
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChartPie1 series={[44, 55, 13, 43, 30]} />
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <CardHeader title="Total Emission Post-farm Activities" />
          <CardContent>
            <Paper variant="outlined" sx={{ width: 1 }}>
              <List>
                <ListItemButton>
                  <ListItemText primary="PT Sinar Pematang Mulia" secondary="8990" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Live Corp" secondary="1997" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="PT Budi Starch & Sweetener TBK" secondary="6000" />
                </ListItemButton>
              </List>
            </Paper>
          </CardContent>
        </Grid>
        {/* 
        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid> */}
      </Grid>
    </Container>
  );
}
