import { PerkawinanDetailView } from 'src/sections/domba/anak-kandang/perkawinan/view';

export const metadata = {
  title: 'Detail Perkawinan',
};

export default function KandangDetailsPage({ params }) {
  const { id } = params;

  return <PerkawinanDetailView id={id} />;
}
