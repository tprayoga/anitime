'use client';

import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import AnakKandangLayout from 'src/layouts/dashboard-anak-kandang';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <AnakKandangLayout>
        <RoleBasedGuard role="anakKandang" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </AnakKandangLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
