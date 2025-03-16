const saham = (harga) => {
  let min_harga = harga[0];
  let harga_beli = harga[0];
  let profit_tinggi = 0;

  for (let i = 1; i < harga.length; i++) {
    let profit = harga[i] - min_harga;

    if (profit > profit_tinggi) {
      profit_tinggi = profit;
      harga_beli = min_harga;
    }

    if (harga[i] < min_harga) {
      min_harga = harga[i];
    }
  }

  return harga_beli;
};

console.log(saham([7, 8, 3, 10, 8]));
console.log(saham([5, 12, 11, 12, 10]));
console.log(saham([7, 18, 27, 10, 29]));
console.log(saham([20, 17, 15, 14, 10]));
