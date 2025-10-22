// import { LaluLintasDetailView } from 'src/sections/domba/anak-kandang/lalu-lintas/view';

import BirahiDetailView from 'src/sections/domba/anak-kandang/birahi/birahi-detail-view';

export const metadata = {
  title: 'Detail Birahi',
};

export default function BirahiDetailPage({ params }) {
  const { id } = params;

  return <BirahiDetailView id={id} />;
}
