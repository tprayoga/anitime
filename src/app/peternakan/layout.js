'use client';

import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import DashboardLayout from 'src/layouts/dashboard';
import PeternakanLayout from 'src/layouts/dashboard-peternakan';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  const { user } = useAuthContext();

  return (
    <AuthGuard>
      <PeternakanLayout>
        <RoleBasedGuard role="peternakan" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </PeternakanLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
