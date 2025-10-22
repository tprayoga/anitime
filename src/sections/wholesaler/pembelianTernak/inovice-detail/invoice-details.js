import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';

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

import InvoiceToolbar from './invoice-toolbar';
import QRCode from 'react-qr-code';
import { CalculatePrice } from 'src/components/calculatePrice';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

export default function InvoiceDetails({ invoice }) {
  const totalAmount =
    invoice?.items.reduce((acc, item) => acc + CalculatePrice(item.berat), 0) || 0;

  const [urlQr, setUrlQr] = useState('');

  const getSvgHtml = () => {
    const qrcode = document.getElementById('qrcode');

    if (qrcode) {
      // make qrcode to url
      const svg = qrcode.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');

        setUrlQr(dataUrl);
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      return img.src;
    }
  };

  useEffect(() => {
    getSvgHtml();
  }, [invoice]);

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} sx={{ color: 'text.primary' }}>
          <Box sx={{ mt: 2 }} />
          <Typography variant="body2" textAlign="left" fontWeight={700}>
            PAYMENT METHOD
          </Typography>
        </TableCell>
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(totalAmount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} sx={{ color: 'text.secondary' }}>
          <Typography variant="body1" textAlign="left" fontWeight={600}>
            CASH
          </Typography>
        </TableCell>
        <TableCell sx={{ color: 'text.secondary' }}>Biaya Layanan</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {/* {fCurrency(invoice.serviceCharge)} */} Rp. 0
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Tax (0%)</TableCell>
        <TableCell width={120} sx={{ color: 'error.main' }}>
          Rp. 0
        </TableCell>
      </StyledTableRow>

      <StyledTableRow
        sx={{
          textAlign: 'left',
        }}
      >
        <TableCell sx={{ color: 'text.secondary' }}>
          <div id="qrcode">
            <QRCode value={invoice.invoiceNumber} size={100} />
          </div>
          <Typography
            variant="caption"
            textAlign="left"
            fontSize={15}
            sx={{
              textDecoration: 'underline',
              color: 'info.dark',
              cursor: 'pointer',
            }}
          >
            Kirim ke email
          </Typography>
        </TableCell>
        <TableCell colSpan={2} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(totalAmount)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">
          Inovice ini dibuat oleh Wholesaler untuk pembelian ternak dari Peternakan
        </Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
        <Typography variant="subtitle2">Punya pertanyaan?</Typography>

        <Typography variant="body2">{invoice.invoiceTo.email}</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Description</TableCell>

              <TableCell>Qty</TableCell>

              <TableCell align="right">Unit price</TableCell>

              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {invoice.items.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">{row.jenisBreed}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.RFID}
                    </Typography>
                  </Box>
                </TableCell>

                {/* <TableCell>{row.quantity}</TableCell> */}
                <TableCell>1</TableCell>

                <TableCell align="right">{fCurrency(CalculatePrice(row.berat))}</TableCell>

                <TableCell align="right">{fCurrency(CalculatePrice(1 * row.berat))}</TableCell>
              </TableRow>
            ))}

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      {urlQr && <InvoiceToolbar invoice={invoice} urlQr={urlQr} />}

      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          // alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box
            component="img"
            alt="logo"
            src="https://res.cloudinary.com/dtowni8oi/image/upload/fl_preserve_transparency/v1715078641/ghi3bur5adjplvohvasz.jpg?_s=public-apps"
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Typography variant="h6">{invoice.invoiceNumber}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Wholesaler
            </Typography>
            {invoice.invoiceFrom.name}
            <br />
            {invoice.invoiceFrom.address}
            <br />
            Phone: +62 {invoice.invoiceFrom.phone}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Peternakan
            </Typography>
            {invoice.invoiceTo.name}
            <br />
            {invoice.invoiceTo.address}
            <br />
            Phone: {invoice.invoiceTo.phone}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date Create
            </Typography>
            {fDate(invoice.createdAt)}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Alamat Pengiriman
            </Typography>
            {invoice.lokasiTujuan}
          </Stack>
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>
    </>
  );
}

InvoiceDetails.propTypes = {
  invoice: PropTypes.object,
};
