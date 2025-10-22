import { TransaksiDetailView } from 'src/sections/peternakan/transaksi/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Detail Pemasukan',
};

export default function TransaksiViewPage({ params }) {
  const { id } = params;

  return <TransaksiDetailView id={id} />;
}
