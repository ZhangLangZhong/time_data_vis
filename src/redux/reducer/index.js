
const initState = {
    count:0
}

const reducer = (state = initState,action) =>{
    console.log('reducer',state,action)
    switch(action.type){
        case 'nodes_total':
            return action.value
        case 'edges_total':
            return action.value
        default:
            break;
    }
    return state
}
module.exports ={
    reducer
}