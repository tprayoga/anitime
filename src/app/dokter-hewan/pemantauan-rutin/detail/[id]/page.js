// import PemeriksaanLengkapDetailView from "src/sections/dokter-hewan/pemeriksaan-lengkap/view/pemeriksaan-lengkap-detail-view";

import PemantauanRutinDetailView from "src/sections/dokter-hewan/pemantauan-rutin/view/pemantauan-rutin-detail-view";

export const metadata = {
  title: 'Pemantauan Rutin',
};

export default function PemantauanRutinDetail({ params }) {
  const { id } = params;

  return <PemantauanRutinDetailView id={id} />;
}
