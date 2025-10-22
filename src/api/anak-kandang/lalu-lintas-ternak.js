import { useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetLaluLintasTernak() {

    const [dataLaluLintasTernak, setDataLaluLintasTernak] = useState({
        data: [],
        error: null,
        empty: true,
        totalData: 0,
    });
    
    const [loadingTernak, setLoadingTernak] = useState(true);

    const getLaluLintasTernak = async (page = 1, perPage = 5, filter = '', sort = '-created') => {
        try {
            setLoadingTernak(true);
            const data = await pb.collection('laluLintasTernak').getList(page, perPage, {
                filter: filter,
                sort : sort,
                expand : 'kandang, ternak'
            });

            setDataLaluLintasTernak({
                data: data.items,
                error: null,
                empty: data.items.length,
                totalData: data.totalItems,
            });

            setLoadingTernak(false);
        } catch (error) {

        } finally {
            setLoadingTernak(false);

        }
    };

    return {
        ...dataLaluLintasTernak,
        loadingTernak,
        getLaluLintasTernak,
    };
}

export function useCreateLaluLintasTernak() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const createLaluLintasTernak = async (data) => {

        try {

            setIsSubmitting(true);
            const response = await pb.collection('laluLintasTernak').create(data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        createLaluLintasTernak,
        isSubmitting,
        isError
    }
}

export function useFindLaluLintasTernak() {

    const [data, setData] = useState(null);
    const [loadingTernak, setLoadingTernak] = useState(true);

    const findLaluLintasTernak = async (id) => {
        try {
            setLoadingTernak(true);
            const data = await pb.collection('laluLintasTernak').getOne(id,{
                expand: 'ternak, kandang',
            });

            setData(data);

            setLoadingTernak(false);
        } catch (error) {

        } finally {
            setLoadingTernak(false);

        }
    };

    return {
        data,
        loadingTernak,
        findLaluLintasTernak,
    };
}