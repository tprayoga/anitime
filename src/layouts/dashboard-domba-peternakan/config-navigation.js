import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/domba/sidebar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  overview: icon('anitime-overview'),
  kandang: icon('kandang'),
  ternak: icon('ternak'),
  laluLintas: icon('traffic'),
  transaksi: icon('transaction'),
  perkawinan: icon('perkawinan'),
  regPakan: icon('reg-pakan'),
  manageUser: icon('manage-user'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // ANITIME
      {
        subheader: t('Dashboard'),
        items: [
          {
            title: t('Overview'),
            path: paths.dombaPeternakan.root,
            icon: ICONS.overview,
          },
          {
            title: t('Kandang'),
            path: paths.dombaPeternakan.kandang.root,
            icon: ICONS.kandang,
          },
          {
            title: t('Ternak'),
            path: paths.dombaPeternakan.ternak.root,
            icon: ICONS.ternak,
          },
          {
            title: t('Perkawinan'),
            path: paths.dombaPeternakan.perkawinan.root,
            icon: ICONS.perkawinan,
          },
          {
            title: t('Lalu Lintas'),
            path: paths.dombaPeternakan.laluLintas.root,
            icon: ICONS.laluLintas,
          },
          // {
          //   title: t('Transaksi'),
          //   path: paths.dombaPeternakan.transaksi.root,
          //   icon: ICONS.transaksi,
          // },
          {
            title: t('Pakan'),
            path: paths.dombaPeternakan.regPakan.root,
            icon: ICONS.regPakan,
          },
          {
            title: t('Manage User'),
            path: paths.dombaPeternakan.manageUser.root,
            icon: ICONS.manageUser,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
