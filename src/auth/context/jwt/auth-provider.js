'use client';

import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';
import pb from 'src/utils/pocketbase';
import pbDomba from 'src/utils/pocketbase-domba';

import { AuthContext } from './auth-context';
import { setSession, isValidToken, setAdminSession } from './utils';
import { usePathname } from 'next/navigation';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';
const PATH_LOGIN_ADMIN = process.env.NEXT_PUBLIC_DATABASE_ADMIN;
const PATH_LOGIN_ADMIN_DOMBA = process.env.NEXT_PUBLIC_DATABASE_DOMBA_ADMIN;
const ADMIN_IDENTITY = process.env.NEXT_PUBLIC_ADMIN_IDENTITY;
const ADMIN_DOMBA_IDENTITY = process.env.NEXT_PUBLIC_ADMIN_DOMBA_IDENTITY;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const ADMIN_DOMBA_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_DOMBA_PASSWORD;

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const router = useRouter();

  const pathname = usePathname();

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // const response = await axios.get(endpoints.auth.me);
        const response = pathname.includes('domba')
          ? await pbDomba.collection('users').getOne(pbDomba.authStore.model.id)
          : await pb.collection('users').getOne(pb.authStore.model.id);

        const user = response;

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const data = {
      identity: email,
      password,
    };

    // const response = await axios.post(endpoints.auth.login, data);
    const response = await pb.collection('users').authWithPassword(email, password);

    const { token, record: user } = response;

    setSession(token);

    const permissions = ['peternakan', 'wholesaler', 'finance', 'procurement'];

    if (permissions.includes(user.role)) {
      const { data } = await axios.post(PATH_LOGIN_ADMIN, {
        identity: ADMIN_IDENTITY,
        password: ADMIN_PASSWORD,
      });

      setAdminSession(data.token);
    }

    dispatch({
      type: 'LOGIN',
      payload: {
        user: user,
      },
    });
  }, []);

  // LOGIN DOMBA
  const loginDomba = useCallback(async (email, password) => {
    const data = {
      identity: email,
      password,
    };

    // const response = await axios.post(endpoints.auth.login, data);
    const response = await pbDomba.collection('users').authWithPassword(email, password);

    const { token, record: user } = response;

    setSession(token);

    const permissions = ['peternakan', 'inti-finance'];

    if (permissions.includes(user.role)) {
      const { data } = await axios.post(PATH_LOGIN_ADMIN_DOMBA, {
        identity: ADMIN_DOMBA_IDENTITY,
        password: ADMIN_DOMBA_PASSWORD,
      });

      setAdminSession(data.token);
    }

    dispatch({
      type: 'LOGIN',
      payload: {
        user: user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (data) => {
    const body = {
      ...data,
      passwordConfirm: data.password,
    };

    // const response = await axios.post(endpoints.auth.register, data);
    try {
      await pb.collection('users').create(body);
      const response = await pb.collection('users').authWithPassword(data.email, data.password);

      const { token, record: user } = response;

      sessionStorage.setItem(STORAGE_KEY, token);

      dispatch({
        type: 'REGISTER',
        payload: {
          user: {
            ...user,
            token,
          },
        },
      });
    } catch (error) {
      throw error?.data?.data;
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // LOGOUT
  const logoutDomba = useCallback(async () => {
    router.replace('/auth/domba/login');
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      loginDomba,
      register,
      logout,
      logoutDomba,
    }),
    [login, loginDomba, logout, register, logoutDomba, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
