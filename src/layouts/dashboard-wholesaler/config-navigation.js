import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/sidebar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  overview: icon('anitime-overview'),
  pembelian: icon('anitime-pembelian'),
  permintaan: icon('anitime-permintaan'),
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
            path: paths.wholesaler.root,
            icon: ICONS.overview,
          },
          {
            title: t('Pembelian Ternak'),
            path: paths.wholesaler.pembelianTernak.root,
            icon: ICONS.pembelian,
          },
          {
            title: t('Permintaan Ternak'),
            path: paths.wholesaler.permintaanTernak.root,
            icon: ICONS.permintaan,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
