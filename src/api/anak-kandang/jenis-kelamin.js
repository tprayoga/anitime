import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetJenisKelamin() {

    const [dataJenisKelamin, setDataJenisKelamin] = useState([]);

    const getJenisKelamin = async () => {
        try {
            const response = await pb.collection('listJenisKelamin').getFullList();
            setDataJenisKelamin(response);

        } catch (error) {

        } finally {

        }
    };

    // useEffect(() => {
    //     getJenisKelamin();
    // }, [])

    return {
        dataJenisKelamin,
        getJenisKelamin,
    };
}