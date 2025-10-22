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
            path: paths.domba.root,
            icon: ICONS.overview,
          },
          {
            title: t('Kandang'),
            path: paths.domba.kandang.root,
            icon: ICONS.kandang,
          },
          {
            title: t('Ternak'),
            path: paths.domba.ternak.root,
            icon: ICONS.ternak,
          },
          {
            title: t('Lalu Lintas'),
            path: paths.domba.laluLintas.root,
            icon: ICONS.laluLintas,
          },
          {
            title: t('Transaksi'),
            path: paths.domba.transaksi.root,
            icon: ICONS.transaksi,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
