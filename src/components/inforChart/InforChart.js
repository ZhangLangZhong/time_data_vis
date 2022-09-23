import React, { useEffect, useLayoutEffect, useState } from 'react'
import './InforChart.css'
import { sendAction } from '../../redux/action';
import store from '../../redux/store';

import  ComponentA  from './componentA';
import ComponentB from './componentB';
import { Provider } from 'react-redux'
import { Connect } from 'react-redux';

export default function InforChart() {

  // const [nowtype,setNowtype] = useState(100)

  // const handleClick = ()=>{
  //   // const action = sendAction()
  //   store.dispatch({type:'send_type',value:nowtype})
  // }

  // useLayoutEffect(()=>{
  //   store.subscribe(()=>{
  //     // console.log('subscribe',store.getState())
  //     setNowtype(store.getState().value)
  //   })
  // },[])

  return (
      <div className='inforchart'>
        <Provider store={store}>
        {/* <button >click me</button> */}
          <ComponentA></ComponentA>
          <ComponentB></ComponentB>
        </Provider>
      </div >

  )
}
