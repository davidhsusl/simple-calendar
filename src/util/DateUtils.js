import moment from 'moment';

export default class DateUtils {

  /**
   * 將傳入日期轉 {@link moment}
   *
   * @param value 參數可以是 string、array、moment
   * @return {*}
   */
  static toMoment(value) {
    if(!value) {
      return value;
    }

    if(value instanceof Array) {
      const date = value.map((val, i) => {
        if(i === 1) { // 月份從 0 開始
          return val - 1;
        } else if(i === 6) { // 轉成毫秒
          return val / 1000000;
        }
        return val;
      });
      return moment(date);
    }

    return value._isAMomentObject ? value: moment(value);
  }

  /**
   * 將傳入日期轉民國年
   *
   * @param value
   * @return {string}
   */
  static toMinguoDate(value) {
    if(typeof value !== "string") {
      throw "this method only support string input";
    }

    const year = "" + (parseInt(value.substring(0, 4)) - 1911);
    const pad = "000";
    const yearPad = pad.substring(0, pad.length - year.length) + year;

    return yearPad + value.substring(4);
  }

  /**
   * 將傳入日期轉西元年
   *
   * @param value
   * @return {string}
   */
  static toAnnoDomini(value) {
    if(typeof value !== "string") {
      throw "this method only support string input";
    }

    return (parseInt(value.substring(0, 3)) + 1911) + value.substring(3);
  }
}