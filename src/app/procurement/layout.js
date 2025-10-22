'use client';

import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import ProcurementLayout from 'src/layouts/dashboard-procurement';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <ProcurementLayout>
        <RoleBasedGuard role="procurement" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </ProcurementLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
