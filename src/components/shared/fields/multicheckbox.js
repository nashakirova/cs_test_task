import React, {useState} from "react";
import  "./field.css";
import {Checkbox} from "./checkbox";

export const Multucheckbox = (props) => {
    const {
        name,
        label,
        value,
        onChange,
        type,
        required,
        disabled,
        options,
        reference,
        displayValue,
        hidden,
        description,
        hasError,
        className,
        selectDisplay
    } = props;

    const [selectOptions, setOptions] = useState([]);   
    const [selectQuery, setSelectQuery] = useState('');    
    const [error, setError] = useState('');
    const [wasChanged, setChanged] = useState(false);

    const multiChoiceFunction = (query) => {
        setSelectQuery(query);       
        setOptions(options.filter(el => el.toLowerCase().indexOf(query.toLowerCase())>-1));
    }
    const multichoiceHandler = (item, mode) => {
        if (mode === 'remove') {   
            let index = value.indexOf(item);
            let temp_value = JSON.parse(JSON.stringify(value));
            temp_value.splice(index,1);
            onChange(temp_value);
        }
        if (mode === 'add') {
            let temp_value = JSON.parse(JSON.stringify(value));
            if (typeof temp_value === 'string') temp_value = [temp_value];
            let index = value.indexOf(item);
            if (index>=0) return;
            temp_value.push(item);
            onChange(temp_value);
            
        }

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
            {!disabled && <input className={hasError || error ? "field_input_text error" : "field_input_text"} 
                 name={name} 
                value={selectQuery}
                onChange={(v)=>multiChoiceFunction(v.target.value)}    
                             
                />}
                {
                    disabled && <p>{value.join(', ')}</p>
                }
                
                {
                    !disabled &&  selectOptions && selectOptions.length > 0 && <div className="field_checkbox_list">
                    {
                        selectOptions.map(option => (<div key={option} >
                            <Checkbox value={value.indexOf(option)>-1} onChange={()=> multichoiceHandler(option, 'add')}/>
                            <input 
                            className="field_option_checkbox"
                            type="checkbox" 
                            checked={value.indexOf(option)>-1} 
                            onChange={()=> multichoiceHandler(option, 'add')}
                            autoComplete="off"/><label>{option}</label></div>))
                    }
                    </div>
                }

            </div>

            </div>
    )
}