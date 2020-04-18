import React, {useState} from "react";
import  "./field.css";

export const Textarea = (props) => {
    const {
        label,
        description,
        name,        
        value,
        onChange,
        required,
        disabled,        
        hidden,        
        hasError,
        className,
    } = props;

    const [error, setError] = useState('');

    return(
        <div className={className ? "field_wrapper " + className : "field_wrapper"}>
            {
                label && !hidden && <div className="field_label_wrapper">
                    <label className="field_label" htmlFor={label}>{label}</label><span hidden={required? '': 'hidden'}>*</span>
                    </div>
            } 
            {
                description && !hidden && <div className="field_description">
                    <p className="field_description">{description}</p>
                </div>
            }
             <div className="answer_wrapper">
             <textarea className={hasError || error ? "field_textarea error" : "field_textarea"}
                name={name} 
                value={value} 
                onChange={(v)=> onChange(v.target.value)} 
                disabled={disabled} 
                required={required} 
                hidden={hidden}/>
             </div>

            </div>
    )
}