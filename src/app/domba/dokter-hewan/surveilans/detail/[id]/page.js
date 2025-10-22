// import SurveilansDetailView from 'src/sections/dokter-hewan/surveilans/view/surveilans-detail-view';

import SurveilansDetailView from 'src/sections/domba/dokter-hewan/surveilans/view/surveilans-detail-view';

export const metadata = {
  title: 'Surveilans',
};

export default function TernakDetailsPage({ params }) {
  const { id } = params;

  return <SurveilansDetailView id={id} />;
}
