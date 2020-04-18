import React, {useState} from "react";
import {BASIC_URL} from "../../utils/constants";
import {transformDate} from "../../utils/time";
import DatePicker from "react-date-picker";
import {Checkbox} from "./checkbox";
import {Input} from "./input";
import {Picker} from "./lookup";
import {Multucheckbox} from "./multicheckbox";
import {Radiobutton} from "./radiobuttons";
import {Textarea} from "./textarea";
import  "./field.css";

export const Field = (props) => {    

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
        selectDisplay,
        placeholder
    } = props;
   
    const [selectOptions, setOptions] = useState([]);   
    const [selectQuery, setSelectQuery] = useState('');    
    const [error, setError] = useState('');
    const [wasChanged, setChanged] = useState(false);
    const selectFunction = (query) => {     
        setSelectQuery(query);
        setChanged(true);   
        if (!reference) setOptions([]);
        fetch(BASIC_URL + '/' + reference + '?q=' + query + '&_page=1&_limit=5')
        .then(resp => resp.json())
        .then(res => setOptions(res));
    }

    const multiChoiceFunction = (query) => {
        setSelectQuery(query);       
        setOptions(options.filter(el => el.toLowerCase().indexOf(query.toLowerCase())>-1));
    }

    const validateNumeric = (value) => {
        if (!/^[0-9]*$/.test(value)) {
            setError('Only numeric value is expected');   
            return;         
        }
        onChange(value);

    }
    const selectHandler = (option) => {        
        onChange(option); 
        setOptions([]);
        setSelectQuery('');
         
    }

    const clearAll = () => {
        setOptions([]);
        setSelectQuery('');
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
        <div className={className ? "field_wrapper " + className : "field_wrapper"} style={hidden? {"display": "none"}: {}}>
            {
                type !== 'checkbox' && label && <div className="field_label_wrapper">
                    <label className="field_label" htmlFor={label}>{label}</label><span hidden={required? '': 'hidden'}>*</span>
                    </div>
            } 
            {
                description  && <div className="field_description">
                    <p className="field_description">{description}</p>
                </div>
            }
            <div className={className ? "answer_wrapper " + className : "answer_wrapper"}>
            {
                type === 'text' && 
                <input className={hasError || error ? "field_input_text error" : "field_input_text"} 
                placeholder={placeholder}
                name={name} 
                type="text" 
                value={value} 
                onChange={(v)=> onChange(v.target.value)} 
                disabled={disabled} 
                required={required} 
                
                autoComplete="off"/>
            }
            {
                type === 'textarea' &&
                <textarea className={hasError || error ? "field_textarea error" : className ? "field_textarea " + className : "field_textarea"}
                name={name} 
                value={value} 
                onChange={(v)=> onChange(v.target.value)} 
                disabled={disabled} 
                required={required} 
                />
            }
            {
                type === 'select' && selectOptions &&
                <div className="select_wrapper" >                
                <div className="select_input_wrapper"><input className={hasError || error ? "field_input_text error" : "field_input_text"}  
                name={name} 
                onChange={(v) => selectFunction(v.target.value)}
                value={!wasChanged? (selectDisplay[displayValue] || '') : (selectQuery ? selectQuery : value[displayValue] || '') }               
                disabled={disabled}
                required={required}
                
                autoComplete="off"
                />
              
                </div>
                
                {
                    selectOptions && selectOptions.length > 0 && <ul className="option_list">
                    {
                        selectOptions.map(option => (<li key={option.id}
                            className="option"
                            onClick={()=> {selectHandler(option)}}><span>{option[displayValue]}</span></li>))
                    }
                    </ul>
                }
                </div>
            }
            {
                type === 'multichoice'   && <div className="select_wrapper">
                                  
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
                            <Checkbox 
                            value={value.indexOf(option)>-1}
                            onChange={()=> multichoiceHandler(option, 'add')}
                            name={option}
                            label={option}/>
                            </div>))
                    }
                    </div>
                }
                </div>
            }
            {
                type === 'checkbox' && 
                <label className="checkbox_container"> 
                    <input  
                    type="checkbox"
                    className="hidden_checkbox"
                    name={name} 
                    checked={value} 
                    onChange={() => onChange(!value)} 
                    disabled={disabled} 
                    /><span disabled={disabled}  className="check_label">{label}</span>
                    <span disabled={disabled}  className={error || hasError ? "field_input_checkbox error" : "field_input_checkbox"}></span>
                    
                </label>
            }
            {
                type === 'radio' && options && options.length >0 &&
                <div>{options.map(option => (
                   <label key={option} className="radio_container"> <span className="radio_label">{option}</span><input className="hidden_radio"
                   type="radio" 
                   id={option} 
                   name={name} 
                   checked={value === option} 
                   onChange={() => onChange(option)} 
                   disabled={disabled} 
                   />
                   <span className={error || hasError ? "field_input_radio error" : "field_input_radio"}></span></label>
                ))}</div>
            }            
            {
                type === 'numeric' && 
                <input className={hasError || error ? "field_input_text error" : "field_input_text"} 
                placeholder={placeholder}
                type="text" 
                name={name} 
                onChange={(v)=> validateNumeric(v.target.value)} 
                value={value} 
                disabled={disabled} 
                required={required} 
                
                autoComplete="off"/>
            }
            { 
                 type === 'date' && (disabled ? (<p>{transformDate(value)}</p>)  :
                     <DatePicker value={value? new Date(value): ''} onChange={(date) => onChange(date)}/>) 
            }
            {
                (error || hasError) && <p className="error_message">{error || hasError}</p>
            }
           </div>
            
        </div>
    )

}
