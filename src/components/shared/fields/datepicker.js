import React from "react";
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
        </div>
        {disabled ? (<p>{transformDate(value)}</p>)  :
                     <DatePicker value={value? new Date(value): ''} onChange={(date) => onChange(date)}/>}
        </div>
    )
}