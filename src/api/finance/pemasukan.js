import { useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetPemasukan() {

    const [dataPemasukan, setDataPemasukan] = useState({
        data: [],
        error: null,
        empty: true,
        totalData: 0,
    });
    const [loadingPemasukan, setLoadingPemasukan] = useState(false);

    const getPemasukan = async (page = 1, perPage = 5, filter = '', sort = '-created') => {

        try {
            setLoadingPemasukan(true);
            const data = await pb.collection('pemasukan').getList(page, perPage, {
                filter: filter,
                sort : sort,
            });

            setDataPemasukan({
                data: data.items,
                error: null,
                empty: data.items.length,
                totalData: data.totalItems,
            });

            setLoadingPemasukan(false);
        } catch (error) {

        } finally {
            setLoadingPemasukan(false);

        }
    };


    return {
        ...dataPemasukan,
        loadingPemasukan,
        getPemasukan,
        // getFullKandang
    };
}

export function useCreatePemasukan() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const createPemasukan = async (data) => {

        try {

            setIsSubmitting(true);
            const response = await pb.collection('pemasukan').create(data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        createPemasukan,
        isSubmitting,
        isError
    }
}