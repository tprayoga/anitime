export function formatToRupiah(num) {
  // Menggunakan method toLocaleString untuk mengatur format sebagai mata uang Rupiah
  return num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

export function rupiahToInteger(rupiah) {
  var cleanRupiah = rupiah.replace(/[^\d]/g, '');

  var integer = parseInt(cleanRupiah);

  return integer;
}
