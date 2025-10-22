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

import { CalculatePrice } from '../../components/calculatePrice';
import QRCode from 'react-qr-code';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';

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

export default function InvoiceDetails({ invoice, handlePrint }) {
  const totalAmount = invoice.items.reduce((acc, item) => acc + CalculatePrice(item.berat), 0);

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
        <TableCell width={120}>Rp. 0</TableCell>
      </StyledTableRow>

      <StyledTableRow
        sx={{
          textAlign: 'left',
        }}
      >
        <TableCell sx={{ color: 'text.secondary' }}>
          <QRCode value={invoice.invoiceNumber} size={100} />
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
    <Grid container px={5}>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">Punya Pertanyaan?</Typography>

        <Typography variant="body2">{invoice.invoiceTo.email}</Typography>
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
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5, px: 5 }}>
      <Scrollbar>
        <Table sx={{ width: '840px' }}>
          <TableHead>
            <TableRow>
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Item</TableCell>

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
                  <Box sx={{ maxWidth: 380 }}>
                    <Typography variant="subtitle2">{row.jenisBreed}</Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.RFID}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>1</TableCell>

                <TableCell align="right">{fCurrency(CalculatePrice(row.berat))}</TableCell>

                <TableCell align="right">{fCurrency(CalculatePrice(row.berat))}</TableCell>
              </TableRow>
            ))}

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <Stack direction="row" justifyContent="center">
      <Card
        sx={{
          width: '920px',
        }}
        id="print-area"
      >
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            justifyContent="flex-end"
            alignSelf="center"
            sx={{
              backgroundColor: '#EAFFEA',
              py: 2.5,
              px: 5,
            }}
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

          <Typography variant="h4" sx={{ px: 5 }}>
            Billing
          </Typography>

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              px: 5,
            }}
          >
            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Invoice to:
              </Typography>
              <Typography
                variant="subtitle2"
                textTransform="capitalize"
                fontWeight={400}
                sx={{ mb: 1 }}
              >
                {invoice.invoiceFrom.name}
              </Typography>
            </Stack>

            <Stack>
              <Stack sx={{ typography: 'body2' }} direction="row" spacing={2}>
                <Typography variant="subtitle2" sx={{ mb: 1, minWidth: 100 }}>
                  Invoice #:
                </Typography>
                <Typography variant="subtitle2" fontWeight={400} sx={{ mb: 1 }}>
                  {invoice.invoiceNumber}
                </Typography>
              </Stack>
              <Stack sx={{ typography: 'body2' }} direction="row" spacing={2}>
                <Typography variant="subtitle2" sx={{ mb: 1, minWidth: 100 }}>
                  Date:
                </Typography>
                <Typography variant="subtitle2" fontWeight={400} sx={{ mb: 1 }}>
                  {fDate(invoice.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>
    </Stack>
  );
}

InvoiceDetails.propTypes = {
  invoice: PropTypes.object,
};
