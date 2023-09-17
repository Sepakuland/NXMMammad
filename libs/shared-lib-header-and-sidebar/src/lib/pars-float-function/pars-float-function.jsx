export function parsFloatFunction(str, val) {

  str = str.toString();
  str = str.includes('.') ? str.slice(0, (str.indexOf(".")) + val + 1) : str;
  return Number(str);
}