import PocketBase from 'pocketbase';
import { endpoints } from 'src/utils/axios';

const URL = process.env.NEXT_PUBLIC_DATABASE_DOMBA_API;

const pbDomba = new PocketBase(URL);
pbDomba.autoCancellation(false);

export default pbDomba;
