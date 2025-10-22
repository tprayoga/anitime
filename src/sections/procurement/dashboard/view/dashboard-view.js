'use client';

import uuidv4 from 'src/utils/uuidv4';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Checkbox, FormControlLabel, FormGroup, IconButton, Typography } from '@mui/material';

import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import Scrollbar from 'src/components/scrollbar';

import { Responsive, WidthProvider } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive);

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './dashboard.css';
import WidgetWeather from 'src/sections/peternakan/dashboard/widget-weather';
import WidgetGrafikIncome from '../widget-grafik-income';
import { alpha, useTheme, styled } from '@mui/material/styles';
import WidgetTable from '../widget-table';

// ----------------------------------------------------------------------

export default function DashboardProcurementView() {
  const { user } = useMockedUser();

  const popover = usePopover();

  const settings = useSettingsContext();

  const [displayWidget, setDisplayWidget] = useState([
    'Grafik Income vs Expanse',
    'Weather',
    'Tabel Lalu Lintas',
  ]);
  const [editState, setEditState] = useState(false);
  const [closeState, setCloseState] = useState(false);

  const saveToLS = (name, key, value) => {
    if (global.localStorage) {
      global.localStorage.setItem(
        name,
        JSON.stringify({
          [key]: value,
        })
      );
    }
  };

  const getFromLS = (name, key) => {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem(name)) || {};
      } catch (e) {
        /*Ignore*/
      }
    }
    return ls[key];
  };

  const [dashboardLayout, setDashboardLayout] = useState({
    lg: [
      {
        w: 8,
        h: 3,
        x: 0,
        y: 0,
        i: 'Grafik Income vs Expanse',
      },
      {
        w: 4,
        h: 5,
        x: 8,
        y: 0,
        i: 'Weather',
      },
      {
        w: 12,
        h: 4,
        x: 0,
        y: 5,
        i: 'Tabel Lalu Lintas',
      },
    ],
    md: [
      {
        w: 8,
        h: 4,
        x: 0,
        y: 0,
        i: 'Grafik Income vs Expanse',
      },
      {
        w: 4,
        h: 4,
        x: 7,
        y: 0,
        i: 'Weather',
      },
      {
        w: 12,
        h: 4,
        x: 0,
        y: 4,
        i: 'Tabel Lalu Lintas',
      },
    ],
    sm: [
      {
        w: 6,
        h: 3,
        x: 0,
        y: 0,
        i: 'Grafik Income vs Expanse',
      },
      {
        w: 6,
        h: 4,
        x: 4,
        y: 0,
        i: 'Weather',
      },
      {
        w: 6,
        h: 3,
        x: 0,
        y: 3,
        i: 'Tabel Lalu Lintas',
      },
    ],
  });

  const windowSize = window.innerWidth;

  const onLayoutChange = (layout, allLayouts) => {
    if (windowSize < 996) {
      setDashboardLayout((prev) => ({ sm: layout, md: prev.md, lg: prev.lg }));
    } else if (windowSize > 996 && windowSize < 1200) {
      setDashboardLayout((prev) => ({ sm: prev.sm, md: layout, lg: prev.lg }));
    } else if (windowSize > 1200) {
      setDashboardLayout((prev) => ({ sm: prev.sm, md: prev.md, lg: layout }));
    }
  };

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [settings.themeLayout]);

  const layout = [
    {
      w: 5,
      h: 2,
      x: 0,
      y: 0,
      i: 'Grafik Income vs Expanse',
    },
    {
      w: 5,
      h: 2,
      x: 5,
      y: 0,
      i: 'Weather',
    },
    {
      w: 10,
      h: 4,
      x: 0,
      y: 2,
      i: 'Tabel Lalu Lintas',
    },
  ];

  const fullLayout = {
    lg: [
      {
        w: 8,
        h: 3,
        x: 0,
        y: 0,
        i: 'Grafik Income vs Expanse',
      },
      {
        w: 4,
        h: 5,
        x: 8,
        y: 0,
        i: 'Weather',
      },
      {
        w: 12,
        h: 4,
        x: 0,
        y: 5,
        i: 'Tabel Lalu Lintas',
      },
    ],
    md: [
      {
        w: 6,
        h: 4,
        x: 0,
        y: 0,
        i: 'Grafik Income vs Expanse',
      },
      {
        w: 3,
        h: 4,
        x: 7,
        y: 0,
        i: 'Weather',
      },
      {
        w: 10,
        h: 4,
        x: 0,
        y: 4,
        i: 'Tabel Lalu Lintas',
      },
    ],
    sm: [
      {
        w: 4,
        h: 3,
        x: 0,
        y: 0,
        i: 'Grafik Income vs Expanse',
      },
      {
        w: 2,
        h: 3,
        x: 4,
        y: 0,
        i: 'Weather',
      },
      {
        w: 6,
        h: 3,
        x: 0,
        y: 3,
        i: 'Tabel Lalu Lintas',
      },
    ],
  };

  const componentDisplay = [
    {
      id: 'Grafik Income vs Expanse',
      component: <WidgetGrafikIncome />,
    },
    {
      id: 'Weather',
      component: <WidgetWeather />,
    },
    {
      id: 'Tabel Lalu Lintas',
      component: <WidgetTable />,
    },
  ];

  const filterGrid = (id) => {
    let data;
    if (windowSize < 996) {
      if (getFromLS('dashboard-procurement', 'layout')) {
        data = getFromLS('dashboard-procurement', 'layout').sm.filter((item) => item.i === id)[0];
      } else {
        data = fullLayout?.sm?.filter((item) => item.i === id)[0];
      }
    } else if (windowSize > 996 && windowSize < 1200) {
      if (getFromLS('dashboard-procurement', 'layout')) {
        data = getFromLS('dashboard-procurement', 'layout').md.filter((item) => item.i === id)[0];
      } else {
        data = fullLayout?.md?.filter((item) => item.i === id)[0];
      }
    } else if (windowSize > 1200) {
      if (getFromLS('dashboard-procurement', 'layout')) {
        data = getFromLS('dashboard-procurement', 'layout').lg.filter((item) => item.i === id)[0];
      } else {
        data = fullLayout?.lg?.filter((item) => item.i === id)[0];
      }
    }
    return data;
  };

  const filterWidget = (id) => {
    let data;
    data = componentDisplay?.filter((item) => item.id === id)[0];
    return data.component;
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Stack spacing={2} direction={'row'} alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ mt: 3 }}>
                My Dashboard
              </Typography>
            </Box>

            <Stack spacing={2} direction={'row'}>
              <Button
                color="primary"
                variant="contained"
                startIcon={<Iconify icon="ic:baseline-plus" />}
                onClick={popover.onOpen}
              >
                Tambah Widget
              </Button>
              <Button
                color="primary"
                variant="contained"
                startIcon={editState || closeState ? null : <Iconify icon="ic:baseline-edit" />}
                onClick={() => {
                  if (editState) saveToLS('dashboard-procurement', 'layout', dashboardLayout);
                  setEditState(!editState);
                  setCloseState(!closeState);
                }}
              >
                {editState || closeState ? 'Done' : 'Edit'}
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} md={12}>
          <Box
            sx={{
              mt: 5,
              py: 1,
              width: 1,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Box>
              <ResponsiveGridLayout
                resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
                // resizeHandles={['se']}
                layouts={
                  getFromLS('dashboard-procurement', 'layout')
                    ? getFromLS('dashboard-procurement', 'layout')
                    : fullLayout
                }
                onLayoutChange={onLayoutChange}
                breakpoints={{ lg: 1200, md: 900, sm: 600 }}
                cols={{ lg: 12, md: 12, sm: 6 }}
                // width={1200}
                // height={1000}
                isResizable={editState}
                isDraggable={editState}
                // resizeHandle={
                //   <Box sx={{ position: 'absolute', right: 5, bottom: 5 }}>
                //     <Iconify icon="lets-icons:resize-down-right" />
                //   </Box>
                // }
              >
                {displayWidget.map((id) => (
                  <div
                    key={id}
                    data-grid={filterGrid(id)}
                    style={{ position: 'relative', height: 'auto' }}
                    className={id === 'Weather' ? 'dark-widget' : 'light-widget'}
                  >
                    {closeState && (
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          zIndex: 10,
                        }}
                        onMouseEnter={(e) => setEditState(false)}
                        onMouseLeave={(e) => setEditState(true)}
                        onClick={() => {
                          setDisplayWidget(displayWidget.filter((e) => e !== id));
                          setEditState(true);
                        }}
                      >
                        <Iconify icon="mingcute:close-line" />
                      </IconButton>
                    )}

                    {filterWidget(id)}
                  </div>
                ))}
              </ResponsiveGridLayout>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="top-right" sx={{ px: 3 }}>
        <FormGroup>
          {layout.map((item, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  size="medium"
                  checked={displayWidget.includes(item.i) ? true : false}
                  onChange={(e) => {
                    setDisplayWidget((prevData) => {
                      let newData = [...prevData];
                      if (e.target.checked) {
                        newData.push(item.i);
                      } else {
                        newData.splice(newData.indexOf(item.i), 1);
                      }
                      return newData;
                    });
                  }}
                />
              }
              label={item.i}
            />
          ))}
        </FormGroup>
      </CustomPopover>
    </Container>
  );
}
