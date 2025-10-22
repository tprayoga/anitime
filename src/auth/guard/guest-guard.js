import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export default function GuestGuard({ children }) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container> {children}</Container>}</>;
}

GuestGuard.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

function Container({ children }) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo') || paths.dashboard.root;

  const { authenticated, user, loading } = useAuthContext();

  const check = useCallback(() => {
    if (authenticated) {
      if (user.role === 'peternakan') {
        router.replace(paths.peternakan.root);
      } else if (user.role === 'anakKandang') {
        router.replace(paths.anakKandang.root);
      } else if (user.role === 'finance') {
        router.replace(paths.finance.root);
      } else if (user.role === 'procurement') {
        router.replace(paths.procurement.root);
      } else if (user.role === 'dokterHewan') {
        router.replace(paths.dokterHewan.root);
      } else if (user.role === 'wholesaler') {
        router.replace(paths.wholesaler.root);
      } else if (user.role === 'domba') {
        router.replace(paths.domba.root);
      } else {
        router.replace(returnTo);
      }
    }
  }, [authenticated, returnTo, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}

Container.propTypes = {
  children: PropTypes.node,
};
