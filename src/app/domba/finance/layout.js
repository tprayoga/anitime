'use client';

import PropTypes from 'prop-types';

import { AuthGuard, DombaAuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DombaIntiFinanceLayout from 'src/layouts/dashboard-domba-inti-finance';
import FinanceLayout from 'src/layouts/dashboard-finance';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <DombaAuthGuard>
      <DombaIntiFinanceLayout>
        <RoleBasedGuard role="finance" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </DombaIntiFinanceLayout>
    </DombaAuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
