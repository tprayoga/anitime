import { useEffect, useMemo, useState } from 'react';
import pb from 'src/utils/pocketbase';

export default async function useDeleteData(collection, recordId) {
  try {
    const res = await pb.collection(collection).delete(recordId);
    return res;
  } catch (error) {
    throw error;
  }
}
