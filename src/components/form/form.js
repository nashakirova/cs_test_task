import React, {useState, useEffect} from "react";
import {BASIC_URL, COLUMNS} from "../utils/constants";
import {validateValue} from "../utils/submitValidation";
import {Field} from "../shared/fields/field";
import {Checkbox} from "../shared/fields/checkbox";
import {Datepicker} from "../shared/fields/datepicker";
import {Input} from "../shared/fields/input";
import {Picker} from "../shared/fields/lookup";
import {Multucheckbox} from "../shared/fields/multicheckbox";
import {Rediobutton} from "../shared/fields/radiobuttons";
import {Textarea} from "../shared/fields/textarea";
import {Link} from "react-router-dom";
import { transformDate } from "../utils/time";
const Form = (props) => {    
    const [fields, setFields] = useState({});
    const id = window.location.search.indexOf('id') && window.location.search.split('=')[1];
    const [isOwner, changeIsOwner] = useState(false);
    const [refFields, setRefFields] = useState({});
    const [fieldsErrors, setFieldErrors] = useState({});
    useEffect(()=> {         
        if (id) {
            
            fetch(BASIC_URL + '/Requests/' + id)
            .then(resp => resp.json())
            .then(res => {
                setFields(res);  
                let promiseArray =[]
                COLUMNS.forEach(column => {
                    if (column.type === 'select' && column.reference && res[column.key]) {
                        promiseArray.push(fetch(BASIC_URL + '/' + column.reference + '/' + res[column.key]))
                    }            
                });
                return Promise.all(promiseArray);                        
            })
            .then( resp => {
                let jsonPromises = [];
                resp.forEach( oneCall => jsonPromises.push(oneCall.json()));
                return Promise.all(jsonPromises);
            })
            .then( res => {
                let references = {};
                res.forEach(el => {
                    references[el.id] = el;                    
                })
                setRefFields(references);
            })
            .catch( err => console.error(err));            
        }
    },[]);

    

    const updateField = (column, value) => {
        let fields_snapshot = JSON.parse(JSON.stringify(fields));
        fields_snapshot[column] = value;        
        setFields(fields_snapshot);
    }

    const dashboardRedirect = () => {
        props.history.push('/');
    }   
    
    const fieldsValid = () => {
        let errors = {};
       
        COLUMNS.forEach(column => {
            errors[column.key] = validateValue(column, fields[column.key], fields[column.mandatoryDependent]);            
        })
        
        setFieldErrors(JSON.parse(JSON.stringify(errors)));
        
        if (Object.keys(errors).length) return false;
        return true;
        
        
    }

    const save = (event,mode) => {
        event.preventDefault();
        let method = 'POST';
        let url = BASIC_URL + '/Requests';
        if (id) {
            method='PUT';
            url += '/' + id;
        }
        
        if (mode === 'submit') {
            if (!fieldsValid()) {
                window.scrollTo(0, 0)
                return;
            }
        }
        let fields_snap ={ ...fields};
        fields_snap.Status = mode === 'save' ? 'Draft' : 'New';
        Object.keys(fields_snap).forEach(key => {
            if (fields_snap[key].id) fields_snap[key]=fields_snap[key].id;
        });
        
        fetch(url,{
            headers: {'Content-Type': 'application/json'},
            method: method,
            body: JSON.stringify(fields_snap),
        })
        .then(res => res.json())
        .then(resp => {
            if (mode === 'submit') {
                sendEmail();
            } else {
                dashboardRedirect();
            }
            
        })       
        
    }

    const sendEmail = () => {
        let recipients = [];
        [fields['Requestor'], fields['Storyteller']].forEach(field => {
            if (field && field.email) recipients.push(field.email); else recipients.push(id);
            
        })
        fetch(BASIC_URL + '/Emails',{
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({
                to: [fields['Requestor'], fields['Storyteller']],
                subject: 'New request',
                body: `Hi, a new request has been created by ${fields['Requestor']}. Cheers, Story team`
            })
        })
        .then( resp => resp.json())
        .then( res => dashboardRedirect())
    }

    return(
        <div>
            
            <form className="form" onSubmit={(event) => save(event,'submit')}>
                <h2 className="title">Submit a new story request {isOwner}</h2>
                <Field
                type='checkbox' 
                label="Are you an owner? We will check with our own methods"
                onChange={(v)=> changeIsOwner(v)}
                value={isOwner}
                name="isOwner"/>
            {COLUMNS.map(column => column.type!== 'action' &&
                <Field key={column.key}
                type={column.type}
                value={fields[column.key] || column.defaultValue}
                name={column.key}
                label={column.label}
                disabled={!isOwner && id ? 'disabled' : ''}
                hidden={column.hidden || column.visibleDependent && !fields[column.visibleDependent]? 'hidden' : ''}
                required={column.required ||  column.mandatoryDependent && fields[column.mandatoryDependent] && (!column.hidden || column.visibleDependent && fields[column.visibleDependent]) ? 'required' : ''}
                onChange={(value) => updateField(column.key, value)}
                options={column.options}
                reference={column.reference}
                displayValue={column.displayValue}
                selectDisplay={refFields[fields[column.key]] || ''}
                description={column.description || ''}
                hasError={fieldsErrors[column.key] || ''}
               />
            )}
            {isOwner && <div className="buttons_wrapper">
                <Link className="btn btn_secondary" to="/">Cancel</Link>
                <button className="btn btn_primary" onClick={(event) => save(event,'save')}>Save</button>    
                <button className="btn btn_primary" type="submit">Submit</button>
            </div>}
            </form>
        </div>
    )
}
export default Form;

