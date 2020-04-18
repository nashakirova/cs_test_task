import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {DashboardRow} from "./dashboardRow";
import {Pagination} from "./pagination";
import {COLUMNS, BASIC_URL} from "../utils/constants";
import {validateValue} from "../utils/submitValidation";
import {Field} from "../shared/fields/field";
import "./dashboard.css";
import "../shared/fields/field.css";

const Dashboard = () => {
    const limit = 10;
    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [orderBy, setOrderBy] = useState('');
    const [orderDirection, setOrderDirection] = useState('ASC');
    const [search, setSearch] = useState('');    
    const [displayValue, setDisplayValue] = useState('');
    const [popupDescription, setPopupDescription] = useState('');
    const [topPopup, setTopPopup] = useState(0);
    const [inListError, setInListerror] = useState('');
    const [listUpdated, setListUpdated] = useState(false);
    const [selectedRowID, setSelectedRowID] = useState('');
    const [refFields, setRefFields] = useState({});

    useEffect(()=> {
        let url = BASIC_URL + '/Requests?';
        if (search) {
           url += 'q=' + search + '&';
        }
        url += '_page=' + currentPage;
        if (orderBy) {
            url += '&_sort=' + orderBy + '&_order=' + orderDirection;
        }
        let references = [];
        
        fetch(url,{
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => { 
            setTotalCount(res.headers.get('X-Total-Count'));

            return res.json(); 
        })
        .then(reqs => {
            let sortedByKeys = [];
            let promiseArray = [];
            reqs.forEach(req => {
                let newRow = {};                
                COLUMNS.forEach(column => {
                    if (column.type !== 'action') {
                        newRow[column.key] = req[column.key];
                        if (column.type === 'select' && column.reference && req[column.key] && !references.find(el => el.reference === column.reference && el.id === req[column.key])) {
                            references.push({
                                reference: column.reference,
                                id: req[column.key]
                            })
                        }
                    } else {
                        newRow[column.key] = {
                            action: <Link to={column.button.url + req.id}>{column.button.label}</Link>
                        }
                    }
                    
                })
                sortedByKeys.push(newRow);
            })
            setRequests(sortedByKeys);
            references.forEach( ref => promiseArray.push(fetch(BASIC_URL + '/' + ref.reference + '/' + ref.id)));
            return Promise.all(promiseArray)
        })
        .then( resp => {
            let jsonPromises = [];            
            resp.forEach( resJson => jsonPromises.push(resJson.json()));
            return Promise.all(jsonPromises);
        })
        .then( res => {
            let references = {};
            
            res.forEach(ref => {
                references[ref.id] = ref;
            })
            setRefFields(references);
        });
    },[currentPage, orderBy, orderDirection, search, listUpdated]);

    

    const cellOver = (key,value, rowId) => {
        setDisplayValue(value);
        setPopupDescription(key);
       setSelectedRowID(rowId);
        let top = requests.findIndex(el => el.id === rowId);
        
        setTopPopup(top);
    }

    const saveRow = () => {
        let column = COLUMNS.find( el => el.key === popupDescription);
        let error = validateValue(column, displayValue,requests[topPopup][column.mandatoryDependent]);
        if (error) {
            setInListerror(error);
        } else {
            setInListerror('');
            let body = {
                ...requests[topPopup],                
            };
            body[popupDescription] = displayValue;
            fetch(BASIC_URL + '/Requests/' + selectedRowID, {
                headers: {'Content-Type': 'application/json'},
                method: 'PUT',
                body: JSON.stringify(body)
            })
            .then(resp => resp.json())
            .then(res => {
                setDisplayValue('');
                setListUpdated(true);
            })
        }
    }

    return(
        <div>
           <h2 className="title">Story requests</h2>
            <div>
                <Field type="text" value ={search} onChange={(value) => {setSearch(value)}} placeholder="Search something..."/>
            <table className="table">
                            
                <thead>                   
                    <tr>
                        {COLUMNS.map((column,i) => (<th key={column + i} className={column.width ? 'col-2' : 'col-1'}>
                            <div  className="header__cell">
                                <div className="th_name__wrapper">{column.label}</div>
                                {column.sort && <div className="arrow__wrapper">
                                    <div onClick={() => { setOrderBy(column.key); setOrderDirection('ASC') }}
                                            className={orderBy === column.key && orderDirection === 'ASC' ? 'arrow__active' : 'arrow__inactive'}>▲</div>
                                    <div onClick={() => { setOrderBy(column.key); setOrderDirection('DESC') }}
                                            className={orderBy === column.key && orderDirection === 'DESC' ? 'arrow__active' : 'arrow__inactive'}>▼</div>
                                </div>}
                            </div>
                        </th>))}  
                    </tr>                  
                </thead>
                <tbody>
                {requests && requests.length > 0 && requests.map((requestRow,i)=> (<DashboardRow row={requestRow} 
                    cellOver={cellOver} 
                    refFields={refFields}                   
                    key={'row' + i}></DashboardRow>))}
                    {
                (!requests || requests.length === 0) && <tr>
                    <td colSpan={COLUMNS.length}><p>
                    No items were found
                    </p></td>
                </tr>
                
            }
                </tbody>
            </table>
            <Pagination limit={limit}
                    total={totalCount}
                    current={currentPage}                    
                    pageClicked={(page) => setCurrentPage(page)}                    
                />
            </div>
        
            
            {
               displayValue &&  <div className="popup" style={{"top": (topPopup + 1) * 30}}> 
               
               <div><h4>{popupDescription}</h4> <span className="popup_close" onClick={() => setDisplayValue('')}>x</span></div>
               <div className="display_value">
                    <Field  type="textarea" className="popup_textarea" value={displayValue} onChange={(v) => setDisplayValue(v)} hasError={inListError}/>
                </div>
                <div><button className="btn btn_primary" onClick={saveRow}>Submit</button></div>
               </div>
            }

        </div>
    )
}

export default Dashboard;