'use client';

import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import UserTableRow from '../permintaan-table-row';
import UserTableToolbar from '../permintaan-table-toolbar';
import UserTableFiltersResult from '../permintaan-table-filters-result';
import { ListItemText, Stack, Typography } from '@mui/material';
import useListData from 'src/api/wholesaler/list';
import TableAnitime from 'src/sections/peternakan/components/tableAnitime';
import CustomDialog from 'src/components/custom-dialog/custom-dialog';
import { useCreateData, useUpdateData } from 'src/api/custom-api';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const FILTER_OPTIONS = [
  { value: 'status.All', label: 'Semua', color: 'default', total: 20 },
  { value: 'status.Ditunda', label: 'Request', color: 'warning', total: 20 },
  { value: 'status.Diproses', label: 'Diproses', color: 'info', total: 20 },
  { value: 'status.Ditinjau', label: 'Ditinjau', color: 'secondary', total: 20 },
  { value: 'status.Diterima', label: 'Diterima', color: 'success', total: 10 },
  { value: 'status.Ditolak', label: 'Ditolak', color: 'error', total: 5 },
];

const TABLE_HEAD = [
  { id: 'no', label: 'No' },
  { id: 'jenisBreed', label: 'Jenis Ternak' },
  { id: 'berat', label: 'Berat' },
  { id: 'jumlah', label: 'Jumlah Permintaan' },
  { id: 'expand.createdBy', label: 'Wholesaler' },
  { id: 'status', label: 'Status' },
  // { id: 'expand.peternak.expand.createdBy.farmName', label: 'Peternakan' },
  { id: 'konfirmasi', label: 'Konfirmasi', width: 100, align: 'center' },
];

const defaultFilters = {
  jenisTernak: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function PermintaanTernakView() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const loadingSubmit = useBoolean();

  const {
    createData: createNotificationPermintaan,
    error: errorCreate,
    loading: loadingCreate,
  } = useCreateData();

  const options = (status) => {
    return {
      filter: `status = "${status}" && peternakan = "${user.id}"`,
    };
  };

  const { total: totalPermintaanTerkirim, refetch: refetchPermintaanTerkirim } = useListData(
    'permintaanTernak',
    1,
    5,
    options('Ditunda')
  );
  const { total: totalDiproses, refetch: refetchDiproses } = useListData(
    'permintaanTernak',
    1,
    5,
    options('Diproses')
  );
  const { total: totalDitinjau, refetch: refetchDitinjau } = useListData(
    'permintaanTernak',
    1,
    5,
    options('Ditinjau')
  );
  const { total: totalDiterima, refetch: refetchDiterima } = useListData(
    'permintaanTernak',
    1,
    5,
    options('Diterima')
  );
  const { total: totalDitolak, refetch: refetchDitolak } = useListData(
    'permintaanTernak',
    1,
    5,
    options('Ditolak')
  );

  const {
    updateData: updatePermintaan,
    updateData: updateTernak,
    error: errorUpdateData,
    loading: loadingUpdateData,
  } = useUpdateData();

  const submitConfirm = async (id, confirm, review, ternak, wholesaler) => {
    loadingSubmit.onTrue();
    const data = {
      status: confirm,
    };

    try {
      if (review) {
        await Promise.all(
          ternak?.map((item) =>
            updateTernak(
              item.id,
              {
                status: 'aktif',
              },
              'ternak'
            )
          )
        );

        await Promise.all(
          review?.map((id) =>
            updateTernak(
              id,
              {
                isDeclined: true,
              },
              'ternak'
            )
          )
        );
      }

      if (confirm === 'Ditolak' && ternak) {
        await Promise.all(
          ternak?.map((item) =>
            updateTernak(
              item.id,
              {
                status: 'aktif',
              },
              'ternak'
            )
          )
        );
      }

      await updatePermintaan(id, data, 'permintaanTernak');

      if (confirm === 'Diterima') {
        await createNotificationPermintaan(
          {
            name: 'Permintaan Diterima',
            message: `
            Permintaan Ternak ${id} Anda Telah di terima oleh Peternakan ${user?.name}
            `,
            read: false,
            wholesaler: wholesaler?.id,
            permintaanTernak: id,
          },
          'notifications'
        );
      } else if (confirm === 'Diproses') {
        await createNotificationPermintaan(
          {
            name: 'Permintaan Diproses',
            message: `Permintaan Ternak ${id} memerlukan peninjauan lebih lanjut`,
            read: false,
            peternakan: user?.id,
            permintaanTernak: id,
            notifyFor: 'procurement',
          },
          'notifications'
        );
      } else if (confirm === 'Ditolak') {
        await createNotificationPermintaan(
          {
            name: 'Permintaan Ditolak',
            message: `Permintaan Ternak ${id} Anda di tolak oleh Peternakan ${user?.name}`,
            read: false,
            wholesaler: wholesaler?.id,
            permintaanTernak: id,
          },
          'notifications'
        );
      }

      enqueueSnackbar('Berhasil mengonfirmasi permintaan', { variant: 'success' });
      refetchPermintaanTerkirim('permintaanTernak', 1, 5, options('Ditunda'));
      refetchDiproses('permintaanTernak', 1, 5, options('Diproses'));
      refetchDitinjau('permintaanTernak', 1, 5, options('Ditinjau'));
      refetchDiterima('permintaanTernak', 1, 5, options('Diterima'));
      refetchDitolak('permintaanTernak', 1, 5, options('Ditolak'));
      loadingSubmit.onFalse();
    } catch (error) {
      enqueueSnackbar('Gagal mengonfirmasi permintaan', { variant: 'error' });
      loadingSubmit.onFalse();
    }
  };

  const [search, setSearch] = useState('');
  const [statusOptions, setStatusOptions] = useState(FILTER_OPTIONS || []);

  const handleSearch = useCallback((e) => {
    const { value } = e.target;

    setSearch(value);
  }, []);

  useEffect(() => {
    if (statusOptions.length) {
      setStatusOptions((prev) => {
        let total = 0;
        const newStatusOptions = prev.map((item) => {
          if (item.value === 'status.Ditunda') {
            total = totalPermintaanTerkirim?.totalItems || 0;
          }
          if (item.value === 'status.Diproses') {
            total = totalDiproses?.totalItems || 0;
          }
          if (item.value === 'status.Ditinjau') {
            total = totalDitinjau?.totalItems || 0;
          }
          if (item.value === 'status.Diterima') {
            total = totalDiterima?.totalItems || 0;
          }
          if (item.value === 'status.Ditolak') {
            total = totalDitolak?.totalItems || 0;
          }
          return {
            ...item,
            total,
          };
        });

        return newStatusOptions;
      });
    }
  }, [totalDiterima, totalDitolak, totalPermintaanTerkirim, totalDiproses, totalDitinjau]);

  useEffect(() => {
    settings.setPageTitle(document.title);
  }, [window.location.pathname]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={4}>
          <UserTableToolbar filters={search} onFilters={handleSearch} />

          <TableAnitime
            label="Pengajuan Permintaan"
            tableHead={TABLE_HEAD}
            collectionId="permintaanTernak"
            expand="createdBy,peternakan,ternak,ternak.kandang"
            filter={search}
            statusOptions={statusOptions}
            onRefetchData={loadingSubmit.value}
            customConfirmDialog={submitConfirm}
            customeTableRow={[
              {
                key: 'status',
                props: (value) => {
                  const rowStatus = value.toLocaleLowerCase();
                  const colorStatus =
                    rowStatus === 'diproses'
                      ? 'info'
                      : rowStatus === 'ditunda'
                        ? 'warning'
                        : rowStatus === 'ditinjau'
                          ? 'secondary'
                          : rowStatus === 'diterima'
                            ? 'success'
                            : 'error';
                  return (
                    <Label variant="soft" color={colorStatus}>
                      {value}
                    </Label>
                  );
                },
              },
              {
                key: 'expand.createdBy',
                props: (value) => {
                  return (
                    <ListItemText
                      primary={value?.name}
                      secondary={value?.id}
                      secondaryTypographyProps={{
                        component: 'span',
                        typography: 'caption',
                      }}
                    />
                  );
                },
              },
            ]}
            disabledDelete
          />
        </Stack>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
