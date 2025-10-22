import { useState } from 'react';
import pbDomba from 'src/utils/pocketbase-domba';

export function useGetData() {
  const [dataDB, setDataDB] = useState({
    data: [],
    error: null,
    empty: true,
    totalData: 0,
  });
  const [loading, setLoading] = useState(true);

  const getData = async (
    page = 1,
    perPage = 5,
    filter = '',
    sort = '-created',
    collectionName,
    expand = ''
  ) => {
    try {
      setLoading(true);
      const data = await pbDomba.collection(collectionName).getList(page, perPage, {
        filter: filter,
        sort: sort,
        expand: expand,
      });

      setDataDB({
        data: data.items,
        error: null,
        empty: data.items.length,
        totalData: data.totalItems,
      });

      return data;
    } catch (error) {
      setDataDB({
        data: [],
        totalData: null,
        error: error,
        empty: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    ...dataDB,
    loading,
    getData,
  };
}

export function useGetFulLData() {
  const [dataDB, setDataDB] = useState({
    data: [],
    error: null,
    empty: true,
    totalData: 0,
  });
  const [loading, setLoading] = useState(true);

  const getFullData = async (collectionName, expand = '', filter = '') => {
    try {
      setLoading(true);

      const response = await pbDomba.collection(collectionName).getFullList({
        expand: expand,
        filter: filter,
      });

      setDataDB({
        data: response,
        error: null,
        empty: response.length === 0,
        totalData: response.length,
      });

      return response;
    } catch (error) {
      setDataDB({
        data: [],
        totalData: null,
        error: error,
        empty: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    ...dataDB,
    loading,
    getFullData,
  };
}

export function useGetOneData() {
  const [dataDB, setDataDB] = useState({
    data: null,
    error: null,
  });

  const [loading, setLoading] = useState(true);

  const getOneData = async (id, collectionName, expand, filter) => {
    try {
      setLoading(true);
      const response = await pbDomba.collection(collectionName).getOne(id, {
        expand: expand,
        filter: filter,
      });

      setDataDB({
        data: response,
        error: null,
      });

      return response;
    } catch (error) {
      setDataDB({
        data: null,
        error: error,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    ...dataDB,
    loading,
    getOneData,
  };
}

export function useGetFirstListItem() {
  const [dataDB, setDataDB] = useState({
    data: null,
    error: null,
  });

  const [loading, setLoading] = useState(true);

  const getFirstListItem = async (collectionName, filter, expand) => {
    try {
      setLoading(true);
      const response = await pbDomba.collection(collectionName).getFirstListItem(filter, {
        expand: expand,
      });

      setDataDB({
        data: response,
        error: null,
      });
    } catch (error) {
      setDataDB({
        data: null,
        error: error,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    ...dataDB,
    loading,
    getFirstListItem,
  };
}

export function useCreateData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createData = async (data, collectionName) => {
    try {
      setLoading(true);
      const response = await pbDomba.collection(collectionName).create(data);
      return response;
    } catch (error) {
      setError(error);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    createData,
    error,
    loading,
  };
}

export function useUpdateData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (id, data, collectionName) => {
    try {
      setLoading(true);
      await pbDomba.collection(collectionName).update(id, data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateData,
    loading,
    error,
  };
}

export function useUpdateFilesData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateDataFile = async (id, data, collectionName, previousFiles) => {
    try {
      setLoading(true);
      await pbDomba.collection(collectionName).update(id, {
        ...data,
        'fotoGejala-': previousFiles,
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateDataFile,
    loading,
    error,
  };
}

export function useDeleteData() {
  const deleteData = async (id, collectionName) => {
    try {
      const response = await pbDomba.collection(collectionName).delete(id);

      return response;
    } catch (error) {
      return {
        code: 400,
        message:
          'Failed to delete record. Make sure that the record is not part of a required relation reference.',
        data: {},
      };
    }
  };

  return {
    deleteData,
  };
}
