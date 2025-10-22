'use client';

import { Box } from '@mui/material';
import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DombaAuthGuard from 'src/auth/guard/domba-auth-guard';
import DombaPeternakanLayout from 'src/layouts/dashboard-domba-peternakan';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <DombaAuthGuard>
      <DombaPeternakanLayout>
        <RoleBasedGuard role="peternakan" hasContent sx={{ py: 10 }}>
          <Box marginTop={2}>{children}</Box>
        </RoleBasedGuard>
      </DombaPeternakanLayout>
    </DombaAuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
