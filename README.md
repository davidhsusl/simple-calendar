# tw-simple-calendar

## Introduction

Let [rc-calendar](https://github.com/react-component/calendar) more easy to use and support minguo date  
See the example at app.js with `npm start`

## Calendar
```javascript
import {Calendar} from "tw-simple-calendar";

<Calendar name="date" value={this.state.date} onChange={this.handleChange} showMinguoDate={true}/>
```

- Properties

Property | Version | IsRequired? | Default | Description
---|---|:---:|---|---
locale |  |  | zhTW | Language, Ex: import zhTW from 'tw-simple-calendar/lib/locale/zh_TW'
formatter |  |  | YYYY-MM-DD HH:mm:ss | Date format, Ex: Calendar.DEFAULT_DATE_TIME_FORMAT
disabledDate |  |  | false | Is disable date
disabledTime |  |  | false | Is disable time
calendarDefaultDate |  |  | moment() | Default date of the calendar
showOk |  |  | true | Is show `OK` button on the calendar
name |  | Y |  | The name of input
value |  | Y |  | The value of input, must be the one of object, array or string
onChange |  | Y |  | The callback function for date change, only be triggered when the date is valid, the callback function will with argument {target: {name: \<name\>, value: \<moment object\>}}
hiddenCalendar |  |  | false | Hide the calendar icon
showMinguoDate |  |  | false | Is show minguo date, used for TAIWAN usually
showError |  |  | DATE_FINISHED | The time to show error message, change the attribute by `import {CalendarMsg} from "tw-simple-calendar"`
datePickerStyle |  |  |  | Calendar's style
onError |  |  |  | The callback function for error date
... |  |  |  | Other input's attribute, Ex: className, style...