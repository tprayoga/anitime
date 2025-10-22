import { KandangDetailView } from 'src/sections/peternakan/kandang/view';

export const metadata = {
  title: 'Detail Kandang',
};

export default function KandangDetailsPage({ params }) {
  const { id } = params;

  return <KandangDetailView id={id} />;
}
