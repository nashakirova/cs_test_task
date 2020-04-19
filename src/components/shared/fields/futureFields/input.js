import React, {useState} from "react";
import  "../field.css";

export const Input = (props) => {
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
    const [error, setError] = useState('');
    const validateNumeric = (value) => {
        if (!/^[0-9]*$/.test(value)) {
            setError('Only numeric value is expected');   
            return;         
        }
        onChange(value);

    }

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
            {
                type === 'text' && 
                <input className={hasError || error ? "field_input_text error" : "field_input_text"} 
                name={name} 
                type="text" 
                value={value} 
                onChange={(v)=> onChange(v.target.value)} 
                disabled={disabled} 
                required={required} 
                hidden={hidden}
                autoComplete="off"/>
            }
             {
                type === 'numeric' && 
                <input className={hasError || error ? "field_input_text error" : "field_input_text"} 
                type="text" 
                name={name} 
                onChange={(v)=> validateNumeric(v.target.value)} 
                value={value} 
                disabled={disabled} 
                required={required} 
                hidden={hidden}
                autoComplete="off"/>
            }
            {
                (error || hasError) && <p className="error_message">{error || hasError}</p>
            }
            </div>
        </div>

    )
}