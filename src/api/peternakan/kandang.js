import pb from 'src/utils/pocketbase';
import { useEffect, useState } from 'react';

export function useGetKandang() {
  const [dataKandang, setDataKandang] = useState({
    data: [],
    error: null,
    empty: true,
    totalData: 0,
  });
  const [loadingKandang, setLoadingKandang] = useState(true);
  const [fullDataKandang, setFullDataKandang] = useState([]);
  const [detailDataKandang, setDetailDataKandang] = useState({});
  const [loadingDetailKandang, setLoadingDetailKandang] = useState(true);

  const getKandang = async (page = 1, perPage = 5, filter = '', sort = '-created') => {
    setDataKandang({
      data: [],
      error: null,
      empty: true,
      totalData: 0,
    });

    setLoadingKandang(true);

    try {
      const data = await pb.collection('kandang').getList(page, perPage, {
        filter: filter,
        sort: sort,
      });

      setDataKandang({
        data: data.items,
        error: null,
        empty: data.items.length,
        totalData: data.totalItems,
      });

      setLoadingKandang(false);
    } catch (error) {
      console.log(error);
      setLoadingKandang(false);
    }
  };

  const getFullKandang = async (filter) => {
    try {
      const records = await pb.collection('kandang').getFullList({
        filter: filter,
      });

      setFullDataKandang(records);
    } catch (error) {
      console.log(error);
    }
  };

  const getDetailKandang = async (id = '') => {
    setLoadingDetailKandang(true);

    try {
      const data = await pb.collection('kandang').getOne(id);

      setDetailDataKandang(data);

      setLoadingDetailKandang(false);
    } catch (error) {
      console.log(error);
      setLoadingDetailKandang(false);
    }
  };

  return {
    ...dataKandang,
    loadingKandang,
    getKandang,
    getFullKandang,
    fullDataKandang,
    getDetailKandang,
    detailDataKandang,
  };
}
