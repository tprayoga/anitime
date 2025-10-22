'use client';

import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import WholesalerLayout from 'src/layouts/dashboard-wholesaler';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <WholesalerLayout>
        <RoleBasedGuard role="wholesaler" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </WholesalerLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
