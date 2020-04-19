import React, {useState} from "react";
import  "./field.css";
import DatePicker from 'react-date-picker';
import {transformDate} from "../../utils/time";

export const Datepicker= (props) => {
    const {
        name,
        label,
        value,
        onChange,
        type,
        required,
        disabled,        
        hidden,
        description,
        hasError,
        className,        
    } = props;
    
    const [calendarVisible, setCalendarVisible] = useState(true);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const [month, setMonth] = useState(value.getMonth());
    const [year, setYear] = useState(value.getFullYear());
    const [days, setDays] = useState(new Date(value.getFullYear(), value.getMonth()+1, 0).getDate());
    const [startDay, setStartDay] = useState(value.getDay());

    const getDaysOfMonth = (month, days) => {

    }

    const handleMonthChange = (dir) => {
        if (dir < 0) {
            if (month === 0) {
                setDays(new Date(year-1, 12, 0).getDate());
                setStartDay(new Date(year-1, 12, 1).getDay());
                setMonth(11);
                setYear(year-1);
                
                
            } else {
                setDays(new Date(year, month, 0).getDate());
                setStartDay(new Date(year-1, month-1, 1).getDay());
                setMonth(month-1);
                setYear(year-1);
            }

        }
    }

    return (
        <div className={className ? "field_wrapper " + className : "field_wrapper"}>
        {
            type !== 'checkbox' && label && !hidden && <div className="field_label_wrapper">
                <label className="field_label" htmlFor={label}>{label}</label><span hidden={required? '': 'hidden'}>*</span>
                </div>
        } 
        {
            description && !hidden && <div className="field_description">
                <p className="field_description">{description}</p>
            </div>
        }
        <div className="answer_wrapper">
            <div disabled={disabled} className="datepicker_value"><span></span> <span className="datepicker_calender" onClick={()=>{if (!disabled)setCalendarVisible(true)}}>x</span></div>
            {calendarVisible && <div className="calendar">                
                <div className="datepicker_days">
                <div className="datepicker_title"><span onClick={()=>handleMonthChange(-1)}>{"<"}</span><span>{months[month]}</span><span onClick={()=>handleMonthChange(1)}>{">"}</span></div>
                <div className="datepicker_days">
                    <div className="datepicker_weekdays">{weekDays.map( day => <span>{day}</span>)}</div>
                    <div className="days_container">
                        {days.map(day => <div onClick={() => onChange(new Date(year, month, day))}>{day}</div>)}
                    </div>
                </div>
                </div>
                 </div>}
        </div>

        {/*disabled ? (<p>{transformDate(value)}</p>)  :
                     <DatePicker value={value? new Date(value): ''} onChange={(date) => onChange(date)}/>*/}
        </div>
    )
}