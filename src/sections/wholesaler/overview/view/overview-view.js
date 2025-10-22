'use client';

import { useCallback, useMemo, useState } from 'react';

import { _roles, _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { Button, Container, Stack, Typography } from '@mui/material';
import Label from 'src/components/label';
import TableAnitime from 'src/sections/wholesaler/components/tableAnitime';
import { formatToRupiah } from 'src/sections/wholesaler/components/convertToIdr';
import CardOverview from '../../components/cardOverview';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { fDate, fDateTime } from 'src/utils/format-time';
import useListAllData from 'src/api/wholesaler/listAll';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

// id must same with field name in database
const TABLE_HEAD_PEMBELIAN = [
  { id: 'ternak', label: 'RFID Ternak' },
  { id: 'id', label: 'Invoice' },
  { id: 'created', label: 'Tanggal' },
  { id: 'harga', label: 'Harga Pembelian' },
  { id: 'tujuanPembelian', label: 'Tujuan Pembelian' },
  { id: 'lokasiTujuan', label: 'Alamat Pengiriman' },
];
const TABLE_HEAD_PENGAJUAN = [
  { id: 'jenisBreed', label: 'Jenis Ternak' },
  { id: 'berat', label: 'Berat' },
  { id: 'jumlah', label: 'Jumlah Permintaan' },
  { id: 'status', label: 'Status' },
  { id: 'expand.peternakan.farmName', label: 'Peternakan' },
  { id: 'dueDate', label: 'Jatuh Tempo' },
];

const defaultValuesCard = [
  {
    title: 'Stock Sapi Perah',
    value: 0,
  },
  {
    title: 'Stock Sapi Potong',
    value: 0,
  },
];

// ----------------------------------------------------------------------

export default function WholesalerOverview() {
  const settings = useSettingsContext();
  const router = useRouter();
  const { user } = useAuthContext();

  console.log('overview');

  const { data, loading, error, empty, total } = useListAllData('ternak', {
    filter: `berat >= "500"`,
  });

  const totalSapiPerah = useMemo(() => {
    if (error) return 0;
    return data.filter((item) => item.jenisHewan === 'Sapi Perah').length;
  }, [data]);

  const totalSapiPotong = useMemo(() => {
    if (error) return 0;
    return data.filter((item) => item.jenisHewan === 'Sapi Potong').length;
  }, [data]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={4}>
          <Stack direction="row" spacing={2}>
            {defaultValuesCard.map((item, index) => (
              <CardOverview
                key={index}
                loading={loading}
                title={
                  <Typography variant="caption">
                    {item.title} <b>Per Tanggal {fDateTime(new Date(), 'dd/MM/yyyy')}</b>
                  </Typography>
                }
                value={index === 0 ? totalSapiPerah : totalSapiPotong}
              />
            ))}
          </Stack>

          <TableAnitime
            label="History Pembelian"
            tableHead={TABLE_HEAD_PEMBELIAN}
            collectionId="pembelianTernak"
            expand="ternak,wholesaler"
            keyCustome="harga"
            filterByUser
            fieldNameCreatedBy="wholesaler"
            customeTableRow={[
              {
                key: 'ternak',
                props: (values) => (
                  <Stack spacing={0.7}>
                    {values.map((item, index) => (
                      <Label key={index}>{item.RFID}</Label>
                    ))}
                  </Stack>
                ),
              },
              {
                key: 'harga',
                props: (value) => (
                  <Typography variant="caption">{formatToRupiah(value)}</Typography>
                ),
              },
              {
                key: 'created',
                props: (value) => <Typography variant="caption">{fDateTime(value)}</Typography>,
              },
            ]}
            // actionProps={renderButtonAction('pembelian-ternak')}
            disabledDelete
          />

          <TableAnitime
            label="Pengajuan Permintaan"
            tableHead={TABLE_HEAD_PENGAJUAN}
            collectionId="permintaanTernak"
            expand="peternakan"
            // actionProps={renderButtonAction('permintaan-ternak')}
            filterByUser
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
                        : rowStatus === 'ditinjau'
                          ? 'info'
                          : rowStatus === 'diproses'
                            ? 'default'
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
            ]}
            disabledDelete
          />
        </Stack>
      </Container>
    </>
  );
}
