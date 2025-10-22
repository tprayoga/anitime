'use client';

import PropTypes from 'prop-types';

import { AuthGuard, DombaAuthGuard, RoleBasedGuard } from 'src/auth/guard';
import AnakKandangLayout from 'src/layouts/dashboard-anak-kandang';
import DombaIntiAnakKandangLayout from 'src/layouts/dashboard-domba-inti-anak-kandang';
// import DombaAnakKandangLayout from 'src/layouts/dashboard-domba-anak-kandang';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <DombaAuthGuard>
      <DombaIntiAnakKandangLayout>
        <RoleBasedGuard role="intiAnakKandang" hasContent sx={{ py: 10 }}>
          {children}
        </RoleBasedGuard>
      </DombaIntiAnakKandangLayout>
    </DombaAuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
