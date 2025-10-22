import PropTypes from 'prop-types';
// _mock
import { _userList } from 'src/_mock/_user';
// sections
import { ManageUserEditView } from 'src/sections/peternakan/manage-user/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Manage User Edit',
};

export default function ManageUserEditPage({ params }) {
  const { id } = params;

  return <ManageUserEditView id={id} />;
}

export async function generateStaticParams() {
  return _userList.map((user) => ({
    id: user.id,
  }));
}

ManageUserEditPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};
