import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { fDate, fToNow } from 'src/utils/format-time';
// components
import Label from 'src/components/label';
import FileThumbnail from 'src/components/file-thumbnail';
import { memo, useEffect } from 'react';
import Iconify from 'src/components/iconify';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Link } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetOneData } from 'src/api/custom-api';
import { FILES_API } from 'src/config-global';
import { RouterLink } from 'src/routes/components';
// import SvgIcon from 'src/components/svg-icon';

// ----------------------------------------------------------------------

function NotificationItem({ notification, handleClickNotification, handleDeleteNotification }) {
  const dialog = useBoolean();

  console.log({ notification });

  const { data: dataSurveilansTernak, error, loading, getOneData: getSurveilans } = useGetOneData();

  const IMAGE_URL = dataSurveilansTernak?.fotoGejala.map((image) => {
    return `${FILES_API}/${dataSurveilansTernak?.collectionId}/${dataSurveilansTernak?.id}/${image}?token=${pb.authStore.token}`;
  });

  const renderAvatar = (
    <ListItemAvatar>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify
            icon={
              notification.pembelianTernak ? 'carbon:delivery' : 'zondicons:exclamation-outline'
            }
            color={'text.primary'}
            width={24}
            height={24}
          />
        </Box>
      </Stack>
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(
        `<strong>${notification.name || notification.expand?.scheduler?.name || ''}</strong>`
      )}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={'space-between'}
          sx={{ typography: 'caption', color: 'text.disabled' }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={'space-between'}
            width={1}
            divider={
              <Box
                sx={{
                  width: 2,
                  height: 2,
                  bgcolor: 'currentColor',
                  mx: 0.5,
                  borderRadius: '50%',
                }}
              />
            }
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {fToNow(notification.created)}
            </Typography>
            {notification.pembelianTernak && (
              <Link
                component={RouterLink}
                href={`/wholesaler/pembelian-ternak/delivery_order/${notification.expand?.pembelianTernak?.deliveryOrder}`}
                // sx={{ display: 'contents' }}
              >
                Lihat Detail
              </Link>
            )}
          </Stack>

          {/* <Button
            // href={`/dashboard/scheduler/${notification.expand?.scheduler?.id}`}
            // underline="hover"
            onClick={() => dialog.onTrue()}
            sx={{
              marginRight: 6,
            }}
          >
            Detail
          </Button> */}
        </Stack>
      }
    />
  );

  const renderUnReadBadge = !notification.read && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  const tagsAction = (
    <Stack
      direction="row"
      justifyContent={'space-between'}
      alignItems={'center'}
      spacing={0.75}
      flexWrap="wrap"
      sx={{ mt: 1.5 }}
    >
      {notification.message && (
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          spacing={1}
          width={'100%'}
        >
          <Scrollbar
            sx={{
              maxHeight: 65,
              width: '100%',
              overflow: 'auto',
            }}
          >
            <Box
              sx={{
                py: 1,
                px: 1.5,
                borderRadius: 1.5,
                color: 'text.secondary',
                bgcolor: 'background.neutral',
                fontSize: 12,
                width: '100%',
              }}
            >
              {reader(`${notification.message}`)}
            </Box>
          </Scrollbar>
          {/* <Stack
            sx={{
              pr: 1.5,
            }}
          >
            <Iconify icon="icon-park-solid:message" width={16} height={16} />
          </Stack> */}
        </Stack>
      )}
      <Stack direction="row" justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
        {/* {notification.status === 'success' ? (
          <Label variant="outlined" color="success">
            Success
          </Label>
        ) : (
          <Label variant="outlined" color="error">
            Failed
          </Label>
        )} */}

        <IconButton
          sx={{
            color: 'text.disabled',
            transition: (theme) => theme.transitions.create('all'),
            zIndex: 99,
            '&:hover': { color: 'error.main' },
            position: 'absolute',
            right: 6,
          }}
          onClick={() => handleDeleteNotification(notification)}
        >
          <Iconify icon="mi:delete" width={16} height={16} />
        </IconButton>
      </Stack>
    </Stack>
  );

  const refetch = () => {
    if (notification?.surveilansTernak) {
      getSurveilans(notification?.surveilansTernak?.id, 'surveilansTernak', 'ternak');
    } else if (notification?.surveilansDokter) {
      getSurveilans(notification?.surveilansDokter?.id, 'surveilansDokter', 'ternak');
    }
  };

  useEffect(() => {
    if (notification) {
      refetch();
    }
  }, []);

  return (
    <Stack position={'relative'}>
      <ListItemButton
        disableRipple
        sx={{
          p: 2.5,
          alignItems: 'flex-start',
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
        onClick={() => !notification.read && handleClickNotification(notification)}
      >
        {renderUnReadBadge}

        {renderAvatar}

        <Stack sx={{ flexGrow: 1 }}>
          {renderText}
          {tagsAction}
        </Stack>
      </ListItemButton>

      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <DialogTitle
          sx={{
            backgroundColor: '#EAFFEA',
          }}
        >{`Laporan Surveilans Ternak`}</DialogTitle>

        <DialogContent sx={{ color: 'text.secondary', marginTop: 2 }}>
          <Stack spacing={1}>
            <Typography variant="body2">{`RFID : ${dataSurveilansTernak?.expand?.ternak?.RFID}`}</Typography>
            <Typography variant="body2">{`Tanggal Laporan : ${fDate(
              dataSurveilansTernak?.created
            )}`}</Typography>
            <Typography variant="body2">{`Gejala : `}</Typography>

            {dataSurveilansTernak?.gejalaMuncul.map((dataSurveilansTernak, index) => (
              <Typography
                sx={{ textTransform: 'capitalize', ml: 2 }}
                key={index}
                variant="body2"
              >{`\u2022 ${dataSurveilansTernak}`}</Typography>
            ))}
            <Typography variant="body2">{`Perkiraan Waktu Munculnya Gejala Pertama Kali : ${fDate(
              dataSurveilansTernak?.perkiraanWaktu
            )}`}</Typography>

            <Typography variant="body2">{`Foto Gejala : `}</Typography>
            <Stack flexDirection={'row'} spacing={1} flexWrap={'wrap'}>
              {IMAGE_URL?.map((url, index) => (
                <Box
                  component="img"
                  alt="invite"
                  src={url}
                  sx={{
                    position: 'relative',
                    width: 150,
                    height: 'auto',
                    objectFit: 'contain',
                    my: 1,
                  }}
                  key={index}
                />
              ))}
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={dialog.onFalse} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object,
};

// ----------------------------------------------------------------------

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}

export default memo(NotificationItem);
