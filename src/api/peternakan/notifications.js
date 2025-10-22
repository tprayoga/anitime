import useSWR from 'swr';
import { useMemo, useState } from 'react';
// utils
import axios, { fetcher, endpoints } from 'src/utils/axios';
import pb from 'src/utils/pocketbase';

const endpoint = '/notifications/records';

export function useGetNotifications() {
  const URL = endpoint;
  const [data, mutate] = useState({
    data: [],
    loading: true,
    error: null,
    empty: false,
    totalData: 0,
  });

  const refetch = async (page = 1, perPage = 5, filter = '', sort = '-created', expand = '') => {
    try {
      const data = await pb.collection('notifications').getList(page, perPage, {
        filter: filter,
        sort: sort,
        expand: expand,
      });

      const { items, ...detail } = data;
      mutate({
        data: data?.items || [],
        loading: false,
        error: null,
        empty: !data?.items.length,
        totalData: data?.totalItems,
        ...detail,
      });
    } catch (error) {
      mutate({
        data: [],
        loading: false,
        error: error,
        empty: true,
        totalData: 0,
      });
    }
  };

  return useMemo(
    () => ({
      ...data,
      refetch,
    }),
    [data]
  );

  // const { data, isLoading, error, isValidating, mutate } = useSWR(
  //   `${URL}?perPage=${perPage}&page=1&expand=scheduler&sort=-created`,
  //   fetcher
  // );

  // const memoizedValue = useMemo(
  //   () => ({
  //     notifications: data?.items || [],
  //     postsLoading: isLoading,
  //     postsError: error,
  //     postsValidating: isValidating,
  //     postsEmpty: !isLoading && !data?.items.length,
  //     totalData: data?.totalItems,
  //     mutate,
  //   }),
  //   [data?.items, error, isLoading, isValidating]
  // );

  // return memoizedValue;
}

export async function useCreateNotfication(body) {
  const URL = endpoint;

  try {
    const res = await axios.post(URL, body);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function useEditNotfication(id, body) {
  const URL = `${endpoint}/${id}`;

  try {
    const res = await axios.patch(URL, body);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function useDeleteNotfication(id) {
  const URL = `${endpoint}/${id}`;

  try {
    const res = await axios.delete(URL);
    return res;
  } catch (error) {
    throw error;
  }
}
