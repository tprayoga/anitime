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
  dashboard: icon('ic_dashboard'),
  carbon: icon('ic_co2'),
  kandang: icon('kandang'),
  ternak: icon('ternak'),
  laluLintas: icon('traffic'),
  transaksi: icon('transaction'),
  perkawinan: icon('perkawinan'),
  regPakan: icon('reg-pakan'),
  plasma: icon('plasma'),
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
            path: paths.dombaAnakKandang.root,
            icon: ICONS.overview,
          },
          {
            title: t('Kandang'),
            path: paths.dombaAnakKandang.kandang.root,
            icon: ICONS.kandang,
          },
          {
            title: t('Ternak'),
            path: paths.dombaAnakKandang.ternak.root,
            icon: ICONS.ternak,
          },
          {
            title: t('Pembiakan'),
            path: paths.dombaAnakKandang.perkawinan.root,
            icon: ICONS.perkawinan,
          },
          {
            title: t('Lalu Lintas'),
            path: paths.dombaAnakKandang.laluLintas.root,
            icon: ICONS.laluLintas,
          },
          {
            title: t('Pemberian Pakan'),
            path: paths.dombaAnakKandang.pemberianPakan.root,
            icon: ICONS.regPakan,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
