export function randomInv(length = 15) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = 'INV-';
  for (let i = 0; i < length - 4; i++) {
    // Subtracting 4 to account for 'INV-' prefix
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
}
