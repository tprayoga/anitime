import { LaluLintasDetailView } from 'src/sections/peternakan/lalu-lintas/view';

export const metadata = {
  title: 'Detail Lalu Lintas',
};

export default function TernakDetailsPage({ params }) {
  const { id } = params;

  return <LaluLintasDetailView id={id} />;
}
