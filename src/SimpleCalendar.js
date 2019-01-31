import '../public/css/index.css';
import 'rc-time-picker/assets/index.css';
import Calendar from './Calendar';
import DatePicker from './Picker';
import zhTW from './locale/zh_TW';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import moment from 'moment';
import * as React from 'react';
import PropTypes from 'prop-types';
import {Overlay, Tooltip} from 'react-bootstrap';
import DateUtils from './util/DateUtils'
import NumberUtils from './util/NumberUtils'
import CalendarMsg from "./enum/CalendarMsg"

/**
 * 日期 Calendar
 *
 * @author David Hsu
 */
export default class SimpleCalendar extends React.Component {

  static DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
  static DEFAULT_TIME_FORMAT = 'HH:mm:ss';
  static DEFAULT_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  static DEFAULT_ISO_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

  constructor(props) {
    super(props);

    moment.fn.toJSON = function () {
      return this.format(SimpleCalendar.DEFAULT_ISO_DATE_TIME_FORMAT);
    };

    // 設定 split token 的 index
    this.dateTimeSplitIndex = this.props.showMinguoDate ? [3, 6, 9, 12, 15] : [4, 7, 10, 13, 16];

    // 設定 format
    let formatter;
    if (!this.props.disabledDate && !this.props.disabledTime) {
      formatter = this.props.formatter;
    } else if (this.props.disabledTime) {
      formatter = this.props.formatter === SimpleCalendar.DEFAULT_DATE_TIME_FORMAT ?
        SimpleCalendar.DEFAULT_DATE_FORMAT : this.props.formatter;
    } else if (this.props.disabledDate) {
      formatter = this.props.formatter === SimpleCalendar.DEFAULT_DATE_TIME_FORMAT ?
        SimpleCalendar.DEFAULT_TIME_FORMAT : this.props.formatter;
      this.dateTimeSplitIndex = [2, 5];
    }

    if(!this.props.disabledDate && this.props.showMinguoDate) {
      this.formatLength = formatter.length - 1;
      this.dateFinishedLength = (formatter.match(/[YMDHmsS]/g) || []).length - 1;
    } else {
      this.formatLength = formatter.length;
      this.dateFinishedLength = (formatter.match(/[YMDHmsS]/g) || []).length;
    }

    this.state = {
      [props.name]: '',
      show: false,
      formatInputString: this.formatInputString,
      formatter
    };
  }

  componentDidMount() {
    const date = DateUtils.toMoment(this.props.value);
    let dateFormated;
    if(!this.props.value) {
      dateFormated = this.formatInputString(this.state.formatter);
    } else {
      dateFormated = this.formatInputString(this.props.showMinguoDate ?
        DateUtils.toMinguoDate(date.format(this.state.formatter)) : date.format(this.state.formatter));
    }
    this.setState({[this.props.name]: dateFormated});
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    const value = nextProps.value;
    const prevValue = nextState.prevValue;
    if((typeof value._isValid === "undefined" || value._isValid) && (value !== prevValue)) {
      // this.cursorStart = undefined;
      if(value && !nextState.isFromDateTextChange) {
        let date = DateUtils.toMoment(value).format(nextState.formatter);
        if(nextProps.useMinguoDate) {
          date = DateUtils.toMinguoDate(date);
        }
        return {
          [nextProps.name]: nextState.formatInputString(date),
          prevValue: value,
          isFromDateTextChange: false,
        }
      } else if(!value) {
        return {
          [nextProps.name]: nextState.formatInputString(nextState.formatter),
          prevValue: value,
          isFromDateTextChange: false,
        }
      }
      return {
        isFromDateTextChange: false,
      }
    }
    return null;
  }

  handleKeyDown = (e) => {
    this.isBackspace = e.keyCode === 8;
    this.isDelete = e.keyCode === 46;
    this.isRemove = this.isBackspace || this.isDelete;
    this.cursorStart = e.target.selectionStart;
    this.cursorEnd = e.target.selectionEnd;
    this.isRangeSelect = this.cursorStart !== this.cursorEnd;
  };

  handleDateText = (e) => {
    this.setState({isFromDateTextChange: true});
    const value = e.target ? e.target.value : e;
    if(typeof value === "string") { // 透過 input 直接輸入須要驗証格式
      const isNumber = NumberUtils.isNumeric(e.key) || NumberUtils.isNumeric(e.target.value.charAt(this.cursorStart));
      const valueFormated = this.formatInputString(value);

      // 設定游標位置
      let selectionEnd = this.cursorStart + (this.isRemove ?
        (this.isDelete || (this.isBackspace && this.isRangeSelect)) ? 0 : -1 : 1);
      if(this.dateTimeSplitIndex.includes(selectionEnd)) {
        selectionEnd += (this.isRemove ? 0 : 1);
      }
      selectionEnd = selectionEnd < 0 ? 0 : selectionEnd;

      this.setState({[e.target.name]: valueFormated, show: false},
        () => this.dateInput.selectionEnd =
          (isNumber || this.isRemove) ? selectionEnd : this.cursorStart);
      const valueFormatedWithDate = this.props.disabledDate ?
        moment().format(SimpleCalendar.DEFAULT_DATE_FORMAT) + " " + valueFormated : valueFormated;
      const valueMoment = DateUtils.toMoment(this.props.showMinguoDate ?
        DateUtils.toAnnoDomini(valueFormatedWithDate) : valueFormatedWithDate);
      if(valueMoment._isValid) { // 格式正確，觸發 callback
        this.props.onChange({target: {name: this.props.name, value: valueMoment}});
      } else if(value === "") { // 清空日期
        this.props.onChange({target: {name: this.props.name, value: ""}});
      } else if(valueFormated.length <= this.formatLength
          && ((CalendarMsg.ALWAYS === this.props.showError)
            || (CalendarMsg.DATE_FINISHED === this.props.showError
              && (valueFormated.match(/\d/g) || []).length === this.dateFinishedLength))) {
        this.setState({show: true}); // 格式不正確顯示警告訊息
        if(this.props.onError) { // 有傳入 onError function 則呼叫，否則丟回錯誤日期的 moment
          this.props.onError({target: {name: this.props.name, value: valueMoment}});
        } else {
          this.props.onChange({target: {name: this.props.name, value: valueMoment}});
        }
      }
    } else { // 透過 calendar 選擇日期，不必驗証直接觸發 callback
      this.cursorStart = undefined;
      this.setState({[this.props.name]: this.props.showMinguoDate ?
          this.formatInputString(DateUtils.toMinguoDate(value.format(this.state.formatter))) :
          this.formatInputString(value.format(this.state.formatter)), show: false});
      this.props.onChange({target: {name: this.props.name, value: e}});
    }
  };

  formatInputString = (value) => {
    let dateText = "";
    let indexShift = 0;
    for(let i=0; i<this.formatLength; i++) {
      let dateChar = value.charAt(i + indexShift);
      if((this.isBackspace && i === this.cursorStart - 1) || (this.isDelete && i === this.cursorStart)
          || (this.isRemove && (i >= this.cursorStart && i < this.cursorEnd))
          || (!this.isRemove && (i > this.cursorStart && i < this.cursorEnd))) {
        dateChar = "_";
      }
      if(i === this.cursorStart || (this.isBackspace && i === this.cursorStart - 1)) {
        indexShift = this.isRemove ?
          this.isRangeSelect ? (this.cursorStart - this.cursorEnd) : -1 :
          this.isRangeSelect ? (this.cursorStart - this.cursorEnd + 1) : 1;
      }

      if(NumberUtils.isNumeric(dateChar) && !this.dateTimeSplitIndex.includes(i)) {
        dateText += dateChar;
      } else {
        if(i < this.formatLength) {
          const dateFormatterChar = this.state.formatter.charAt(this.props.showMinguoDate ? i + 1 : i);
          if(/^[a-zA-Z]$/.test(dateFormatterChar)) {
            dateText += "_";
          } else {
            dateText += dateFormatterChar;
          }
        }
      }
    }

    return dateText;
  };

  render() {
    const {
      locale, formatter, disabledDate, disabledTime, calendarDefaultDate,
      showOk, value, hiddenCalendar, showMinguoDate, showError, datePickerStyle, ...inputProps
    } = this.props;

    const calendar = (
      <Calendar locale={locale} style={{zIndex: 1000}} dateInputPlaceholder="please input"
                formatter={this.state.formatter}
                disabledTime={() => []}
                timePicker={disabledTime ? null :
                  <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')}/>}
                defaultValue={calendarDefaultDate}
                showDateInput={false}
                disabledDate={() => disabledDate}
                showOk={showOk}
                showMinguoDate={showMinguoDate}/>);

    this.datePickerValue = DateUtils.toMoment(value);

    const sharedProps = {
      show: this.state.show,
      container: this,
      target: () => this.dateInput
    };

    return (
      <span className="input-group">
        <input ref={el => this.dateInput = el} {...inputProps} value={this.state[this.props.name]}
                  onChange={this.handleDateText} onKeyDown={this.handleKeyDown}/>
        <Overlay {...sharedProps} placement="bottom">
          <Tooltip id="overload-bottom">格式不正確!</Tooltip>
        </Overlay>

        <DatePicker animation="slide-up" disabled={inputProps.disabled} calendar={calendar}
                    value={!!this.datePickerValue && this.datePickerValue._isValid ? this.datePickerValue : moment()}
                    onChange={this.handleDateText} style={datePickerStyle}>
        {
          () => {
            return hiddenCalendar ? <span/> : <span className="input-group-addon glyphicon glyphicon-calendar" />;
          }
        }
        </DatePicker>
      </span>
    )
  }
}

SimpleCalendar.propTypes = {
  /**
   * 使用語系，Example: import zhTW from '@softleader/rc-calendar/lib/locale/zh_TW'
   */
  locale: PropTypes.object,

  /**
   * 日期格式
   * @see https://momentjs.com/docs/
   */
  formatter: PropTypes.string,

  /**
   * 是否 disable 日期
   */
  disabledDate: PropTypes.bool,

  /**
   * 是否 disable 時間
   */
  disabledTime: PropTypes.bool,

  /**
   * 日曆預設日期
   */
  calendarDefaultDate: PropTypes.object,

  // /**
  //  * 日曆上方是否顯示 input
  //  */
  // showCalendarDateInput: PropTypes.bool,

  /**
   * 日曆是否顯示確認鍵
   */
  showOk: PropTypes.bool,

  /**
   * input 的 name
   */
  name: PropTypes.string.isRequired,

  /**
   * input 的 value
   */
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,

  /**
   * input 或 Calendar 的日期 callback function，只有在日期格式正確時才會觸發，
   * 執行 callback 時會傳入的參數為 {target: {name: 使用此元件時傳入的 name, value: Moment 物件}}
   */
  onChange: PropTypes.func.isRequired,

  /**
   * 隱藏小日曆
   */
  hiddenCalendar: PropTypes.bool,

  /**
   * 是否使用民國年
   */
  showMinguoDate: PropTypes.bool,

  /**
   * 錯誤訊息顯示的時機
   */
  showError: PropTypes.oneOf(CalendarMsg.values),

  /**
   * 日曆 Style
   */
  datePickerStyle: PropTypes.object,

  /**
   * 日期格式錯誤時要執行的動作，若沒有傳入此參數則預設丟回錯誤日期的 moment
   */
  onError: PropTypes.func,
};

SimpleCalendar.defaultProps = {
  locale: zhTW,
  formatter: SimpleCalendar.DEFAULT_DATE_TIME_FORMAT,
  disabledDate: false,
  disabledTime: false,
  calendarDefaultDate: moment(),
  // showCalendarDateInput: false,
  showOk: true,
  className: "form-control",
  hiddenCalendar: false,
  showMinguoDate: false,
  showError: CalendarMsg.DATE_FINISHED,
  datePickerStyle: {}
};