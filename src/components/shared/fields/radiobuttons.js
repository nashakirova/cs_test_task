import React, {useState} from "react";
import  "./field.css";

export const Radiobutton = (props) => {
    const {
        name,
        label,
        value,
        onChange,
        type,
        required,
        disabled,
        options,        
        hidden,
        description,
        hasError,
        className,
    } = props;

    const [error, setError] = useState('');

    return(
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
            {options.map(option => (
                   <label key={option}> {option}<input  className={error || hasError ? "field_input_radio error" : "field_input_radio"}
                   type="radio" 
                   id={option} 
                   name={name} 
                   checked={value === option} 
                   onChange={() => onChange(option)} 
                   disabled={disabled} 
                   hidden={hidden}/></label>
                ))}
                </div>
        </div>
    )
}