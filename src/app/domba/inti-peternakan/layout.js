'use client';

import PropTypes from 'prop-types';

import { AuthGuard, DombaAuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DombaIntiPeternakanLayout from 'src/layouts/dashboard-domba-inti-peternakan';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <DombaAuthGuard>
      <DombaIntiPeternakanLayout>
        <RoleBasedGuard role="intiPeternakan" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </DombaIntiPeternakanLayout>
    </DombaAuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
