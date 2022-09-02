import React, { useEffect } from 'react'
import './InforChart.css'
import { sendAction } from '../../redux/action';

import store from '../../redux/store';
import { Provider } from 'react-redux'
import ComA from './comA';
import ComB from './comB';

export default function InforChart() {

  // const handleClick = () => {
  //   const action = sendAction()
  //   // 发送action
  //   store.dispatch(action)
  // }

  // useEffect(()=>{
  //   store.subscribe(()=>{
  //     console.log('subscribe',store.getState())
  //   })
  // },[])


  return (
    <Provider store={store}>
      <div className='inforchart'>
        {/* inforchart */}
        <ComA></ComA>
        <ComB></ComB>
      </div >
    </Provider>
    


  )
}
