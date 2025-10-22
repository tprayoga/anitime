import { useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetTernak() {

    const [dataTernak, setDataTernak] = useState({
        data: [],
        error: null,
        empty: true,
        totalData: 0,
    });
    const [loadingTernak, setLoadingTernak] = useState(true);

    const getTernak = async (page = 1, perPage = 5, filter = '', sort = '-created') => {
        try {
            setLoadingTernak(true);
            const data = await pb.collection('ternak').getList(page, perPage, {
                filter: filter,
                sort : sort,
                expand: 'kandang'
            });

            setDataTernak({
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
        ...dataTernak,
        loadingTernak,
        getTernak,
    };
}

export function useCreateTernak() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const createTernak = async (data) => {

        try {
            
            setIsSubmitting(true);
            const response = await pb.collection('ternak').create(data);

            return response;
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        createTernak,
        isSubmitting,
        isError
    }
}

export function useUpdateTernak() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const updateTernak = async (id, data) => {

        try {
            setIsSubmitting(true);

            await pb.collection('ternak').update(id, data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        updateTernak,
        isSubmitting,
        isError
    }
}

export function useFindTernak() {

    const [data, setData] = useState(null);
    const [loadingTernak, setLoadingTernak] = useState(true);

    const findTernak = async (id) => {
        try {
            setLoadingTernak(true);
            const data = await pb.collection('ternak').getOne(id);

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
        findTernak,
    };
}

export function useDeleteTernak() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const deleteTernak = async (id) => {

        try {

            setIsSubmitting(true);
            const response = await pb.collection('ternak').delete(id);

            // return response;
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        deleteTernak,
        isSubmitting
    }
}

