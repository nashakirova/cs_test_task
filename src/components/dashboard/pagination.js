import React, {useState} from "react";
import {Input} from "../shared/fields/futureFields/input";


export const Pagination = (props) => {
    
  
    let pageCalc = props.total % props.limit === 0 ? props.total/props.limit : Math.floor(props.total/props.limit +1);
    const pages = Array.from(Array(pageCalc).keys());
    const [selectedPage, setSelectedPage] = useState('');
    const [wrongPage, setWrongPage] = useState('');

    const validatePage = (page) => {
        setSelectedPage(page)
        if (typeof +page !== 'number' || page <0 || page > pages.length) {
            setSelectedPage('');
            setWrongPage('Please select a page within the range of 1 to ' + pages.length);
        } else {
            setWrongPage('');
            props.pageClicked(page || 1)
        }
    }

    return(
        <div className="pagination__wrapper">
           
            
                Page {pages[0] +1} of {pages.length}. Go to page <div className="inline_input_wrapper">
               <Input value={selectedPage} onChange={(v) => validatePage(v)} hasError={wrongPage} type="numeric"/>
               </div> 
            

        {/*pages.map(el => <div key={'page' + el} onClick={() => props.pageClicked(el)} className='page'>{el + 1}</div>)

           props.current < props.total-props.limit &&  
            <div onClick={() => props.nextClicked()} className="page">
                {'>>'}
            </div>*/}

        </div>
    )
}
