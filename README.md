# simple-calendar

## Introduction

簡化了 [rc-calendar](https://github.com/react-component/calendar) 的用法
相關範例參照 app.js

## Calendar
```javascript
import {Calendar} from "simple-calendar";

<Calendar name="date" value={this.state.date} onChange={this.handleChange} showMinguoDate={true}/>
```

- Properties

Property | Version | IsRequired? | Default | Description
---|---|:---:|---|---
locale |  |  | zhTW | 使用語系，Ex: import zhTW from 'simple-calendar/lib/locale/zh_TW'
formatter |  |  | YYYY-MM-DD HH:mm:ss | 日期格式，Ex: Calendar.DEFAULT_DATE_TIME_FORMAT
disabledDate |  |  | false | 是否 disable 日期
disabledTime |  |  | false | 是否 disable 時間
calendarDefaultDate |  |  | moment() | 日曆預設日期
showOk |  |  | true | 日曆是否顯示確認鍵
name |  | Y |  | input 的 name
value |  | Y |  | input 的 value，可以是 object、array 或 string 其中一個
onChange |  | Y |  | input 或 Calendar 的日期 callback function，只有在日期格式正確時才會觸發，執行 callback 時會傳入的參數為 {target: {name: 使用此元件時傳入的 name, value: Moment 物件}}
hiddenCalendar |  |  | false | 隱藏小日曆
showMinguoDate |  |  | false | 是否使用民國年
showError |  |  | DATE_FINISHED | 錯誤訊息顯示的時機，參數參照 enum CalendarMsg
datePickerStyle |  |  |  | 日曆 Style
onError |  |  |  | 日期格式錯誤時要執行的動作，若沒有傳入此參數則預設丟回錯誤日期的 moment
... |  |  |  | 其他 input 的任何 attribute，Ex: className、style...