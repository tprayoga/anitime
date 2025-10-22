'use client';

import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DombaDokterHewanLayout from 'src/layouts/dashboard-domba-dokter-hewan';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <DombaDokterHewanLayout>
        <RoleBasedGuard role="dokterHewan" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </DombaDokterHewanLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
