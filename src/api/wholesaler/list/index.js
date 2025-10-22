import { useEffect, useMemo, useState } from 'react';
import pb from 'src/utils/pocketbase';

export default function useListData(collection, page = 1, perPage = 10, options = {}) {
  const [data, setData] = useState({
    data: [],
    total: null,
    loading: true,
    error: null,
    empty: false,
    error: null,
  });

  const refetch = async (collection, page = 1, perPage = 10, options = {}) => {
    setData((prev) => ({ ...prev, loading: true }));
    try {
      const res = await pb.collection(collection).getList(page, perPage, options);

      const { items, ...other } = res;

      setData({
        data: items || [],
        total: other,
        loading: false,
        error: null,
        empty: res.length === 0,
      });
    } catch (error) {
      setData({
        data: [],
        total: null,
        loading: false,
        error: error,
        empty: true,
      });
      //   throw new Error(error);
    }
  };

  useEffect(() => {
    if (collection) {
      refetch(collection, page, perPage, options);
    }
  }, [collection]);

  const memorizedData = useMemo(() => {
    return {
      ...data,
      refetch,
    };
  }, [data, refetch]);

  return memorizedData;
}
