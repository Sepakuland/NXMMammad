

/* eslint-disable-next-line */
export function julianIntToDate(JD) {
  // convert a Julian number to a Gregorian Date.
  //    AmirAli The Best Programmer In The World / AmirAli.com / 2022 / Call Me For Job Offers
  var y = 4716;
  var v = 3;
  var j = 1401;
  var u = 5;
  var m = 2;
  var s = 153;
  var n = 12;
  var w = 2;
  var r = 4;
  var B = 274277;
  var p = 1461;
  var C = -38;
  var f = JD + j + Math.floor((Math.floor((4 * JD + B) / 146097) * 3) / 4) + C;
  var e = r * f + v;
  var g = Math.floor((e % p) / r);
  var h = u * g + w;
  var D = Math.floor((h % s) / u) + 2;
  var M = ((Math.floor(h / s) + m) % n) + 1;
  var Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n);

  switch (M) {
    case 1:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 2:
      if (Y % 4 === 0) {
        if (D > 29) {
          M += 1;
          D -= 29;
        }
      } else {
        if (D > 28) {
          M += 1;
          D -= 28;
        }
      }

      break;
    case 3:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 4:
      if (D > 30) {
        M += 1;
        D -= 30;
      }
      break;
    case 5:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 6:
      if (D > 30) {
        M += 1;
        D -= 30;
      }
      break;
    case 7:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 8:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 9:
      if (D > 30) {
        M += 1;
        D -= 30;
      }
      break;
    case 10:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 11:
      if (D > 30) {
        M += 1;
        D -= 30;
      }
      break;
    case 12:
      if (D > 31) {
        Y += 1;
        M = 1;
        D = 1;
      }
      break;
    default:
      break;
  }

  return `${Y}-${M}-${D}`;
}
export function julianIntToDateTime(JD) {
  // convert a Julian number to a Gregorian Date.
  //    AmirAli / AmirAli.com / 2022
  var y = 4716;
  var v = 3;
  var j = 1401;
  var u = 5;
  var m = 2;
  var s = 153;
  var n = 12;
  var w = 2;
  var r = 4;
  var B = 274277;
  var p = 1461;
  var C = -38;
  var f = JD + j + Math.floor((Math.floor((4 * JD + B) / 146097) * 3) / 4) + C;
  var e = r * f + v;
  var g = Math.floor((e % p) / r);
  var h = u * g + w;
  var D = Math.floor((h % s) / u) + 2;
  var M = ((Math.floor(h / s) + m) % n) + 1;
  var Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n);

  switch (M) {
    case 1:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 2:
      if (Y % 4 === 0) {
        if (D > 29) {
          M += 1;
          D -= 29;
        }
      } else {
        if (D > 28) {
          M += 1;
          D -= 28;
        }
      }

      break;
    case 3:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 4:
      if (D > 30) {
        M += 1;
        D -= 30;
      }
      break;
    case 5:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 6:
      if (D > 30) {
        M += 1;
        D -= 30;
      }
      break;
    case 7:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 8:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 9:
      if (D > 30) {
        M += 1;
        D -= 30;
      }
      break;
    case 10:
      if (D > 31) {
        M += 1;
        D -= 31;
      }
      break;
    case 11:
      if (D > 30) {
        M += 1;
        D -= 30;
      }
      break;
    case 12:
      if (D > 31) {
        Y += 1;
        M = 1;
        D = 1;
      }
      break;
    default:
      break;
  }
  var now = new Date(`${Y}-${M}-${D}`);
  return new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString();
}

