import PemeriksaanLengkapDetailView from 'src/sections/domba/dokter-hewan/pemeriksaan-lengkap/view/pemeriksaan-lengkap-detail-view';

export const metadata = {
  title: 'Pemeriksaan Lengkap',
};

export default function PemeriksaanLengkapDetail({ params }) {
  const { id } = params;

  return <PemeriksaanLengkapDetailView id={id} />;
}
