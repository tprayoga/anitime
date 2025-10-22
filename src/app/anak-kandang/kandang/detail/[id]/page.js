import { KandangDetailView } from 'src/sections/anak-kandang/kandang/view';

export const metadata = {
  title: 'Detail Kandang',
};

export default function KandangDetailsPage({ params }) {
  const { id } = params;

  return <KandangDetailView id={id} />;
}
