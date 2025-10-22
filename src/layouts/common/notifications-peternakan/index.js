import { m } from 'framer-motion';
import { useState, useCallback, useEffect, useMemo } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { _notifications } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';

import NotificationItem from './notification-item';

import {
  useDeleteNotfication,
  useEditNotfication,
  useGetNotifications,
} from 'src/api/peternakan/notifications';
import { alpha } from '@mui/system';
import { useTheme } from '@emotion/react';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'all',
    label: 'All',
    count: 22,
  },
  {
    value: 'unread',
    label: 'Unread',
    count: 12,
  },
];

// ----------------------------------------------------------------------

export default function NotificationsPeternakan() {
  const drawer = useBoolean();
  const { user } = useAuthContext();

  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  const {
    data: dataNotifications,
    totalData,
    refetch: refetchNotifications,
    error,
    loading,
    ...detailNotification
  } = useGetNotifications();

  const [notif, setNotif] = useState([]);

  const refetch = (page) => {
    refetchNotifications(
      page,
      5,
      `peternakan = "${user.id}" && notifyFor != "procurement"`,
      '-created',
      'wholesaler, surveilansTernak, surveilansDokter, permintaanTernak'
    );
  };

  useEffect(() => {
    refetch(1);
    setNotif([]);
  }, []);

  useEffect(() => {
    if (dataNotifications) {
      setNotif((prev) => [...prev, ...dataNotifications]);
    }
  }, [dataNotifications]);

  const notifications = useMemo(() => {
    return notif;
  }, [notif]);

  const [currentTab, setCurrentTab] = useState('all');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const totalUnRead = useMemo(
    () => notifications.filter((item) => item.read === false).length,
    [notifications]
  );

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((f) => !f.read);
    let allSuccessful = true;

    for (const notification of unreadNotifications) {
      try {
        await useEditNotfication(notification.id, { read: true });
      } catch (error) {
        console.log(error);
        allSuccessful = false;
      }
    }

    if (allSuccessful) {
      setNotif((prev) =>
        prev.map((item) => {
          if (!item.read) {
            return { ...item, read: true };
          }
          return item;
        })
      );
    }
  };

  const handleClickNotification = useCallback(
    async ({ id }) => {
      try {
        await useEditNotfication(id, { read: true });
        setNotif((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              return { ...item, read: true };
            }
            return item;
          })
        );
      } catch (error) {
        console.log(error);
      }
    },
    [notifications]
  );

  const handleDeleteNotification = useCallback(
    async ({ id }) => {
      try {
        await useDeleteNotfication(id);
        setNotif((prev) => prev.filter((f) => f.id !== id));
      } catch (error) {
        console.log(error);
      }
    },
    [notifications]
  );

  const handleLoadMore = async () => {
    refetch(detailNotification.page + 1);
  };

  const handleDeleteNotifications = async () => {
    let allSuccessful = true;

    for (const notification of notifications) {
      try {
        await useDeleteNotfication(notification.id);
      } catch (error) {
        console.log(error);
        allSuccessful = false;

        break;
      }
    }

    if (allSuccessful) {
      setNotif([]);
      refetch();
    }
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={(tab.value === 'unread' && 'info') || 'default'}
            >
              {tab.value === 'all' ? totalData : totalUnRead > 9 ? '9+' : totalUnRead}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar id="scrollbartarget">
      {currentTab === 'all' ? (
        <List disablePadding>
          {notifications.map((notification, index) => (
            <NotificationItem
              key={index}
              notification={notification}
              handleClickNotification={handleClickNotification}
              handleDeleteNotification={handleDeleteNotification}
            />
          ))}
        </List>
      ) : (
        <List disablePadding>
          {notifications
            .filter((f) => !f.read)
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                handleClickNotification={handleClickNotification}
                handleDeleteNotification={handleDeleteNotification}
              />
            ))}
        </List>
      )}

      {notifications.length < totalData && (
        <Box
          sx={{
            p: 1,
          }}
        >
          <Button
            fullWidth
            size="large"
            onClick={handleLoadMore}
            disabled={loading}
            sx={{
              backgroundColor: alpha(theme.palette.info.main, 0.5),
              color: theme.palette.error.contrastText,
              '&:hover': {
                backgroundColor: alpha(theme.palette.info.main, 0.8),
              },
            }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
          <IconButton
            onClick={() => {
              setNotif([]);
              refetch();
            }}
          >
            <Iconify icon="ic:baseline-refresh" />
          </IconButton>
        </Stack>

        <Divider />

        {renderList}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large" onClick={handleDeleteNotifications}>
            Delete All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
