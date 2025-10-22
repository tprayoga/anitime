import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { INVOICE_STATUS_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

import QRCode from 'react-qr-code';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';
import { CalculatePrice } from '../calculatePrice';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    borderBottom: 'none',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function DeliveryOrderDetail({ deliveryOrder, handlePrint }) {
  const totalAmount = deliveryOrder?.items?.reduce(
    (acc, item) => acc + CalculatePrice(item.berat),
    0
  );

  const totalBerat = deliveryOrder?.items?.reduce((a, item) => a + item.berat, 0);

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell colSpan={1} align="center">
          {deliveryOrder?.items?.length}
        </TableCell>
        <TableCell colSpan={1} align="center">
          {totalBerat}
        </TableCell>
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box />
          SUBTOTAL
        </TableCell>
        <TableCell align="right" width={200} sx={{ typography: 'subtitle2' }}>
          <Box />
          {fCurrency(totalAmount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ color: 'text.secondary' }}>DISCOUNT</TableCell>
        <TableCell align="right" width={120}>
          Rp. 0
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ color: 'text.secondary' }}>PPN</TableCell>
        <TableCell align="right" width={120}>
          {fCurrency((totalAmount * 11) / 100)}
          <Divider
            variant="fullWidth"
            sx={{
              borderWidth: 2,
              borderColor: 'black',
            }}
          />
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ color: 'text.secondary' }}>SUB TOTAL</TableCell>
        <TableCell align="right" width={120}>
          {fCurrency(totalAmount + (totalAmount * 11) / 100)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ color: 'text.secondary' }}>PPN DIBEBASKAN</TableCell>
        <TableCell align="right" width={120}>
          {fCurrency((totalAmount * 11) / 100)}
          <Divider
            variant="fullWidth"
            sx={{
              borderWidth: 2,
              borderColor: 'black',
            }}
          />
        </TableCell>
      </StyledTableRow>

      <StyledTableRow
        sx={{
          textAlign: 'right',
        }}
      >
        <TableCell colSpan={5} />
        <TableCell sx={{ typography: 'subtitle1' }}>TOTAL</TableCell>
        <TableCell align="right" width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(totalAmount)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Box
      rowGap={5}
      display="grid"
      alignItems="center"
      gridTemplateColumns={{
        xs: 'repeat(3, 1fr)',
        sm: 'repeat(3, 1fr)',
      }}
      sx={{ mt: 5, mb: 10 }}
    >
      <Stack
        spacing={1}
        sx={{
          pt: 2.5,
          px: 5,
        }}
        justifyContent="flex-start"
      >
        <Typography variant="caption" fontSize={12}>
          1. Faktur ini adalah bukti pembayaran yang sah
        </Typography>

        <Typography variant="caption" fontSize={12}>
          2. Dengan ditandatanginya faktur ini maka pembeli telah setuju atas barang yang diterima
        </Typography>

        <Typography variant="caption" fontSize={12}>
          3. Dengan diterimanya faktur ini maka tidak akan ada perubahan apapun baik jumlah maupun
          harga
        </Typography>

        <Stack
          spacing={1}
          sx={{
            mt: 2,
          }}
          justifyContent="flex-start"
        >
          <Typography variant="caption" fontSize={12}>
            Catatan :
          </Typography>
          <Typography variant="caption" fontSize={12}>
            1. Lembar putih untuk pembeli
          </Typography>
          <Typography variant="caption" fontSize={12}>
            2. Lembar merah dan hijau untuk administrasi
          </Typography>
          <Typography variant="caption" fontSize={12}>
            3. Lembar kuning untuk marketing
          </Typography>
        </Stack>
      </Stack>

      <Stack alignItems="center" spacing={1} justifyContent="center" sx={{ pt: 2.5 }}>
        <Typography variant="caption" fontSize={16}>
          Customer,
        </Typography>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <Typography variant="caption" fontSize={16} sx={{ textDecoration: 'underline' }}>
          {deliveryOrder?.invoiceFrom?.name.toUpperCase()}
        </Typography>
      </Stack>

      <Stack alignItems="center" spacing={1} justifyContent="center" sx={{ pt: 2.5 }}>
        <Typography variant="caption" fontSize={16}>
          Hormat Kami,
        </Typography>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <Typography variant="caption" fontSize={16} sx={{ textDecoration: 'underline' }}>
          {deliveryOrder?.invoiceTo?.name.toUpperCase()}
        </Typography>
      </Stack>
    </Box>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={40}>NO</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>NAMA BARANG</TableCell>

              <TableCell>JENIS BREED</TableCell>

              <TableCell align="center">EKOR</TableCell>

              <TableCell align="center" width={100}>
                BERAT
              </TableCell>

              <TableCell align="right" width={200}>
                HARGA
              </TableCell>

              <TableCell align="right">JUMLAH</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {deliveryOrder?.items?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 380 }}>
                    <Typography variant="subtitle2">Sapi Potong</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.RFID}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>{row.jenisBreed}</TableCell>

                <TableCell align="center">1</TableCell>

                <TableCell align="center">{row.berat} Kg</TableCell>

                <TableCell align="right">{fCurrency(52000)}</TableCell>

                <TableCell align="right">{fCurrency(CalculatePrice(row.berat))}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                <TableCell sx={{ px: 0.2 }}>
                  <Divider
                    variant="fullWidth"
                    sx={{
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderColor: 'black',
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <Stack justifyContent="center">
      <Grid container px={5}>
        <Grid xs={12} md={9} sx={{ py: 3 }}>
          <Typography variant="h4" mb={3}>
            Delivery Order
          </Typography>
        </Grid>

        <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
          <LoadingButton
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            startIcon={<Iconify icon="bx:bxs-printer" />}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              px: 4,
            }}
            className="print-btn"
            onClick={() => handlePrint('print-area')}
          >
            Print
          </LoadingButton>
        </Grid>
      </Grid>

      <Card sx={{ width: '100%', px: 3 }} id="print-area">
        <Box
          rowGap={3}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
          }}
        >
          <Box
            rowGap={5}
            display="grid"
            alignItems="center"
            gridTemplateColumns={{
              xs: 'repeat(3, 1fr)',
              sm: 'repeat(3, 1fr)',
            }}
          >
            <Stack
              spacing={1}
              sx={{
                pt: 2.5,
                px: 5,
              }}
              justifyContent="flex-start"
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                justifyContent="flex-start"
                // alignSelf="center"
              >
                <Box
                  component="img"
                  alt="logo"
                  src="https://res.cloudinary.com/dtowni8oi/image/upload/fl_preserve_transparency/v1715078641/ghi3bur5adjplvohvasz.jpg?_s=public-apps"
                  sx={{ width: 48, height: 48 }}
                  crossOrigin="anonymous"
                />
                <Typography variant="caption" color="primary" fontWeight={900} fontSize={24}>
                  ANITIME
                </Typography>
              </Stack>

              <Typography variant="caption" fontSize={16}>
                {deliveryOrder?.invoiceTo?.farmName?.toUpperCase()}
              </Typography>

              <Typography variant="caption" fontSize={14}>
                {deliveryOrder?.invoiceTo?.address}
              </Typography>
            </Stack>

            <Stack alignItems="center" spacing={1} justifyContent="center" sx={{ pt: 2.5 }}>
              <Typography variant="caption" fontWeight={900} fontSize={24}>
                FAKTUR
              </Typography>

              <Typography variant="caption" fontSize={16}>
                NO. BUKTI : FK2404300004
              </Typography>

              <Typography variant="caption" fontSize={16}>
                {`TANGGAL : ${fDate(deliveryOrder?.createdAt).toUpperCase()}`}
              </Typography>
            </Stack>

            <Stack></Stack>
          </Box>

          <Divider
            variant="middle"
            sx={{ borderStyle: 'dashed', borderWidth: 2, borderColor: 'black' }}
          />

          <Box
            rowGap={5}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Stack
              spacing={1}
              sx={{
                px: 5,
              }}
              justifyContent="flex-start"
            >
              <Stack flexDirection="row">
                <Typography variant="caption" fontSize={16} sx={{ width: '40%' }}>
                  {`NAMA `}
                </Typography>
                <Typography variant="caption" fontSize={16} sx={{ width: '60%' }}>
                  {`: ${deliveryOrder?.invoiceFrom?.name?.toUpperCase()}`}
                </Typography>
              </Stack>

              <Stack flexDirection="row">
                <Typography variant="caption" fontSize={16} sx={{ width: '40%' }}>
                  {`ALAMAT `}
                </Typography>
                <Typography variant="caption" fontSize={16} sx={{ width: '60%' }}>
                  {`: ${deliveryOrder?.pembelian?.lokasiTujuan?.toUpperCase()}`}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={1} ml={3} justifyContent="flex-start">
              {/* <Stack flexDirection="row">
                <Typography variant="caption" fontSize={16} sx={{ width: '30%' }}>
                  {`NPWP `}
                </Typography>
                <Typography variant="caption" fontSize={16} sx={{ width: '70%' }}>
                  {`: 014.272.109280.1672`}
                </Typography>
              </Stack> */}

              <Stack flexDirection="row">
                <Typography variant="caption" fontSize={16} sx={{ width: '40%' }} noWrap>
                  {`JNS. PEMBAYARAN `}
                </Typography>
                <Typography variant="caption" fontSize={16} sx={{ width: '60%' }}>
                  {`: ${deliveryOrder?.pembelian?.metodePembayaran?.toUpperCase()}`}
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <Box
            rowGap={5}
            display="grid"
            justifyContent="flex-start"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
            sx={{ border: 2, borderColor: 'black' }}
          >
            <Stack
              spacing={1}
              sx={{
                py: 2.5,
                px: 5,
              }}
              justifyContent="flex-start"
            >
              <Stack flexDirection="row">
                <Typography variant="caption" fontSize={16} sx={{ width: '40%' }}>
                  {`NO. DO `}
                </Typography>
                <Typography variant="caption" fontSize={16} sx={{ width: '60%' }}>
                  {`: DO2404300004`}
                </Typography>
              </Stack>

              <Stack flexDirection="row">
                <Typography variant="caption" fontSize={16} sx={{ width: '40%' }}>
                  {`NO. KEND/SOPIR `}
                </Typography>
                <Typography variant="caption" fontSize={16} sx={{ width: '60%' }}>
                  {`: ${deliveryOrder?.deliveryOrder?.noKendaraan.toUpperCase()} / ${deliveryOrder?.deliveryOrder?.namaSupir.toUpperCase()}`}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={1} ml={3} py={2.5} justifyContent="flex-start">
              <Stack flexDirection="row">
                <Typography variant="caption" fontSize={16} sx={{ width: '40%' }}>
                  {`TERM PAYMENT `}
                </Typography>
                <Typography variant="caption" fontSize={16} sx={{ width: '60%' }}>
                  {`: ${fDate(deliveryOrder?.deliveryOrder?.termPay).toUpperCase()}`}
                </Typography>
              </Stack>

              <Stack flexDirection="row">
                <Typography variant="caption" fontSize={16} sx={{ width: '40%' }}>
                  {`TANGGAL DELIVERY `}
                </Typography>
                <Typography variant="caption" fontSize={16} sx={{ width: '60%' }}>
                  {`: ${fDate(deliveryOrder?.deliveryOrder?.tanggalDelivery).toUpperCase()}`}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>

        {renderList}

        {renderFooter}
      </Card>
    </Stack>
  );
}

DeliveryOrderDetail.propTypes = {
  deliveryOrder: PropTypes.object,
  handlePrint: PropTypes.func,
};
