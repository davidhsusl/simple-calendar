export default class NumberUtils {

  static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * 將數字轉換成帶有,的格式
   * @param n
   */
  static numberWithCommas(n) {
    n = n.toString();
    const pattern = /(-?\d+)(\d{3})/;
    while(pattern.test(n)) {
      n = n.replace(pattern, '$1,$2');
    }
    return n;
  }

}