import React, { useEffect, useLayoutEffect, useState } from 'react'
import { connect } from 'react-redux'


import store from '../../../redux/store'

function ComponetA(props) {

    // const [nowtype1,setNowtype1] = useState(50)

    // useLayoutEffect(()=>{
    //     store.subscribe(()=>{
    //       console.log('subsComponetAcribe',store.getState())
    //       setNowtype1(store.getState().value)
    //     }) 
    // },[])

    const handleClick = () => {
        // console.log('coma',props.sendAction)
        props.sendAction()
    }

    // console.log(connect)

    return (
        <button onClick={handleClick}> + </button>
    )
}

// 将action作为prop注入component
const mapDispatchToProps = dispatch => {
    return {
        // 本质是一个key value
        sendAction: () => {
            // 利用dispacth发送action
            dispatch({
                type: 'add_action'
            })
        }
    }
}



// 第一个参数接收 第二个参数传递 
export default connect(null, mapDispatchToProps)(ComponetA)
