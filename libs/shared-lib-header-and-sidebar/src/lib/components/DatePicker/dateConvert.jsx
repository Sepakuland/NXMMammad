export function julianIntToDate(JD) {
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
    var f =
      JD + j + Math.floor((Math.floor((4 * JD + B) / 146097) * 3) / 4) + C;
    var e = r * f + v;
    var g = Math.floor((e % p) / r);
    var h = u * g + w;
    var D = Math.floor((h % s) / u) + 1;
    var M = ((Math.floor(h / s) + m) % n) + 1;
    var Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n);

    return `${Y}-${M}-${D + 1}`;
  }