import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetJenisPengeluaran() {


    const [dataJenisPengeluaran, setDataJenisPengeluaran] = useState([]);
    const [loadingTernak, setLoadingTernak] = useState(true);

    const getJenisPengeluaran = async () => {
        try {
            setLoadingTernak(true);
            const response = await pb.collection('listJenisPengeluaran').getFullList();

            setDataJenisPengeluaran(response);
        } catch (error) {

        } finally {
            setLoadingTernak(false);
        }
    };


    return {
        dataJenisPengeluaran,
        loadingTernak,
        getJenisPengeluaran,
    };
}