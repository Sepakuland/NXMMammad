
export const toFixedWithoutZeros = (num, precision) =>
    num.toFixed(precision).replace(/\.0+$/, '');
