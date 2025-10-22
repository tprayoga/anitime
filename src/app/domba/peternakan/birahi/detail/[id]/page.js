import BirahiDetailView from 'src/sections/domba/peternakan/birahi/birahi-detail-view';

export const metadata = {
  title: 'Detail Birahi',
};

export default function BirahiDetailPage({ params }) {
  const { id } = params;

  return <BirahiDetailView id={id} />;
}
