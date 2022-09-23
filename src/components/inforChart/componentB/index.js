import React from 'react'

import store from '../../../redux/store'
import { connect } from 'react-redux'

function ComponentB(props) {
  
  
    console.log(props)
    return (
    <div>
      {props.count}
    </div>
  )
}
const mapStateToProps =  state =>{
    // console.log('comb',state);
    return state
}


export default connect(mapStateToProps )(ComponentB)