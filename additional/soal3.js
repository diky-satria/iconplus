const cek_angka = (data) => {
  return data.filter((item) => !isNaN(item) && item !== " ").length;
};

console.log(cek_angka(["b", "7", "h", "6", "h", "k", "i", "5", "g", "7", "8"]));
console.log(cek_angka(["7", "b", "8", "5", "6", "9", "n", "f", "y", "6", "9"]));
console.log(cek_angka(["u", "h", "b", "n", "7", "6", "5", "1", "g", "7", "9"]));
