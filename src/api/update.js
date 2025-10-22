import pb from 'src/utils/pocketbase';

export default async function useUpdateData(collection, collectionId, data) {
  try {
    const res = await pb.collection(collection).update(collectionId, data);
    return res;
  } catch (error) {
    throw error;
  }
}
