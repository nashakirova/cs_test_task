import React from "react";
import  "../field.css";

export const Checkbox = (props) => {
    const {
        name,
        label,
        value,
        onChange,
        disabled,        
        hidden,
        hasError,
        className,
    } = props;
    
    return(
        <div className={className ? "field_wrapper " + className : "field_wrapper"} hidden={hidden}>
            <label className="checkbox_container"> 
                    <input  
                    type="checkbox"
                    className="hidden_checkbox"
                    name={name} 
                    checked={value} 
                    onChange={() => onChange(!value)} 
                    disabled={disabled} 
                    /><span disabled={disabled}  className="check_label">{label}</span>
                    <span disabled={disabled}  className={hasError ? "field_input_checkbox error" : "field_input_checkbox"}></span>
                    
                </label>
        </div>
    )

}


/*<input 
className="field_option_checkbox"
type="checkbox" 
checked={value.indexOf(option)>-1} 
onChange={()=> multichoiceHandler(option, 'add')}
autoComplete="off"/><label>{option}</label>*/