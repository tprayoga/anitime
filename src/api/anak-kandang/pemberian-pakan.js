import { useState } from "react";
import pb from 'src/utils/pocketbase';


export function useCreatePemberianPakan() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const createPemberianPakan = async (data) => {

        try {

            setIsSubmitting(true);
            const response = await pb.collection('pemberianPakanTernak').create(data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        createPemberianPakan,
        isSubmitting,
        isError
    }
}