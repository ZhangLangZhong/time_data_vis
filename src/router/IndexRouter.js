import React from 'react'
import { Route, Switch,BrowserRouter } from 'react-router-dom'
import MainView from '../views/mainView/MainView'

export default function IndexRouter() {
    console.log("IndexRouter");
    return (
        <div>
        indexrouter....
    
        <BrowserRouter>
            <Switch>
                <Route path="/" component = {MainView}/>
            
            </Switch>
        </BrowserRouter>
        </div>
    )
}
