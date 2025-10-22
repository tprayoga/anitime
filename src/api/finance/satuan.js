import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetSatuan() {


    const [dataSatuan, setDataSatuan] = useState([]);
    const [loadingTernak, setLoadingTernak] = useState(true);

    const getSatuan = async () => {
        try {
            setLoadingTernak(true);
            const response = await pb.collection('listSatuan').getFullList();

            setDataSatuan(response);
        } catch (error) {

        } finally {
            setLoadingTernak(false);
        }
    };


    return {
        dataSatuan,
        loadingTernak,
        getSatuan,
    };
}