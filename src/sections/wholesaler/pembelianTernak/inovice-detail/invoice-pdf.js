import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Page,
  View,
  Text,
  Font,
  Image,
  Document,
  StyleSheet,
  Svg,
  ClipPath,
  G,
  Polygon,
} from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { CalculatePrice } from 'src/components/calculatePrice';
// import { QRCode } from 'react-qr-svg';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col8: { width: '75%' },
        col6: { width: '50%' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        h5: { fontSize: 11, fontWeight: 700 },
        h6: { fontSize: 10, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        error: { color: 'red' },
        alignRight: { textAlign: 'right' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          padding: '40px 24px 120px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '5%',
        },
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
        tableHeadBackround: {
          backgroundColor: '#F4F6F8',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

export default function InvoicePDF({ invoice, urlQr }) {
  const {
    items,
    taxes,
    dueDate,
    discount,
    shipping,
    invoiceTo,
    createDate,
    invoiceFrom,
    invoiceNumber,
    subTotal,
  } = invoice;

  const styles = useStyles();
  const totalAmount =
    invoice?.items.reduce((acc, item) => acc + CalculatePrice(item.berat), 0) || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/logo/logo_single.png" style={{ width: 32, height: 32 }} />

          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h5}> {invoiceNumber} </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Wholesaler</Text>
            <Text style={styles.body2}>{invoiceFrom.name}</Text>
            <Text style={styles.body2}>{invoiceFrom.address}</Text>
            <Text style={styles.body2}>+62 {invoiceFrom.phone}</Text>
          </View>

          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Peternakan</Text>
            <Text style={styles.body2}>{invoiceTo.name}</Text>
            <Text style={styles.body2}>{invoiceTo.address}</Text>
            <Text style={styles.body2}>+62 {invoiceTo.phone}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Date create</Text>
            <Text style={styles.body2}> {fDate(invoice.createdAt)}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>Alamat Pengiriman</Text>
            <Text style={styles.body2}>{invoice.lokasiTujuan}</Text>
          </View>
        </View>

        <Text style={[styles.subtitle1, styles.mb8]}>Invoice Details</Text>

        <View style={styles.table}>
          <View>
            <View style={[styles.tableRow, styles.tableHeadBackround]}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Description</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Qty</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Unit price</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>Total</Text>
              </View>
            </View>
          </View>

          <View>
            {items.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.jenisBreed}</Text>
                  <Text>{item.RFID}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  {/* <Text>{item.RFID}</Text> */}
                  <Text>1</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{fCurrency(CalculatePrice(item.berat))}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(CalculatePrice(1 * item.berat))}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_2}>
                <Text style={styles.h6}>PAYMENT METHOD</Text>
              </View>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Subtotal</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(totalAmount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_2}>
                <Text>CASH</Text>
              </View>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Biaya Layanan</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight, styles.error]}>
                <Text> Rp. 0</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>Tax (0%)</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight, styles.error]}>
                <Text>Rp. 0</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_2}>
                <Image
                  src={urlQr}
                  style={{
                    width: 220,
                  }}
                />
              </View>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h5}>Total</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h6}> {fCurrency(totalAmount)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.footer]} fixed>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>Inovice ini dibuat oleh Wholesaler untuk pembelian ternak dari Peternakan</Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Punya Pertanyaan?</Text>
            <Text>{invoice.invoiceTo.email}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

InvoicePDF.propTypes = {
  invoice: PropTypes.object,
  urlQr: PropTypes.string,
};
