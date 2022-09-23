import React, { useEffect, useLayoutEffect, useState } from 'react'
import './InforChart.css'
import { sendAction } from '../../redux/action';
import store from '../../redux/store';

import  ComponentA  from './componentA';
// import { Provider } from 'react-redux'


export default function InforChart() {

  const [nowtype,setNowtype] = useState(100)

  const handleClick = ()=>{
    const action = sendAction()
    store.dispatch(action)
  }

  useLayoutEffect(()=>{
    store.subscribe(()=>{
      // console.log('subscribe',store.getState())
      setNowtype(store.getState().value)
    })
  },[])

  return (
      <div className='inforchart'>
        <button onClick={handleClick}>click me</button>
        <ComponentA></ComponentA>
      </div >

  )
}
