import pb from 'src/utils/pocketbase';

export default async function useCreateData(collection, data) {
  try {
    const res = await pb.collection(collection).create(data);
    return res;
  } catch (error) {
    throw error;
  }
}
