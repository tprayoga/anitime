import { useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetPengeluaran() {

    const [dataPengeluaran, setDataPengeluaran] = useState({
        data: [],
        error: null,
        empty: true,
        totalData: 0,
    });
    const [loadingPengeluaran, setLoadingPengeluaran] = useState(false);

    const getPengeluaran = async (page = 1, perPage = 5, filter = '', sort = '-created') => {

        try {
            setLoadingPengeluaran(true);
            const data = await pb.collection('pengeluaran').getList(page, perPage, {
                filter: filter,
                sort : sort,
            });

            setDataPengeluaran({
                data: data.items,
                error: null,
                empty: data.items.length,
                totalData: data.totalItems,
            });

            setLoadingPengeluaran(false);
        } catch (error) {

        } finally {
            setLoadingPengeluaran(false);
        }
    };


    return {
        ...dataPengeluaran,
        loadingPengeluaran,
        getPengeluaran,
        // getFullKandang
    };
}

export function useCreatePengeluaran() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const createPengeluaran = async (data) => {

        try {

            setIsSubmitting(true);
            const response = await pb.collection('pengeluaran').create(data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        createPengeluaran,
        isSubmitting,
        isError
    }
}