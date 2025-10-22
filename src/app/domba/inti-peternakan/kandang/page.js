import { KandangView } from 'src/sections/domba/peternakan/kandang/view';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ani-domba-pocketbase.bodha.co.id');

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Anitime: Kandang',
};

export async function getServerKandang() {
  const res = await pb.collection('kandang').getFullList({
    sort: '-created',
  });
  const kandang = await res.json();

  return { props: { kandang } };
}

export default function KandangPage({ kandang }) {
  return <KandangView data={kandang} />;
}
