// export function CalculatePrice(berat) {
//   // Tentukan harga awal dan berat awal
//   let hargaAwal = 25000000;
//   let beratAwal = 500;

//   // Hitung harga berdasarkan range berat
//   while (berat > beratAwal + 20) {
//     hargaAwal++; // Setiap kenaikan 20 kg, tambahkan harga 1
//     beratAwal += 20; // Naikkan batas berat
//   }

//   return hargaAwal;
// }

export function CalculatePrice(berat) {
  const pricePerKg = 52000;
  const totalBerat = parseInt(berat);

  const total = totalBerat * pricePerKg;
  return total;
}
