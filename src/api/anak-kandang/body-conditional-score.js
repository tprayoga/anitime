import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useGetBodyConditionalScore() {

    const [dataBCS, setDataBCS] = useState([]);

    const getBCS = async () => {
        try {
            const response = await pb.collection('listBCS').getFullList();
            setDataBCS(response);

        } catch (error) {

        } finally {

        }
    };

    // useEffect(() => {
    //     getBodyConditionalScore();
    // }, [])

    return {
        dataBCS,
        getBCS,
    };
}