import pb from 'src/utils/pocketbase-domba';
import { useEffect, useState } from 'react';
import { set } from 'lodash';
import axios from 'axios';

const URL = `${process.env.NEXT_PUBLIC_DATABASE_DOMBA_API}/api/collections/users/records`;

export function useGetUser() {
  const [dataUser, setDataUser] = useState({
    data: [],
    error: null,
    empty: true,
    totalData: 0,
  });
  const [loadingUser, setLoadingUser] = useState(false);
  const [detailDataUser, setDetailDataUser] = useState({});
  const [loadingDetailUser, setLoadingDetailUser] = useState(false);

  const getUser = async (page = 1, perPage = 5, filter = '', sort = '-created', token) => {
    setDataUser({
      data: [],
      error: null,
      empty: true,
      totalData: 0,
    });

    setLoadingUser(true);

    try {
      const data = await pb.collection('users').getList(page, perPage, {
        filter: filter,
        sort: sort,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataUser({
        data: data.items,
        error: null,
        empty: data.items.length,
        totalData: data.totalItems,
      });

      setLoadingUser(false);
    } catch (error) {
      setLoadingUser(false);
      throw new Error(error);
    }
  };

  const getDetailUser = async (id = '', token = '') => {
    setLoadingDetailUser(true);

    try {
      const { data } = await axios.get(`${URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDetailDataUser(data);

      setLoadingDetailUser(false);
    } catch (error) {
      setLoadingDetailUser(false);
      throw new Error(error);
    }
  };

  return {
    ...dataUser,
    loadingUser,
    getUser,
    loadingDetailUser,
    getDetailUser,
    detailDataUser,
  };
}

export function useCreateUser() {
  const [loadingUser, setLoadingUser] = useState(false);
  const [dataUser, setDataUser] = useState([]);

  const createUser = async (collection = 'users', payload = '') => {
    setLoadingUser(true);

    try {
      const data = await pb.collection(collection).create(payload);
      // const data = await axios.post(URL, payload);

      setLoadingUser(false);

      setDataUser(data);
    } catch (error) {
      setLoadingUser(false);
      throw error?.data?.data;
    }
  };

  return {
    dataUser,
    loadingUser,
    createUser,
  };
}

export function useEditUser() {
  const [loadingUser, setLoadingUser] = useState(false);
  const [dataUser, setDataUser] = useState([]);

  const editUser = async (id = '', body, token) => {
    setLoadingUser(true);

    try {
      const { data } = await axios.patch(`${URL}/${id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoadingUser(false);

      setDataUser(data);
    } catch (error) {
      setLoadingUser(false);
      throw error?.response?.data?.data;
    }
  };

  return {
    dataUser,
    loadingUser,
    editUser,
  };
}

export function useDeleteUser() {
  const [loadingUser, setLoadingUser] = useState(false);
  const [dataUser, setDataUser] = useState([]);

  const deleteUser = async (id = '', token) => {
    setLoadingUser(true);

    try {
      const { data } = await axios.delete(`${URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoadingUser(false);

      setDataUser(data);
    } catch (error) {
      setLoadingUser(false);
      throw new Error(error);
    }
  };

  return {
    dataUser,
    loadingUser,
    deleteUser,
  };
}
