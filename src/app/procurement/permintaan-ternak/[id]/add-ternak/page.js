import PropTypes from 'prop-types';

import BlankPage from 'src/app/dashboard/blank/page';
import { PermintaanTernakNewEditView } from 'src/sections/procurement/permintaan-ternak-new/tambah-ternak/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'BODHA: Tambah Ternak',
};

export default function PermintaanAddTernakPage({ params }) {
  const { id } = params;

  return <PermintaanTernakNewEditView id={id} />;
}

PermintaanAddTernakPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
