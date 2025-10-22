import PocketBase from 'pocketbase';
import { endpoints } from 'src/utils/axios';

const URL = process.env.NEXT_PUBLIC_DATABASE_API;

const pb = new PocketBase(URL);
pb.autoCancellation(false);

export default pb;
