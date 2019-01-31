import React from 'react';
import ReactDOM from 'react-dom';
import {Calendar, CalendarMsg} from "./src";
import moment from 'moment';

class ComponentTest extends React.Component {

  constructor() {
    super();
    this.state = {
      date1: moment(), date2: "", date3: "", date4: moment(), date5: moment(), date6: '',
    };
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value}, () => console.log(JSON.stringify(this.state)));
  };

  handleError = (e) => {
    alert('日期格式不正確, name: ' + e.target.name);
    console.log(e);
  };

  render() {
    return (
      <div style={{width: "200px"}}>
        西元日期: <Calendar name="date1" value={this.state.date1} onChange={this.handleChange}/>
        民國日期1: <Calendar name="date2" value={this.state.date2} onChange={this.handleChange} showMinguoDate={true}/>
        民國日期2: <Calendar name="date3" value={this.state.date3} onChange={this.handleChange} showMinguoDate={true}
                         showError={CalendarMsg.NEVER}/>
        鎖定時間: <Calendar name="date4" value={this.state.date4} onChange={this.handleChange} disabledTime={true}
                        showError={CalendarMsg.ALWAYS}/>
        鎖定日期: <Calendar name="date5" value={this.state.date5} onChange={this.handleChange} disabledDate={true}/>
        日期錯誤: <Calendar name="date6" value={this.state.date6} onChange={this.handleChange}
                        onError={this.handleError}/>
      </div>
    );
  }
}


window.app = {};

app.create = (dom) => {
  ReactDOM.render(
    <ComponentTest/>,
    dom
  )
};