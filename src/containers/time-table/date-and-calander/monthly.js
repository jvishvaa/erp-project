import React, { useState } from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

// const localizer = momentLocalizer(moment)

const MyCalendar = (props) => {


    const handleDateClick = (e) => {
        console.log(e);
    }

    const renderEventContent = (e) => {
        console.log(e.timeText);
        console.log(e.event.title);
    }


    return (
        <div style={{ margin: '30px' }}>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                initialView={props?.defaultView}
                defaultView='timeGridWeek'
                height='500px'
                events={props?.timeTableEvents}
                dateClick={handleDateClick}
                eventContent={renderEventContent}
                eventClick={props.eventClick}
                headerToolbar={props.heading}
                slotMinTime={props?.startSchoolTime}
                slotMaxTime={props?.endSchoolTime}
                dayHeaderFormat={{weekday: 'long'}}

            />
        </div>
    )
}
export default MyCalendar;


