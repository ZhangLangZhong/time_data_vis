import React from 'react'
import { Route, Switch,BrowserRouter } from 'react-router-dom'
import MainView from '../views/mainView/MainView'

export default function IndexRouter() {
    return (
        <div>
        indexrouter....
    
        <BrowserRouter>
            <Switch>
                <Route path="/" component = {MainView}/>
                {/* <Route path="/" render={()=>{
                    1==1?
                    <mainView></mainView>:
                    <Redirect to="/"/>
                }}/> */}


            </Switch>
        </BrowserRouter>
        </div>
    )
}
