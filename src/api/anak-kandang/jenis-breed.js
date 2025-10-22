import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetJenisBreed() {

    const [dataJenisBreed, setDataJenisBreed] = useState([]);

    const getJenisBreed = async () => {
        try {
            const response = await pb.collection('listBreedHewan').getFullList();
            setDataJenisBreed(response);

        } catch (error) {

        } finally {

        }
    };

    // useEffect(() => {
    //     getJenisBreed();
    // }, [])

    return {
        dataJenisBreed,
        getJenisBreed,
    };
}