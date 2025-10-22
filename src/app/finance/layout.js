'use client';

import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import FinanceLayout from 'src/layouts/dashboard-finance';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <FinanceLayout>
        <RoleBasedGuard role="finance" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </FinanceLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
