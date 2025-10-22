import { PerkawinanDetailView } from 'src/sections/domba/peternakan/perkawinan/view';

export const metadata = {
  title: 'Detail Perkawinan',
};

export default function KandangDetailsPage({ params }) {
  const { id } = params;

  return <PerkawinanDetailView id={id} />;
}
