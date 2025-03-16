const fn = (n) => {
  let x = [0, 1];

  for (let i = 2; i < n; i++) {
    x.push(x[i - 1] + x[i - 2]);
  }

  return x;
};

const jumlahAngka = 15;
console.log(fn(jumlahAngka));
