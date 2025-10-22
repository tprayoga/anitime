import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export default function DombaGuestGuard({ children }) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container> {children}</Container>}</>;
}

DombaGuestGuard.propTypes = {
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
        router.replace(paths.dombaPeternakan.root);
      } else if (user.role === 'anakKandang') {
        router.replace(paths.dombaAnakKandang.root);
      } else if (user.role === 'finance') {
        router.replace(paths.dombaFinance.root);
      } else if (user.role === 'dokterHewan') {
        router.replace(paths.dombaDokterHewan.root);
      } else if (user.role === 'intiPeternakan') {
        router.replace(paths.dombaIntiPeternakan.root);
      } else if (user.role === 'intiAnakKandang') {
        router.replace(paths.dombaIntiAnakKandang.root);
      } else if (user.role === 'intiFinance') {
        router.replace(paths.dombaIntiFinance.root);
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
