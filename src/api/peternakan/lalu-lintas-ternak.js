import pb from 'src/utils/pocketbase';
import { useState } from 'react';

export function useGetLaluLintasTernak() {
  const [dataLaluLintasTernak, setDataLaluLintasTernak] = useState({
    data: [],
    error: null,
    empty: true,
    totalData: 0,
  });
  const [loadingLaluLintasTernak, setLoadingLaluLintasTernak] = useState(true);
  const [fullDataLaluLintasTernak, setFullDataLaluLintasTernak] = useState([]);

  const getLaluLintasTernak = async (
    page = 1,
    perPage = 5,
    filter = '',
    sort = '-created',
    expand = 'kandang, ternak'
  ) => {
    setDataLaluLintasTernak({
      data: [],
      error: null,
      empty: true,
      totalData: 0,
    });

    setLoadingLaluLintasTernak(true);

    try {
      const data = await pb.collection('laluLintasTernak').getList(page, perPage, {
        filter: filter,
        sort: sort,
        expand: expand,
      });

      setFullDataLaluLintasTernak(data.totalItems);

      setDataLaluLintasTernak({
        data: data.items,
        error: null,
        empty: data.items.length,
        totalData: data.totalItems,
      });

      setLoadingLaluLintasTernak(false);
    } catch (error) {
      console.log(error);
      setLoadingLaluLintasTernak(false);
    }
  };

  return {
    ...dataLaluLintasTernak,
    loadingLaluLintasTernak,
    getLaluLintasTernak,
    fullDataLaluLintasTernak,
  };
}
