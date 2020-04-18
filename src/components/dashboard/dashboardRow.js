import React from "react";
import {transformDate} from "../utils/time";
import {COLUMNS} from "../utils/constants";

export const DashboardRow = (props) => {

    const cellTransformer = (key, value) => {
        if (key === 'Deadline') {
            return transformDate(value);
        }

        if (key === 'WantedCharacters') {
            return value.join(', ');
        }

        if (key === 'Requestor' || key === 'Storyteller') {
            
            let displayValue = COLUMNS.find(el => el.key === key)['displayValue'];
            return props.refFields[value] && props.refFields[value][displayValue] || '';
        }
        
        return value || ''
    }

    const handleMouseOver = (key, value, rowId) => {
       
        if (value && value.length > 50) {
            props.cellOver(key, value.toString().substring(0,500), rowId);
        }
    }
    
    return(        
        <tr>
            {
                Object.keys(props.row).map((key,i) => {  
                        if (props.row[key] && props.row[key].action) {
                            return <td key={props.row.id + i}>{props.row[key].action}</td>
                        }  else {
                            return <td 
                            onMouseOver={() => handleMouseOver(key, props.row[key], props.row.id)}   
                                                 
                            key={props.row.id + i}>{cellTransformer(key,props.row[key]).toString().substring(0,50)}</td>
                        }                
                                          
                })
                
            }
        </tr>
       
    )
}