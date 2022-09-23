import {legacy_createStore as createStore} from 'redux'


import { reducer } from '../reducer'

const store  = createStore(reducer);

// console.log(store) 
export default store