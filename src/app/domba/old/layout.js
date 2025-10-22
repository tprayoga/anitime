'use client';

import { Box } from '@mui/material';
import PropTypes from 'prop-types';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import DombaAuthGuard from 'src/auth/guard/domba-auth-guard';
import DombaLayout from 'src/layouts/dashboard-domba';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <DombaAuthGuard>
      <DombaLayout>
        <RoleBasedGuard role="domba" hasContent sx={{ py: 10 }}>
          <Box marginTop={2}>{children}</Box>
        </RoleBasedGuard>
      </DombaLayout>
    </DombaAuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
