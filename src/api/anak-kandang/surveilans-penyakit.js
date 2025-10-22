import { useState } from "react";
import pb from 'src/utils/pocketbase';


export function useCreateSurveilansPenyakit() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isError, setIsError] = useState(null);

    const createSurveilansPenyakit = async (data) => {

        try {

            setIsSubmitting(true);
            const response = await pb.collection('surveilansTernak').create(data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        createSurveilansPenyakit,
        isSubmitting,
        isError
    }
}