import React, { useEffect, useLayoutEffect, useState } from 'react'


import store from '../../../redux/store'

export default function ComponetA() {

    const [nowtype1,setNowtype1] = useState(100)

    useLayoutEffect(()=>{
        store.subscribe(()=>{
          console.log('subsComponetAcribe',store.getState())
          setNowtype1(store.getState().value)
        })
    },[])


  return (
    <div>
      {'999'+nowtype1}
    </div>
  )
}
