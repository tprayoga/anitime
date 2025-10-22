import PlasmaCreateView from 'src/sections/domba/inti/plasma/view/plasma-create-view';

export const metadata = {
  title: 'Create Plasma',
};

export default function CreatePlasmaViewPage({ params }) {
  const { id } = params;

  return <PlasmaCreateView id={id} />;
}
