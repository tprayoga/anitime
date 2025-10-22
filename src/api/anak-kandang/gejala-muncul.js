import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetGejalaMuncul() {

    const [gejalaMuncul, setGejalaMuncul] = useState([]);

    const getGejalaMuncul = async () => {
        try {
            const response = await pb.collection('listGejalaMuncul').getFullList();
            setGejalaMuncul(response);

        } catch (error) {

        } finally {

        }
    };

    // useEffect(() => {
    //     getGejalaMuncul();
    // }, [])

    return {
        gejalaMuncul,
        getGejalaMuncul,
    };
}