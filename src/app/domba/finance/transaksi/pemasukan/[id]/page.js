import { TransaksiDetailView } from 'src/sections/domba/finance/transaksi/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Detail Pemasukan',
};

export default function TransaksiViewPage({ params }) {
  const { id } = params;

  return <TransaksiDetailView id={id} />;
}
