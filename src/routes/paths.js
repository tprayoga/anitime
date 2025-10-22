import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  PETERNAKAN: '/peternakan',
  ANAK_KANDANG: '/anak-kandang',
  FINANCE: '/finance',
  PROCUREMENT: '/procurement',
  DOKTER_HEWAN: '/dokter-hewan',
  WHOLESALER: '/wholesaler',
  DOMBA: '/domba',
  DOMBA_PETERNAKAN: '/domba/peternakan',
  DOMBA_ANAK_KANDANG: '/domba/anak-kandang',
  DOMBA_FINANCE: '/domba/finance',
  DOMBA_DOKTER_HEWAN: '/domba/dokter-hewan',
  DOMBA_INTI_PETERNAKAN: '/domba/inti-peternakan',
  DOMBA_INTI_ANAK_KANDANG: '/domba/inti-anak-kandang',
  DOMBA_INTI_FINANCE: '/domba/inti-finance',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
    supabase: {
      login: `${ROOTS.AUTH}/supabase/login`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      register: `${ROOTS.AUTH}/supabase/register`,
      newPassword: `${ROOTS.AUTH}/supabase/new-password`,
      forgotPassword: `${ROOTS.AUTH}/supabase/forgot-password`,
    },
    domba: {
      login: `${ROOTS.AUTH}/domba/login`,
      register: `${ROOTS.AUTH}/domba/register`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
  // DASHBOARD PETERNAKAN
  peternakan: {
    root: ROOTS.PETERNAKAN,
    kandang: {
      root: `${ROOTS.PETERNAKAN}/kandang`,
      detail: (id) => `${ROOTS.PETERNAKAN}/kandang/detail/${id}`,
    },
    carbon: {
      root: `${ROOTS.PETERNAKAN}/carbon`,
    },
    ternak: {
      root: `${ROOTS.PETERNAKAN}/ternak`,
      detail: (id) => `${ROOTS.PETERNAKAN}/ternak/detail/${id}`,
    },
    permintaanTernak: {
      root: `${ROOTS.PETERNAKAN}/permintaan`,
    },
    laluLintas: {
      root: `${ROOTS.PETERNAKAN}/lalu-lintas`,
      detail: (id) => `${ROOTS.PETERNAKAN}/lalu-lintas/detail/${id}`,
    },
    transaksi: {
      root: `${ROOTS.PETERNAKAN}/transaksi`,
      pemasukan: (id) => `${ROOTS.PETERNAKAN}/transaksi/pemasukan/${id}`,
    },
    manageUser: {
      root: `${ROOTS.PETERNAKAN}/manage-user`,
      edit: (id) => `${ROOTS.PETERNAKAN}/manage-user/${id}/edit`,
      new: `${ROOTS.PETERNAKAN}/manage-user/new`,
    },
  },
  // DASHBOARD ANAK KANDANG
  anakKandang: {
    root: ROOTS.ANAK_KANDANG,
    kandang: {
      root: `${ROOTS.ANAK_KANDANG}/kandang`,
      detail: (id) => `${ROOTS.ANAK_KANDANG}/kandang/detail/${id}`,
    },
    ternak: {
      root: `${ROOTS.ANAK_KANDANG}/ternak`,
      create: `${ROOTS.ANAK_KANDANG}/ternak/create`,
      importData: `${ROOTS.ANAK_KANDANG}/ternak/import-data`,
      importDataHistory: `${ROOTS.ANAK_KANDANG}/ternak/import-data/history`,
      detail: (id) => `${ROOTS.ANAK_KANDANG}/ternak/detail/${id}`,
      edit: (id) => `${ROOTS.ANAK_KANDANG}/ternak/edit/${id}`,
    },
    laluLintas: {
      root: `${ROOTS.ANAK_KANDANG}/lalu-lintas`,
      detail: (id) => `${ROOTS.ANAK_KANDANG}/lalu-lintas/detail/${id}`,
    },
  },
  // DASHBOARD FINANCE
  finance: {
    root: ROOTS.FINANCE,
    transaksi: {
      root: `${ROOTS.FINANCE}/transaksi`,
      create: `${ROOTS.FINANCE}/transaksi/create`,
      pemasukan: (id) => `${ROOTS.FINANCE}/transaksi/pemasukan/${id}`,
    },
  },
  // DASHBOARD PROCUREMENT
  procurement: {
    root: ROOTS.PROCUREMENT,
    stok: {
      root: `${ROOTS.PROCUREMENT}/stok`,
      // detail: (id) => `${ROOTS.ANAK_KANDANG}/kandang/detail/${id}`,
    },
    permintaanTernak: {
      root: `${ROOTS.PROCUREMENT}/permintaan-ternak`,
      detail: (id) => `${ROOTS.PROCUREMENT}/permintaan-ternak/${id}`,
      addTernak: (id) => `${ROOTS.PROCUREMENT}/permintaan-ternak/${id}/add-ternak`,
    },
  },
  dokterHewan: {
    root: ROOTS.DOKTER_HEWAN,
    surveilans: {
      root: `${ROOTS.DOKTER_HEWAN}/surveilans`,
      detail: (id) => `${ROOTS.DOKTER_HEWAN}/surveilans/detail/${id}`,
      laporanSurveilans: {
        detail: (id) => `${ROOTS.DOKTER_HEWAN}/surveilans/laporan-surveilans/detail/${id}`,
      },
    },
    pemeriksaanLengkap: {
      root: `${ROOTS.DOKTER_HEWAN}/pemeriksaan-lengkap`,
      detail: (id) => `${ROOTS.DOKTER_HEWAN}/pemeriksaan-lengkap/detail/${id}`,
    },
    pemantauanRutin: {
      root: `${ROOTS.DOKTER_HEWAN}/pemantauan-rutin`,
      detail: (id) => `${ROOTS.DOKTER_HEWAN}/pemantauan-rutin/detail/${id}`,
    },
    registrasiObat: {
      root: `${ROOTS.DOKTER_HEWAN}/registrasi-obat`,
      detail: (id) => `${ROOTS.DOKTER_HEWAN}/registrasi-obat/detail/${id}`,
    },
  },
  // DASHBOARD WHOLESALE
  wholesaler: {
    root: ROOTS.WHOLESALER,
    overview: {
      root: `${ROOTS.WHOLESALER}/overview`,
    },
    pembelianTernak: {
      root: `${ROOTS.WHOLESALER}/pembelian-ternak`,
      deliveryOrder: (id) => `${ROOTS.WHOLESALER}/pembelian-ternak/delivery_order/${id}`,
      invoice: (id) => `${ROOTS.WHOLESALER}/pembelian-ternak/${id}`,
    },
    permintaanTernak: {
      root: `${ROOTS.WHOLESALER}/permintaan-ternak`,
    },
  },
  // DASHBOARD DOMBA
  domba: {
    root: ROOTS.DOMBA,
    overview: {
      root: `${ROOTS.DOMBA}/overview`,
    },
    kandang: {
      root: `${ROOTS.DOMBA}/kandang`,
    },
    ternak: {
      root: `${ROOTS.DOMBA}/ternak`,
    },
    laluLintas: {
      root: `${ROOTS.DOMBA}/lalu-lintas`,
    },
    transaksi: {
      root: `${ROOTS.DOMBA}/transaksi`,
    },
  },

  // DASHBOARD DOMBA PETERNAKAN
  dombaPeternakan: {
    root: ROOTS.DOMBA_PETERNAKAN,
    kandang: {
      root: `${ROOTS.DOMBA_PETERNAKAN}/kandang`,
      detail: (id) => `${ROOTS.DOMBA_PETERNAKAN}/kandang/detail/${id}`,
    },
    ternak: {
      root: `${ROOTS.DOMBA_PETERNAKAN}/ternak`,
      detail: (id) => `${ROOTS.DOMBA_PETERNAKAN}/ternak/detail/${id}`,
    },
    perkawinan: {
      root: `${ROOTS.DOMBA_PETERNAKAN}/perkawinan`,
      detail: (id) => `${ROOTS.DOMBA_PETERNAKAN}/perkawinan/detail/${id}`,
    },
    laluLintas: {
      root: `${ROOTS.DOMBA_PETERNAKAN}/lalu-lintas`,
      detail: (id) => `${ROOTS.DOMBA_PETERNAKAN}/lalu-lintas/detail/${id}`,
    },
    transaksi: {
      root: `${ROOTS.DOMBA_PETERNAKAN}/transaksi`,
      pemasukan: (id) => `${ROOTS.DOMBA_PETERNAKAN}/transaksi/pemasukan/${id}`,
    },
    regPakan: {
      root: `${ROOTS.DOMBA_PETERNAKAN}/registrasi-pakan`,
      detail: (id) => `${ROOTS.DOMBA_PETERNAKAN}/registrasi-pakan/detail/${id}`,
    },
    manageUser: {
      root: `${ROOTS.DOMBA_PETERNAKAN}/manage-user`,
      edit: (id) => `${ROOTS.DOMBA_PETERNAKAN}/manage-user/${id}/edit`,
      new: `${ROOTS.DOMBA_PETERNAKAN}/manage-user/new`,
    },
    birahi: {
      detail: (id) => `${ROOTS.DOMBA_PETERNAKAN}/birahi/detail/${id}`,
    },
  },

  // DASHBOARD DOMBA INTI
  dombaIntiPeternakan: {
    root: ROOTS.DOMBA_INTI_PETERNAKAN,
    plasma: {
      root: `${ROOTS.DOMBA_INTI_PETERNAKAN}/plasma`,
      create: `${ROOTS.DOMBA_INTI_PETERNAKAN}/plasma/create`,
      detail: (id) => `${ROOTS.DOMBA_INTI_PETERNAKAN}/plasma/detail/${id}`,
    },
    carbon: {
      root: `${ROOTS.DOMBA_INTI_PETERNAKAN}/carbon`,
    },
    kandang: {
      root: `${ROOTS.DOMBA_INTI_PETERNAKAN}/kandang`,
      detail: (id) => `${ROOTS.DOMBA_INTI_PETERNAKAN}/kandang/detail/${id}`,
    },
    ternak: {
      root: `${ROOTS.DOMBA_INTI_PETERNAKAN}/ternak`,
      detail: (id) => `${ROOTS.DOMBA_INTI_PETERNAKAN}/ternak/detail/${id}`,
    },
    perkawinan: {
      root: `${ROOTS.DOMBA_INTI_PETERNAKAN}/perkawinan`,
      detail: (id) => `${ROOTS.DOMBA_INTI_PETERNAKAN}/perkawinan/detail/${id}`,
    },
    laluLintas: {
      root: `${ROOTS.DOMBA_INTI_PETERNAKAN}/lalu-lintas`,
      detail: (id) => `${ROOTS.DOMBA_INTI_PETERNAKAN}/lalu-lintas/detail/${id}`,
    },
    transaksi: {
      root: `${ROOTS.DOMBA_INTI_PETERNAKAN}/transaksi`,
      pemasukan: (id) => `${ROOTS.DOMBA_INTI_PETERNAKAN}/transaksi/pemasukan/${id}`,
    },
    regPakan: {
      root: `${ROOTS.DOMBA_INTI_PETERNAKAN}/registrasi-pakan`,
      detail: (id) => `${ROOTS.DOMBA_INTI_PETERNAKAN}/registrasi-pakan/detail/${id}`,
    },
    manageUser: {
      root: `${ROOTS.DOMBA_INTI_PETERNAKAN}/manage-user`,
      edit: (id) => `${ROOTS.DOMBA_INTI_PETERNAKAN}/manage-user/${id}/edit`,
      new: `${ROOTS.DOMBA_INTI_PETERNAKAN}/manage-user/new`,
    },
    birahi: {
      detail: (id) => `${ROOTS.DOMBA_INTI_PETERNAKAN}/birahi/detail/${id}`,
    },
  },

  dombaIntiAnakKandang: {
    root: ROOTS.DOMBA_INTI_ANAK_KANDANG,
    plasma: {
      root: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/plasma`,
      create: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/plasma/create`,
      detail: (id) => `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/plasma/detail/${id}`,
    },
    kandang: {
      root: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/kandang`,
      detail: (id) => `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/kandang/detail/${id}`,
    },
    ternak: {
      root: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/ternak`,
      create: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/ternak/create`,
      detail: (id) => `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/ternak/detail/${id}`,
    },
    perkawinan: {
      root: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/perkawinan`,
      detail: (id) => `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/perkawinan/detail/${id}`,
    },
    birahi: {
      // root: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/perkawinan`,
      detail: (id) => `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/birahi/detail/${id}`,
    },
    laluLintas: {
      root: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/lalu-lintas`,
      detail: (id) => `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/lalu-lintas/detail/${id}`,
    },
    transaksi: {
      root: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/transaksi`,
      pemasukan: (id) => `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/transaksi/pemasukan/${id}`,
    },
    pemberianPakan: {
      root: `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/pemberian-pakan`,
      detail: (id) => `${ROOTS.DOMBA_INTI_ANAK_KANDANG}/pemberian-pakan/detail/${id}`,
    },
  },

  // DASHBOARD DOMBA FINANCE
  dombaIntiFinance: {
    root: ROOTS.DOMBA_INTI_FINANCE,
    transaksi: {
      root: `${ROOTS.DOMBA_INTI_FINANCE}/transaksi`,
      create: `${ROOTS.DOMBA_INTI_FINANCE}/transaksi/create`,
      pemasukan: (id) => `${ROOTS.DOMBA_INTI_FINANCE}/transaksi/pemasukan/${id}`,
    },
  },

  // DASHBOARD DOMBA ANAK KANDANG
  dombaAnakKandang: {
    root: ROOTS.DOMBA_ANAK_KANDANG,
    kandang: {
      root: `${ROOTS.DOMBA_ANAK_KANDANG}/kandang`,
      detail: (id) => `${ROOTS.DOMBA_ANAK_KANDANG}/kandang/detail/${id}`,
    },
    ternak: {
      root: `${ROOTS.DOMBA_ANAK_KANDANG}/ternak`,
      create: `${ROOTS.DOMBA_ANAK_KANDANG}/ternak/create`,
      importData: `${ROOTS.DOMBA_ANAK_KANDANG}/ternak/import-data`,
      importDataHistory: `${ROOTS.DOMBA_ANAK_KANDANG}/ternak/import-data/history`,
      detail: (id) => `${ROOTS.DOMBA_ANAK_KANDANG}/ternak/detail/${id}`,
      edit: (id) => `${ROOTS.DOMBA_ANAK_KANDANG}/ternak/edit/${id}`,
    },
    perkawinan: {
      root: `${ROOTS.DOMBA_ANAK_KANDANG}/perkawinan`,
      detail: (id) => `${ROOTS.DOMBA_ANAK_KANDANG}/perkawinan/detail/${id}`,
    },
    laluLintas: {
      root: `${ROOTS.DOMBA_ANAK_KANDANG}/lalu-lintas`,
      detail: (id) => `${ROOTS.DOMBA_ANAK_KANDANG}/lalu-lintas/detail/${id}`,
    },
    pemberianPakan: {
      root: `${ROOTS.DOMBA_ANAK_KANDANG}/pemberian-pakan`,
      detail: (id) => `${ROOTS.DOMBA_ANAK_KANDANG}/pemberian-pakan/detail/${id}`,
    },
    birahi: {
      detail: (id) => `${ROOTS.DOMBA_ANAK_KANDANG}/birahi/detail/${id}`,
    },
  },

  // DASHBOARD DOMBA FINANCE
  dombaFinance: {
    root: ROOTS.DOMBA_FINANCE,
    transaksi: {
      root: `${ROOTS.DOMBA_FINANCE}/transaksi`,
      create: `${ROOTS.DOMBA_FINANCE}/transaksi/create`,
      pemasukan: (id) => `${ROOTS.DOMBA_FINANCE}/transaksi/pemasukan/${id}`,
    },
  },

  // DASHBOARD DOMBA DOKTER HEWAN
  dombaDokterHewan: {
    root: ROOTS.DOMBA_DOKTER_HEWAN,
    surveilans: {
      root: `${ROOTS.DOMBA_DOKTER_HEWAN}/surveilans`,
      detail: (id) => `${ROOTS.DOMBA_DOKTER_HEWAN}/surveilans/detail/${id}`,
      laporanSurveilans: {
        detail: (id) => `${ROOTS.DOMBA_DOKTER_HEWAN}/surveilans/laporan-surveilans/detail/${id}`,
      },
    },
    pemeriksaanLengkap: {
      root: `${ROOTS.DOMBA_DOKTER_HEWAN}/pemeriksaan-lengkap`,
      detail: (id) => `${ROOTS.DOMBA_DOKTER_HEWAN}/pemeriksaan-lengkap/detail/${id}`,
    },
    pemantauanRutin: {
      root: `${ROOTS.DOMBA_DOKTER_HEWAN}/pemantauan-rutin`,
      detail: (id) => `${ROOTS.DOMBA_DOKTER_HEWAN}/pemantauan-rutin/detail/${id}`,
    },
    registrasiObat: {
      root: `${ROOTS.DOMBA_DOKTER_HEWAN}/registrasi-obat`,
      detail: (id) => `${ROOTS.DOMBA_DOKTER_HEWAN}/registrasi-obat/detail/${id}`,
    },
  },
};
