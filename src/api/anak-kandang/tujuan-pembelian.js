import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetTujuanPembelian() {


    const [dataTujuanPembelian, setdataTujuanPembelian] = useState([]);
    const [loadingTernak, setLoadingTernak] = useState(true);

    const getTujuanPembelian = async () => {
        try {
            setLoadingTernak(true);
            const response = await pb.collection('listTujuanPembelian').getFullList();
            setdataTujuanPembelian(response);
        } catch (error) {

        } finally {
            setLoadingTernak(false);

        }
    };

    // useEffect(() => {
    //     getTujuanPembelian();
    // }, [])

    return {
        dataTujuanPembelian,
        loadingTernak,
        getTujuanPembelian,
    };
}