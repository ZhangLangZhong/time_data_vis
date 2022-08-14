import React, { useEffect, useState } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'
import './MatrixChart.css'

export default function MatrixChart() {

  const [MatrixInit,setMatrixInit] =  useState([])

  console.log("MatrixChart");
  useEffect(()=>{
    console.log("MatrixChart  useEffect");
    PubSub.subscribe('layoutNodes',(msg,data)=>{
        setMatrixInit(MatrixInit=>data)
    })
    // console.log(MatrixInit);
    if (MatrixInit.length != 0) {

      var jsonForHAC = JSON.stringify(MatrixInit)
      axios({
        method: 'get',
        url: 'http://localhost:3000/api/element_position',
        params: {
            "nodeInformation":jsonForHAC,
        }
    }).then(res => {
        console.log(res.data);
    })
    }
  },[MatrixInit])

  return (
    <div className='matrixChart'>
        {/* matrixChart... */}
    </div>
  )
}
