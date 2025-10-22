import RegistrasiObatDetailView from "src/sections/dokter-hewan/registrasi-obat/view/registrasi-obat-detail-view";

export const metadata = {
  title: 'Registrasi Obat',
};

export default function RegistrasiObatDetail({ params }) {
  const { id } = params;

  return <RegistrasiObatDetailView id={id} />;
}
