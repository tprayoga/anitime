import pb from 'src/utils/pocketbase';
import { useState } from 'react';

export function useGetTernak() {
  const [dataTernak, setDataTernak] = useState({
    data: [],
    error: null,
    empty: true,
    totalData: 0,
  });
  const [loadingTernak, setLoadingTernak] = useState(true);
  const [fullDataTernak, setFullDataTernak] = useState([]);

  const getTernak = async (
    page = 1,
    perPage = 5,
    filter = '',
    sort = '-created',
    expand = 'kandang'
  ) => {
    setDataTernak({
      ...dataTernak,
      error: null,
      empty: true,
    });

    setLoadingTernak(true);

    try {
      const data = await pb.collection('ternak').getList(page, perPage, {
        filter: filter,
        sort: sort,
        expand: expand,
      });

      setFullDataTernak(data.totalItems);

      setDataTernak({
        data: data.items,
        error: null,
        empty: data.items.length,
        totalData: data.totalItems,
      });

      setLoadingTernak(false);
    } catch (error) {
      console.log(error);
      setLoadingTernak(false);
    }
  };

  return {
    ...dataTernak,
    loadingTernak,
    getTernak,
    fullDataTernak,
  };
}
