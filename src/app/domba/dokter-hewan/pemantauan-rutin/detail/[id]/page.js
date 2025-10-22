import PemantauanRutinDetailView from 'src/sections/domba/dokter-hewan/pemantauan-rutin/view/pemantauan-rutin-detail-view';

export const metadata = {
  title: 'Pemantauan Rutin',
};

export default function PemantauanRutinDetail({ params }) {
  const { id } = params;

  return <PemantauanRutinDetailView id={id} />;
}
