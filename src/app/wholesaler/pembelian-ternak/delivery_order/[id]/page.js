import PropTypes from 'prop-types';

import { _invoices } from 'src/_mock/_invoice';
import { PembelianDeliveryOrderView } from 'src/sections/wholesaler/pembelianTernak/deliveryOrder/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Invoice Details',
};

export default function PembelianTernakDevliveryOrder({ params }) {
  const { id } = params;

  return <PembelianDeliveryOrderView id={id} />;
}

export async function generateStaticParams() {
  return _invoices.map((invoice) => ({
    id: invoice.id,
  }));
}

PembelianTernakDevliveryOrder.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
