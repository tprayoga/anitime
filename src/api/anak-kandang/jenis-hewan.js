import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetJenisHewan() {


    const [dataJenisHewan, setDataJenisHewan] = useState([]);
    const [loadingTernak, setLoadingTernak] = useState(true);

    const getJenisHewan = async () => {
        try {
            setLoadingTernak(true);
            const response = await pb.collection('listJenisHewan').getFullList();

            setDataJenisHewan(response);
        } catch (error) {

        } finally {
            setLoadingTernak(false);

        }
    };

    // useEffect(() => {
    //     getJenisHewan();
    // }, [])

    return {
        dataJenisHewan,
        loadingTernak,
        getJenisHewan,
    };
}