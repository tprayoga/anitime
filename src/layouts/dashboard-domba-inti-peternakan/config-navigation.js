import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/domba/sidebar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />

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
            path: paths.dombaIntiPeternakan.root,
            icon: ICONS.overview,
          },
          {
            title: t('Carbon'),
            path: paths.dombaIntiPeternakan.carbon.root,
            icon: ICONS.carbon,
          },
          {
            title: t('Plasma'),
            path: paths.dombaIntiPeternakan.plasma.root,
            icon: ICONS.plasma,
          },
          {
            title: t('Kandang'),
            path: paths.dombaIntiPeternakan.kandang.root,
            icon: ICONS.kandang,
          },
          {
            title: t('Ternak'),
            path: paths.dombaIntiPeternakan.ternak.root,
            icon: ICONS.ternak,
          },
          {
            title: t('Pembiakan'),
            path: paths.dombaIntiPeternakan.perkawinan.root,
            icon: ICONS.perkawinan,
          },
          {
            title: t('Lalu Lintas'),
            path: paths.dombaIntiPeternakan.laluLintas.root,
            icon: ICONS.laluLintas,
          },
          {
            title: t('Pemberian Pakan'),
            path: paths.dombaIntiPeternakan.regPakan.root,
            icon: ICONS.regPakan,
          },
          {
            title: t('Manage User'),
            path: paths.dombaIntiPeternakan.manageUser.root,
            icon: ICONS.manageUser,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
