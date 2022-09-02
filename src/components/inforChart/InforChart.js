import React, { useEffect } from 'react'
import './InforChart.css'
import { sendAction } from '../../redux/action';
import store from '../../redux/store';
import ComA from './comA';


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
    <div className='inforchart'>
      {/* inforchart */}
      <ComA></ComA>
    </div>


  )
}
