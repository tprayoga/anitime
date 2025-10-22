'use client';

import PropTypes from 'prop-types';

import { DombaGuestGuard } from 'src/auth/guard';

import AuthDombaLayout from 'src/layouts/auth/domba';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    // <GuestGuard>
    <DombaGuestGuard>
      <AuthDombaLayout image="/assets/background/anitime-sheep-bg.png">{children}</AuthDombaLayout>
    </DombaGuestGuard>
    // </GuestGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
