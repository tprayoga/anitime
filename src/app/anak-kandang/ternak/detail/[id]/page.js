import { TernakDetailView } from 'src/sections/anak-kandang/ternak/view';

export const metadata = {
  title: 'Detail Ternak',
};

export default function TernakDetailsPage({ params }) {
  const { id } = params;

  return <TernakDetailView id={id} />;
}
