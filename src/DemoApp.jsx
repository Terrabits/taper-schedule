import React             from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin     from '@fullcalendar/daygrid'
import timeGridPlugin    from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {getLocalDate} from './helpers'
import {getSchedule}  from './schedule'


export default class DemoApp extends React.Component {

  calendarRef = React.createRef()

  state = {
    currentEvents: []
  }

  render() {
    return (
      <div className='demo-app'>
        {this.renderSidebar()}
        <div className='demo-app-main'>
          <FullCalendar
            ref={this.calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            initialEvents={this.eventsFromUrl()}
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            eventContent={renderEventContent} // custom render function
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
          />
        </div>
      </div>
    )
  }

  renderSidebar() {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <h2>Instructions</h2>
          <p>
            Enter your start date and desired dose, then share the url.
          </p>
        </div>
        <div className='demo-app-sidebar-section'>
          <label>
            Start Date:
            <input
              id="start"
              type="date"
              onChange={this.handleGetSchedule} />
          </label>
          <br/>
          <label>
            Final Dose:
            <select id="dose_mg"
                    name="dose"
                    onChange={this.handleGetSchedule}>
              <option value="25">25 mg</option>
              <option value="50">50 mg</option>
              <option value="100">100 mg</option>
              <option value="150">150 mg</option>
            </select>
          </label>
          <br/>
        </div>
        <div className='demo-app-sidebar-section'>
          <h2>All Events ({this.state.currentEvents.length})</h2>
          <ul>
            {this.state.currentEvents.map(renderSidebarEvent)}
          </ul>
        </div>
      </div>
    )
  }

  removeAllEvents = () => {
    let calendarApi = this.calendarRef.current.getApi();
    calendarApi.removeAllEvents();
  }

  addEvent = (event) => {
    let calendarApi = this.calendarRef.current.getApi();
    return calendarApi.addEvent(event);
  }

  eventsFromUrl = () => {
    // parse start
    let url   = new URL(location.toString());
    let startStr = url.searchParams.get('start');
    if (startStr === null) {
      return [];
    }
    let start = getLocalDate(startStr);

    // parse dose
    let doseStr = url.searchParams.get('dose_mg');
    if (doseStr === null) {
      return [];
    }
    let dose_mg = Number(doseStr);

    // set inputs
    let startInput = document.getElementById('start');
    if (startInput != null) {
      startInput.value = startStr;
    }
    let doseInput = document.getElementById('dose_mg');
    if (doseInput != null) {
      doseInput.value = doseStr;
    }

    // return events
    return getSchedule(start, dose_mg);
  }

  updateUrl = (start, dose_mg) => {
    // create start string
    let year  = `${start.getFullYear()}`;
    let month = `${start.getMonth() + 1}`.padStart(2, '0');
    let day   = `${start.getDate()}`.padStart(2, '0');
    let startStr = `${year}-${month}-${day}`;

    // update url
    let url      = new URL(location.toString());
    url.searchParams.set('start', startStr);
    url.searchParams.set('dose_mg', dose_mg);
    window.history.replaceState(null, '', url.toString());
  }

  handleGetSchedule = () => {
    // get start date
    let dateInput = document.getElementById('start');
    if (dateInput.value === "") {
      return;
    }

    // get dose
    let doseInput = document.getElementById('dose_mg');
    if (doseInput.value === "") {
      return;
    }

    // generate schedule
    let start   = getLocalDate(dateInput.value);
    let dose_mg = Number(doseInput.value);
    let events  = getSchedule(start, dose_mg);

    // update events
    this.removeAllEvents();
    events.forEach(this.addEvent)
    this.updateUrl(start, dose_mg);
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}
