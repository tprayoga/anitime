import LaporanSurveilansDetailView from 'src/sections/dokter-hewan/surveilans/view/laporan-surveilans-detail-view';

export const metadata = {
  title: 'Laporan Surveilans',
};

export default function LaporanSurveilansDetailPage({ params }) {
  const { id } = params;

  return <LaporanSurveilansDetailView id={id} />;
}
