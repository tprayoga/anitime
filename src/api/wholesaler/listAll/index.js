import { useEffect, useMemo, useState } from 'react';
import pb from 'src/utils/pocketbase';

export default function useListAllData(
  collection,
  options = {
    sort: '-created',
  }
) {
  const [data, setData] = useState({
    data: [],
    total: null,
    loading: true,
    error: null,
    empty: false,
    error: null,
  });

  const refetch = async (
    collection,
    options = {
      sort: '-created',
    }
  ) => {
    setData((prev) => ({ ...prev, loading: true }));
    try {
      const res = await pb.collection(collection).getFullList({
        ...options,
        created: '-created',
      });

      setData({
        data: res || [],
        total: res.length,
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
      refetch(collection, options);
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
