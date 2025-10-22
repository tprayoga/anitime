'use client';

import { useState, useEffect, useMemo } from 'react';

import Container from '@mui/material/Container';
import { _roles, _userList } from 'src/_mock';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';

import { useTheme } from '@mui/system';
import TableCustom from 'src/components/tableCustom';
import { fDate } from 'src/utils/format-time';
import useListData from 'src/api/list';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const listPopoversDiproses = [
  {
    title: 'Masukan Data Ternak',
    icon: 'icon-park-twotone:add-web',
    disabled: true,
    onClick: (row) => {
      console.log(row);
    },
  },
];

const listPopoversDitinjau = [
  {
    title: 'Detail',
    icon: 'fluent-emoji-high-contrast:receipt',
    disabled: true,
    onClick: (row) => {
      console.log(row);
    },
  },
];

const FILTER_OPTIONS = [
  {
    label: 'Request',
    color: 'warning',
    total: 20,
    filter: `status = "Ditunda"`,
  },
  {
    label: 'Diproses',
    color: 'info',
    total: 10,
    filter: `status = "Diproses"`,
  },
  {
    label: 'Ditinjau',
    color: 'default',
    total: 10,
    filter: `status = "Ditinjau"`,
  },
  {
    label: 'Diterima',
    color: 'success',
    total: 5,
    filter: `status = "Diterima"`,
  },
  {
    label: 'Ditolak',
    color: 'error',
    total: 5,
    filter: `status = "Ditolak"`,
  },
];

const TABLE_HEAD = [
  { id: 'jenisBreed', label: 'Jenis Ternak' },
  { id: 'berat', label: 'Berat' },
  { id: 'jumlah', label: 'Jumlah Permintaan' },
  { id: 'status', label: 'Status' },
  { id: 'expand.createdBy.email', label: 'Wholesaler' },
  { id: 'dueDate', label: 'Jatuh Tempo' },
  { id: 'popover', label: '' },
];

// ----------------------------------------------------------------------

export default function PermintaanTernakViewNew() {
  const { enqueueSnackbar } = useSnackbar();

  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const adminToken = sessionStorage.getItem('adminToken');

  const options = (status, customFilter) => {
    const filter = customFilter ? status : `status = "${status}"`;
    return {
      filter: `${filter} && peternakan = "${user.createdBy}"`,
    };
  };

  const { total: totalDitunda } = useListData('permintaanTernak', 1, 5, options('Ditunda'));
  const { total: totalDiproses } = useListData('permintaanTernak', 1, 5, options('Diproses'));
  const { total: totalDitinjau } = useListData('permintaanTernak', 1, 5, options('Ditinjau'));
  const { total: totalDiterima } = useListData('permintaanTernak', 1, 5, options('Diterima'));
  const { total: totalDitolak } = useListData('permintaanTernak', 1, 5, options('Ditolak'));

  const [statusOptions, setStatusOptions] = useState(FILTER_OPTIONS || []);
  const [tableHeads, setTableHeads] = useState(TABLE_HEAD || []);

  useEffect(() => {
    if (statusOptions.length) {
      setStatusOptions((prev) => {
        let total = 0;
        const newStatusOptions = prev.map((item) => {
          if (item.filter === statusOptions[0].filter) {
            total = totalDitunda?.totalItems || 0;
          }
          if (item.filter === statusOptions[1].filter) {
            total = totalDiproses?.totalItems || 0;
          }
          if (item.filter === statusOptions[2].filter) {
            total = totalDitinjau?.totalItems || 0;
          }
          if (item.filter === statusOptions[3].filter) {
            total = totalDiterima?.totalItems || 0;
          }
          if (item.filter === statusOptions[4].filter) {
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
  }, [totalDiterima, totalDitolak, totalDitunda, totalDiproses]);

  const [currentStatus, setCurrentStatus] = useState(statusOptions[1].filter);

  const onChangeStatusOptions = (value) => {
    setCurrentStatus(value);
    const defaultTableHeads = TABLE_HEAD.slice(0, -1);
    if (
      value === statusOptions[1].filter ||
      value === statusOptions[2].filter ||
      value === statusOptions[3].filter
    ) {
      setTableHeads([...defaultTableHeads, { id: 'popover', label: '' }]);
    } else {
      setTableHeads(defaultTableHeads);
    }
  };

  const listPopovers = useMemo(() => {
    if (currentStatus.includes('Diproses')) {
      return listPopoversDiproses;
    } else if (currentStatus.includes('Ditinjau') || currentStatus.includes('Diterima')) {
      return listPopoversDitinjau;
    } else {
      return [];
    }
  }, [currentStatus]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <TableCustom
        label="Permintaan Ternak"
        tableHead={tableHeads}
        collectionId="permintaanTernak"
        expand="createdBy.createdBy"
        statusOptions={statusOptions}
        headers={{
          Authorization: `Bearer ${adminToken}`,
        }}
        filterByPeternakan
        defaultStatusOptions={currentStatus}
        onChangeStatusOptions={onChangeStatusOptions}
        listPopovers={listPopovers}
        customeTableRow={[
          {
            key: 'status',
            props: (value) => {
              const rowStatus = value.toLocaleLowerCase();
              const colorStatus =
                rowStatus === 'ditolak'
                  ? 'error'
                  : rowStatus === 'diterima'
                    ? 'success'
                    : rowStatus === 'diproses'
                      ? 'info'
                      : 'warning';
              return (
                <Label variant="soft" color={colorStatus}>
                  {value}
                </Label>
              );
            },
          },
          {
            key: 'dueDate',
            props: (value) => {
              return fDate(value);
            },
          },
          {
            key: 'expand.createdBy.email',
            props: (value) => {
              return value;
            },
          },
        ]}
        searchFilter
        excludeFilter={['status']}
        disabledDelete
      />
    </Container>
  );
}

// ----------------------------------------------------------------------
