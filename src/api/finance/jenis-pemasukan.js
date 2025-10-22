import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetJenisPemasukan() {


    const [dataJenisPemasukan, setDataJenisPemasukan] = useState([]);
    const [loadingTernak, setLoadingTernak] = useState(true);

    const getJenisPemasukan = async () => {
        try {
            setLoadingTernak(true);
            const response = await pb.collection('listJenisPemasukan').getFullList();

            setDataJenisPemasukan(response);
        } catch (error) {

        } finally {
            setLoadingTernak(false);
        }
    };


    return {
        dataJenisPemasukan,
        loadingTernak,
        getJenisPemasukan,
    };
}