// import { KandangDetailView } from 'src/sections/anak-kandang/kandang/view';

import PlasmaDetailView from 'src/sections/domba/inti/plasma/view/plasma-detail-view';

export const metadata = {
  title: 'Detail Plasma',
};

export default function KandangDetailsPage({ params }) {
  const { id } = params;

  return <PlasmaDetailView id={id} />;
}
