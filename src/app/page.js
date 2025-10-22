'use client';

import { useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /auth/login
    router.push('/auth/jwt/login');
  }, []);

  return null; // or you can return some loading indicator if needed
}
