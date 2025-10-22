import { useEffect, useState } from "react";
import pb from 'src/utils/pocketbase';

export function useCreateCatatanWelfare() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const createCatatanWelfare = async (data) => {

        try {

            setIsSubmitting(true);
            const response = await pb.collection('catatanWelfareTernak').create(data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        createCatatanWelfare,
        isSubmitting,
        isError
    }
}