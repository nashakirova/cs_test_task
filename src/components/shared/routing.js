import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import Form from "../form/form";
import Dashboard from "../dashboard/dashboard";

const Routing = () => {
    return(
        <BrowserRouter>
            <Route exact path='/' component={Dashboard}/>
            <Route path='/form' component={Form}/>
            <Route path='/form.html' component={Form}/>
        </BrowserRouter>
    )
}

export default Routing;