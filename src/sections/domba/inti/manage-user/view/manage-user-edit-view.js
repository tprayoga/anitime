'use client';

// @mui
import Container from '@mui/material/Container';
// routes
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import ManageNewEditForm from '../manage-new-edit-form';
import { Button, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { _userList } from 'src/_mock';
import { useEffect } from 'react';
import { useGetUser } from 'src/api/domba/manage-user';

// ----------------------------------------------------------------------

export default function ManageUserEditView({ id }) {
  const settings = useSettingsContext();

  const adminToken = sessionStorage.getItem('adminToken');

  const { data, loadingDetailUser, getDetailUser, detailDataUser } = useGetUser();

  useEffect(() => {
    getDetailUser(id, adminToken);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Button
        type="button"
        component={RouterLink}
        href={paths.dombaIntiAnakKandang.manageUser.root}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        sx={{ mb: 5 }}
      >
        Back
      </Button>

      <Typography variant="h4" sx={{ my: 2 }}>
        Edit Informasi User
      </Typography>

      {!loadingDetailUser && <ManageNewEditForm currentUser={detailDataUser} />}
    </Container>
  );
}
