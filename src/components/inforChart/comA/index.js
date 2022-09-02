import React, { Component } from 'react'
import {connect} from 'react-redux'

class ComA extends Component {
  render() {
    return <button onClick={this.handleClick}> + </button>
  }
}

const handleClick = ()=>{
    console.log("ComA:",this.props)
}

const mapDispatchToProps = (dispatch)=>{
    return{
        sendAction:()=>{
            // 利用dispatch发送一个action
            // 要定义一个type属性
            dispatch({
                type:'add_action'
            })
        }
    }
}

export default connect(null,mapDispatchToProps)(ComA)
