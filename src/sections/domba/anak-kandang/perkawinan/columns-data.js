export const columnsPerkawinan = [
  {
    field: 'created',
    headerName: 'Tanggal',
    flex: 1,
    minWidth: 160,
    renderCell: (params) => (
      <Typography
        sx={{
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
            color: '#00BFFF',
          },
          typography: 'caption',
          py: 2,
        }}
        onClick={() => {
          user.role === 'anakKandang'
            ? window.open(`${paths.dombaAnakKandang.perkawinan.detail(params?.row?.id)}`, '_blank')
            : window.open(
                `${paths.dombaIntiAnakKandang.perkawinan.detail(params?.row?.id)}`,
                '_blank'
              );
        }}
      >
        {fDate(params?.row?.created)}
      </Typography>
    ),
  },
  {
    field: 'ternakJantan',
    headerName: 'Ternak Jantan',
    flex: 1,
    minWidth: 160,
    renderCell: (params) => `${params.row.expand.ternakJantan[0].noFID}`,
  },
  {
    field: 'ternakBetina',
    headerName: 'Ternak Betina',
    flex: 1,
    minWidth: 160,
    renderCell: (params) => `${params.row.expand.ternakBetina.length} ekor`,
  },
  {
    field: 'metodePengkawinan',
    headerName: 'Metode Pengkawinan',
    flex: 1,
    minWidth: 160,
  },
];

export const columnsBirahi = [
  {
    field: 'created',
    headerName: 'Tanggal',
    flex: 1,
    minWidth: 160,
    renderCell: (params) => (
      <Typography
        sx={{
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
            color: '#00BFFF',
          },
          typography: 'caption',
          py: 2,
        }}
      >
        {fDate(params?.row?.created)}
      </Typography>
    ),
  },
  {
    field: 'gejalaBirahi',
    headerName: 'Gejala Birahi',
    flex: 1,
    minWidth: 160,
    renderCell: (params) => `${params.row.expand.ternak.noFID}`,
  },
  {
    field: 'ternakBetina',
    headerName: 'Ternak Betina',
    flex: 1,
    minWidth: 160,
    renderCell: (params) => `${params.row.expand.ternakBetina.length} ekor`,
  },
  {
    field: 'metodePengkawinan',
    headerName: 'Metode Pengkawinan',
    flex: 1,
    minWidth: 160,
  },
];
