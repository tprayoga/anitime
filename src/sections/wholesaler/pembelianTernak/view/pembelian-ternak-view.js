'use client';

import React, { useCallback, useState } from 'react';

import { _roles, _userList } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { Container, Stack, TextField, Typography } from '@mui/material';
import TableAnitime from 'src/sections/wholesaler/components/tableAnitime';
import { formatToRupiah } from 'src/sections/wholesaler/components/convertToIdr';
import SearchFilter from 'src/sections/wholesaler/components/search';
import { useBoolean } from 'src/hooks/use-boolean';
import ModalWholesaler from '../../components/modal';
import { useForm } from 'react-hook-form';
import PembelianTernakModal from '../pembelian-ternak-modal';
import useListAllData from 'src/api/wholesaler/listAll';
import PembayaranTernakModal from '../pembayaran-ternak-modal';
import useCreateData from 'src/api/wholesaler/create';
import { useAuthContext } from 'src/auth/hooks';
import BuktiPembayaranModal from '../bukti-pembayaran-modal';
import './style.css';
import { fDateTime } from 'src/utils/format-time';
import { generateRandomId } from '../../components/generatId';
import { Box } from '@mui/system';
import { RouterLink } from 'src/routes/components';
import Label from 'src/components/label/label';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

// id must same with field name in database
const TABLE_HEAD = [
  { id: 'id', label: 'Invoice' },
  { id: 'ternak', label: 'RFID Ternak' },
  { id: 'created', label: 'Tanggal' },
  { id: 'harga', label: 'Harga Pembelian' },
  { id: 'tujuanPembelian', label: 'Tujuan Pembelian' },
  { id: 'lokasiTujuan', label: 'Alamat Pengiriman' },
  { id: 'popover', label: '' },
];

// ----------------------------------------------------------------------

export default function PembelianTernakView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const router = useRouter();

  const openDialog = useBoolean();
  const openDialogDetailPembayaran = useBoolean();
  const loadingSubmit = useBoolean();

  const [search, setSearch] = useState('');
  const [modalPage, setModalPage] = useState(0);
  const [modalData, setModalData] = useState({
    pembelian: null,
    pembayaran: null,
  });
  const [buktiPembayaranData, setBuktiPembayaranData] = useState(null);

  const handleSearch = useCallback((e) => {
    const { value } = e.target;

    setSearch(value);
  }, []);

  const handleSubmitPembelian = useCallback((data) => {
    setModalPage((prev) => prev + 1);
    setModalData((prev) => ({ ...prev, pembelian: data }));
  }, []);

  const handleSubmitPembayaran = useCallback(
    async (data) => {
      loadingSubmit.onTrue();

      setModalData((prev) => ({ ...prev, pembayaran: data }));

      const { fotoSertifikat } = modalData.pembelian;
      try {
        const res = await useCreateData('pembelianTernak', {
          ...modalData.pembelian,
          ...data,
          fotoSertifikat: fotoSertifikat ? fotoSertifikat.file : null,
          wholesaler: user.id,
          id: generateRandomId(15),
          peternakan: user.createdBy,
        });

        const filterTernak = dataTernak.find((item) => item.id === res.ternak);
        const newData = {
          ...res,
          ternak: filterTernak,
          wholesaler: user,
        };

        setBuktiPembayaranData(newData);
        setModalPage((prev) => prev + 1);
        setModalData({
          pembelian: null,
          pembayaran: null,
        });
        loadingSubmit.onFalse();
      } catch (error) {
        loadingSubmit.onFalse();
        console.log(error);
      }
    },
    [modalData, user]
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const listPopovers = [
    {
      title: 'Detail',
      icon: 'fluent-emoji-high-contrast:receipt',

      onClick: (row) => {
        // router.push(`/wholesaler/pembelian-ternak/${row.id}`);
        router.push(paths.wholesaler.pembelianTernak.invoice(row.id));
      },
    },
    {
      title: 'Delivery Order',
      icon: 'carbon:delivery',
      disabled: (row) => !row?.deliveryOrder,
      onClick: (row) => {
        // router.push(`/wholesaler/pembelian-ternak/delivery_order/${row.deliveryOrder}`);
        router.push(paths.wholesaler.pembelianTernak.deliveryOrder(row.deliveryOrder));
      },
    },
  ];

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack spacing={4}>
          <SearchFilter
            onChange={handleSearch}
            titleSearch="Search Invoice ..."
            href="/wholesaler/pembelian-ternak/tambah-data"
            component={RouterLink}
          />

          <TableAnitime
            label="Pembelian Ternak"
            tableHead={TABLE_HEAD}
            collectionId="pembelianTernak"
            expand="ternak,wholesaler"
            filter={search}
            filterByUser
            fieldNameCreatedBy="wholesaler"
            collapseDisabled={(row) => row}
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
              {
                key: 'wholesaler.middlemanAddress',
                props: (value) => (
                  <Box
                    sx={{
                      maxWidth: 250,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <Typography variant="caption" noWrap>
                      {value}
                    </Typography>
                  </Box>
                ),
              },
            ]}
            listPopovers={listPopovers}
            onRefetchData={loadingSubmit.value}
            disabledDelete
          />
        </Stack>
      </Container>

      {/* {modalPage === 0 ? (
        <PembelianTernakModal
          open={openDialog.value}
          close={openDialog.onFalse}
          onSubmitData={handleSubmitPembelian}
          rfidOptions={dataTernak.map((item) => {
            return {
              value: item.RFID,
              label: item.RFID,
              idKandang: item.kandang,
              idPeternakan: item.peternakan,
              ternak: item.id,
              berat: item.berat,
              bsc: item.bodyConditionalScore,
            };
          })}
          loadingRfidOptions={loadingTernak}
          metodePengirimanOptions={dataMetodePengiriman.map((item) => {
            return {
              value: item.name,
              label: item.name,
            };
          })}
          loadingMetodePengirimanOptions={loadingMetodePengiriman}
          tujuanPembelianOptions={dataTujuanPembelian.map((item) => {
            return {
              value: item.name,
              label: item.name,
            };
          })}
          loadingTujuanPembelianOptions={loadingTujuanPembelian}
          bcsOptions={dataBcs.map((item) => {
            return {
              value: item.name,
              label: item.name,
            };
          })}
          loadingBcsOptions={loadingBcs}
          data={modalData.pembelian}
        />
      ) : modalPage === 1 ? (
        <PembayaranTernakModal
          open={openDialog.value}
          close={openDialog.onFalse}
          onSubmitData={handleSubmitPembayaran}
          metodePembayaranOptions={dataPembayaran.map((item) => {
            return {
              value: item.name,
              label: item.name,
              disabled: item.name === 'Kredit' ? true : false,
            };
          })}
          handleBack={() => setModalPage((prev) => prev - 1)}
          data={modalData.pembayaran}
          loadingSubmit={loadingSubmit.value}
        />
      ) : (
        <BuktiPembayaranModal
          open={openDialog.value}
          close={openDialog.onFalse}
          onClickPrint={handlePrint}
          data={buktiPembayaranData}
          resetPage={() => setModalPage(0)}
        />
      )}

      {openDialogDetailPembayaran.value && (
        <BuktiPembayaranModal
          open={openDialogDetailPembayaran.value}
          close={openDialogDetailPembayaran.onFalse}
          onClickPrint={handlePrint}
          data={buktiPembayaranData}
        />
      )} */}
    </>
  );
}
