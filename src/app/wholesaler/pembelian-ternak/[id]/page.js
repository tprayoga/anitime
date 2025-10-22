import PropTypes from 'prop-types';

import { _invoices } from 'src/_mock/_invoice';
import InvoiceDetailsView from 'src/sections/wholesaler/pembelianTernak/inovice-detail/view/invoice-detail-view';

import { PembelianInvoiceDetailsView } from 'src/sections/wholesaler/pembelianTernak/invoice/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Invoice Details',
};

export default function PembelianTernakInvoice({ params }) {
  const { id } = params;

  return <PembelianInvoiceDetailsView id={id} />;
  // return <InvoiceDetailsView id={id} />;
}

export async function generateStaticParams() {
  return _invoices.map((invoice) => ({
    id: invoice.id,
  }));
}

PembelianTernakInvoice.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
