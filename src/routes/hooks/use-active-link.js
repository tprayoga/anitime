import { usePathname } from 'next/navigation';

// ----------------------------------------------------------------------

export function useActiveLink(path, deep = true) {
  const pathname = usePathname();

  const defaultPath = [
    '/dashboard/',
    '/anak-kandang/',
    '/peternakan/',
    '/finance/',
    '/procurement/',
    '/dokter-hewan/',
    '/wholesaler/',
    '/domba/peternakan/',
    '/domba/anak-kandang/',
    '/domba/finance/',
    '/domba/dokter-hewan/',
    '/domba/inti-peternakan/',
    '/domba/inti-anak-kandang/',
    '/domba/inti-finance/',
  ];

  const checkPath = path.startsWith('#');

  const currentPath = path === '/' ? '/' : `${path}/`;

  const normalActive =
    !checkPath && defaultPath.includes(pathname)
      ? pathname === currentPath
      : pathname.includes('domba')
        ? currentPath.split('/')[3]?.includes(pathname.split('/')[3])
        : currentPath.split('/')[2]?.includes(pathname.split('/')[2]);

  const deepActive = !checkPath && pathname.includes(currentPath);

  return deep ? deepActive : normalActive;
}
