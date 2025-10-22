import { DetailTernakView } from 'src/sections/domba/ternak/detail';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Anitime: Detail Ternak',
};

export default function OverviewPage({ params }) {
  const { id } = params;

  return <DetailTernakView id={id} />;
}
