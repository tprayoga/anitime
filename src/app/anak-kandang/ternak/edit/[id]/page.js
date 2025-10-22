import { TernakEditView } from 'src/sections/anak-kandang/ternak/view';

export const metadata = {
  title: 'Edit Ternak',
};

export default function TernakEditPage({ params }) {
  const { id } = params;

  return <TernakEditView id={id} />;
}
