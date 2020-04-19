import React, {useState} from "react";
import {BASIC_URL} from "../../utils/constants";
import  "./field.css";

export const Picker = (props) => {
    const {
        label,
        description,
        name,        
        value,
        onChange,
        required,
        disabled,
        reference,
        displayValue,
        hidden,        
        hasError,
        className,
        selectDisplay
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

    const selectHandler = (option) => {        
        onChange(option); 
        setOptions([]);
        setSelectQuery('');         
    }

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
            <div className="select_wrapper" >                
                <div className="select_input_wrapper"><input className={hasError || error ? "field_input_text error" : "field_input_text"}  
                    name={name} 
                    onChange={(v) => selectFunction(v.target.value)}
                    value={!wasChanged? (selectDisplay[displayValue] || '') : (selectQuery ? selectQuery : value[displayValue] || '') }               
                    disabled={disabled}
                    required={required}
                    hidden={hidden}
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
        </div>
    )
}

