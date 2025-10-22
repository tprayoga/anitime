import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetJenisPakan() {

    const [dataJenisPakan, setdataJenisPakan] = useState([]);

    const getJenisPakan = async () => {
        try {
            const response = await pb.collection('listJenisPakan').getFullList();
            setdataJenisPakan(response);

        } catch (error) {

        } finally {

        }
    };

    // useEffect(() => {
    //     getJenisKelamin();
    // }, [])

    return {
        dataJenisPakan,
        getJenisPakan,
    };
}