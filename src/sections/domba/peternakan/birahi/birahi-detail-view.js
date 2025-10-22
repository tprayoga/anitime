'use client';

import { paths } from 'src/routes/paths';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Card, Tooltip, Typography } from '@mui/material';

import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { Fragment, useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
// import TableAnitimeDombaCustom from 'src/components/tableAnitimeCustom';
import { useBoolean } from 'src/hooks/use-boolean';
import AddPenModal from 'src/components/modal-domba/anak-kandang/add-pen-modal';
import { useGetFulLData, useGetOneData } from 'src/api/custom-domba-api';
import { Box } from '@mui/system';
import { fDate } from 'src/utils/format-time';
import { useRouter } from 'next/navigation';
import AddKelahiranModal from 'src/components/modal-domba/anak-kandang/add-kelahiran-modal';
import AddKelahiran2Modal from 'src/components/modal-domba/anak-kandang/add-kelahiran2-modal';
import AddSapihModal from 'src/components/modal-domba/anak-kandang/add-sapih-modal';
import RiwayatBirahiTableRow from './riwayat-birahi-table-row';
import TableAnitimeDombaCustom from 'src/components/tableAnitimeDombaCustom';

// ----------------------------------------------------------------------

export default function BirahiDetailView({ id }) {
  const settings = useSettingsContext();
  const openModal1 = useBoolean();
  const openModal2 = useBoolean();
  const openSapihModal = useBoolean();
  const router = useRouter();

  const [type, setType] = useState('');
  const [refetch, setRefetch] = useState(false);
  const [filters, setFilters] = useState('');
  const [formData, setFormData] = useState('');
  const [selectedKelahiran, setSelectedKelahiran] = useState('');

  const { data, error, loading, getOneData } = useGetOneData();
  // const { data, error, loading, getOneData } = useGetOneData();

  const { data: dataKelahiran, getFullData } = useGetFulLData();

  const TABLE_HEAD = [
    { id: 'waktuBirahi', label: 'Waktu Birahi' },
    { id: 'gejalaBirahi', label: 'Gejala Birahi' },
  ];
  const collection = {
    name: 'birahi',
    searchFilter: 'id',
    filter: [`ternak = "${id}"`],
  };

  const handleNext = (data) => {
    setFormData(data);
    openModal1.onFalse();
    openModal2.onTrue();
  };

  const fetchData = () => {
    // getOneData(
    //   id,
    //   'perkawinan',
    //   'ternakBetina, ternakJantan, ternakJantan.bodyConditionalScore, ternakJantan.bodyFatScore, ternakBetina.bodyConditionalScore, ternakBetina.bodyFatScore'
    // );
    // getFullData('kelahiran', 'ternakAnakan, ternakBetina', `perkawinan = "${id}"`);
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Button
              startIcon={<Iconify icon="ri:arrow-left-s-line" />}
              onClick={() => {
                router.push(`${paths.dombaIntiAnakKandang.perkawinan.root}`);
              }}
            >
              Back
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                openModal1.onTrue();
                setType('CREATE');
              }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Tambah Kelahiran
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={3}>
            <Card>
              <TableAnitimeDombaCustom
                label="Riwayat Birahi"
                filters={filters}
                tableHead={TABLE_HEAD}
                collection={collection}
                expand={'ternak'}
                tableRowComponent={RiwayatBirahiTableRow}
                refetch={refetch}
              />
            </Card>
          </Stack>
        </Grid>

        {/* <Grid item xs={12}>
          <Stack spacing={3}>
            <Card>
              <Box sx={{ pl: 2, backgroundColor: '#DBE9FC' }}>
                <Button variant={'text'} color="inherit" size="large" sx={{ fontSize: 17 }}>
                  Informasi Perkawinan
                </Button>
              </Box>
              <Stack sx={{ p: 3 }} spacing={8} flexDirection={'row'}>
                <Stack>
                  <Typography variant="body2">ID Perkawinan</Typography>
                  <Typography variant="subtitle2">{data?.id}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="body2">Tanggal Perkawinan</Typography>
                  <Typography variant="subtitle2">{fDate(data?.created)}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="body2">Metode Pengkawinan</Typography>
                  <Typography variant="subtitle2">{data?.metodePengkawinan}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="body2">Ternak Jantan</Typography>
                  {data?.expand?.ternakJantan?.map((ternak) => (
                    <Stack flexDirection={'row'} alignItems={'center'} key={ternak.id}>
                      <Tooltip
                        title={
                          <Stack>
                            <Typography variant="caption">No FID : {ternak.noFID}</Typography>
                            <Typography variant="caption">
                              Jenis Hewan : {ternak.jenisHewan}
                            </Typography>
                            <Typography variant="caption">
                              Jenis Kelamin : {ternak.jenisKelamin}
                            </Typography>
                            <Typography variant="caption">
                              Jenis Breed : {ternak.jenisBreed}
                            </Typography>
                            <Typography variant="caption">
                              BCS : {ternak.expand.bodyConditionalScore.name}
                            </Typography>
                            <Typography variant="caption">
                              BFS : {ternak.expand.bodyFatScore.name}
                            </Typography>
                          </Stack>
                        }
                        placement="top-start"
                        arrow
                      >
                        <Iconify icon="clarity:info-solid" />
                      </Tooltip>
                      <Typography variant="subtitle2">{ternak?.noFID}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Stack flex={1}>
                  <Typography variant="body2">Ternak Betina</Typography>
                  <Stack flexDirection={'row'} columnGap={3} rowGap={1} flexWrap={'wrap'}>
                    {data?.expand?.ternakBetina?.map((ternak) => (
                      <Stack flexDirection={'row'} alignItems={'center'} key={ternak.id}>
                        <Tooltip
                          title={
                            <Stack>
                              <Typography variant="caption">No FID : {ternak.noFID}</Typography>
                              <Typography variant="caption">
                                Jenis Hewan : {ternak.jenisHewan}
                              </Typography>
                              <Typography variant="caption">
                                Jenis Kelamin : {ternak.jenisKelamin}
                              </Typography>
                              <Typography variant="caption">
                                Jenis Breed : {ternak.jenisBreed}
                              </Typography>
                              <Typography variant="caption">
                                BCS : {ternak.expand.bodyConditionalScore.name}
                              </Typography>
                              <Typography variant="caption">
                                BFS : {ternak.expand.bodyFatScore.name}
                              </Typography>
                            </Stack>
                          }
                          placement="top-start"
                          arrow
                        >
                          <Iconify icon="clarity:info-solid" />
                        </Tooltip>

                        <Typography variant="subtitle2">{ternak?.noFID}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid> */}

        {/* <Grid item xs={12}>
          <Typography variant="h4">Kelahiran</Typography>
        </Grid> */}
        {/* {dataKelahiran.length > 0 ? (
          dataKelahiran.map((data) => (
            <Grid item xs={4} key={data.id}>
              <Card sx={{ height: '100%' }}>
                <Stack sx={{ p: 3, height: '100%' }} spacing={2}>
                  <Stack>
                    <Typography variant="body2">Tanggal Kelahiran</Typography>
                    <Typography variant="subtitle2">{fDate(data.created)}</Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="body2">Ternak Betina (Induk)</Typography>
                    <Stack flexDirection={'row'} spacing={1}>
                      <Tooltip
                        title={
                          <Stack>
                            <Typography variant="caption">
                              No FID : {data?.expand?.ternakBetina?.noFID}
                            </Typography>
                            <Typography variant="caption">
                              Jenis Hewan : {data?.expand?.ternakBetina?.jenisHewan}
                            </Typography>
                            <Typography variant="caption">
                              Jenis Kelamin : {data?.expand?.ternakBetina?.jenisKelamin}
                            </Typography>
                            <Typography variant="caption">
                              Jenis Breed : {data?.expand?.ternakBetina?.jenisBreed}
                            </Typography>
                          </Stack>
                        }
                        placement="top-start"
                        arrow
                      >
                        <Iconify icon="clarity:info-solid" />
                      </Tooltip>

                      <Typography variant="subtitle2">
                        {data?.expand?.ternakBetina?.noFID}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack>
                    <Typography variant="body2">Ternak Anakan</Typography>
                    {data?.expand?.ternakAnakan?.map((ternak) => (
                      <Stack
                        flexDirection={'row'}
                        spacing={1}
                        alignItems={'center'}
                        key={ternak.id}
                      >
                        <Tooltip
                          title={
                            <Stack>
                              <Typography variant="caption">No FID : {ternak.noFID}</Typography>
                              <Typography variant="caption">
                                Jenis Hewan : {ternak.jenisHewan}
                              </Typography>
                              <Typography variant="caption">
                                Jenis Kelamin : {ternak.jenisKelamin}
                              </Typography>
                              <Typography variant="caption">
                                Jenis Breed : {ternak.jenisBreed}
                              </Typography>
                            </Stack>
                          }
                          placement="top-start"
                          arrow
                        >
                          <Iconify icon="clarity:info-solid" />
                        </Tooltip>

                        <Typography variant="subtitle2">{ternak?.noFID}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      ml: 'auto',
                      mt: 'auto',
                    }}
                    onClick={() => {
                      openSapihModal.onTrue();
                      setSelectedKelahiran(data);
                    }}
                  >
                    Sapih
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))
        ) : (
          <Card
            sx={{
              width: '100%',
              height: '200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Tidak Ada Data Kelahiran
          </Card>
        )} */}
      </Grid>
      {openModal1.value && (
        <AddKelahiranModal
          open={openModal1.value}
          onClose={openModal1.onFalse}
          // selectedData={selectedData}
          // setSelectedData={setSelectedData}
          type={type}
          setType={setType}
          perkawinanData={data}
          handleNext={handleNext}
        />
      )}
      {openModal2.value && (
        <AddKelahiran2Modal
          open={openModal2.value}
          onClose={openModal2.onFalse}
          type={type}
          setType={setType}
          perkawinanData={data}
          formData={formData}
          refetch={fetchData}
        />
      )}
      {openSapihModal.value && (
        <AddSapihModal
          open={openSapihModal.value}
          onClose={openSapihModal.onFalse}
          selectedData={selectedKelahiran}
        />
      )}
    </Container>
  );
}
