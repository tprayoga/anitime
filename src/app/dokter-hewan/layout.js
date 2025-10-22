'use client';

import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DokterHewanLayout from 'src/layouts/dashboard-dokter-hewan';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <DokterHewanLayout>
        <RoleBasedGuard role="dokterHewan" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </DokterHewanLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
