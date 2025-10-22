import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';
import pb from 'src/utils/pocketbase';

export function useGetKandang() {

    const [dataKandang, setDataKandang] = useState({
        data: [],
        error: null,
        empty: true,
        totalData: 0,
    });
    const [loadingKandang, setLoadingKandang] = useState(true);

    const getKandang = async (page = 1, perPage = 5, filter = '', sort = '-created') => {

        try {
            setLoadingKandang(true);
            const data = await pb.collection('kandang').getList(page, perPage, {
                filter: filter,
                sort : sort,
                // expand: 'ternak'
            });

            setDataKandang({
                data: data.items,
                error: null,
                empty: data.items.length,
                totalData: data.totalItems,
            });

            setLoadingKandang(false);
        } catch (error) {

        } finally {
            setLoadingKandang(false);

        }
    };

    const getFullKandang = async () => {

        try {
            setLoadingKandang(true);
            const data = await pb.collection('kandang').getFullList();

            setDataKandang({
                data: data,
                // error: null,
                // empty: data.items.length,
                // totalData: data.totalItems,
            });

            setLoadingKandang(false);
        } catch (error) {

        } finally {
            setLoadingKandang(false);

        }
    };
    return {
        ...dataKandang,
        loadingKandang,
        getKandang,
        getFullKandang
    };
}

export function useCreateKandang() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const createKandang = async (data) => {

        try {

            setIsSubmitting(true);
            const response = await pb.collection('kandang').create(data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        createKandang,
        isSubmitting,
        isError
    }
}

export function useUpdateKandang() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const updateKandang = async (id, data) => {

        try {
            setIsSubmitting(true);
            await pb.collection('kandang').update(id, data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        updateKandang,
        isSubmitting,
        isError
    }
}

export function useFindKandang() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const findKandang = async (id) => {


        try {
            setIsSubmitting(true);
            await pb.collection('kandang').getOne(id);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        findKandang,
        isSubmitting,
        isError
    }
}