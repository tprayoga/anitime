import PropTypes from 'prop-types';
// sections
import { ManageUserEditView } from 'src/sections/domba/peternakan/manage-user/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Manage User Edit',
};

export default function ManageUserEditPage({ params }) {
  const { id } = params;

  return <ManageUserEditView id={id} />;
}

ManageUserEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
