import { useEffect, useMemo, useState } from 'react';
import pb from 'src/utils/pocketbase';

export default function useGetOne(collection, collectionId, options = {}) {
  const [data, setData] = useState({
    data: null,
    total: null,
    loading: true,
    error: null,
    empty: false,
    error: null,
  });

  const refetch = async (collection, collectionId, options = {}) => {
    setData((prev) => ({ ...prev, loading: true }));
    try {
      const res = await pb.collection(collection).getOne(collectionId, {
        sort: '-created',
        ...options,
      });

      setData({
        data: res || null,
        loading: false,
        error: null,
        empty: res.length === 0,
      });
    } catch (error) {
      setData({
        data: null,
        loading: false,
        error: error,
        empty: true,
      });
    }
  };

  useEffect(() => {
    if (collection) {
      refetch(collection, collectionId, options);
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
