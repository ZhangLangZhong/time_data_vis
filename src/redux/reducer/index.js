
// const initState = {
//     value:'默认值'
// }

// const reducer = (state = initState,action)=>{

//     // console.log('reducer',state,action)
//     switch(action.type){
//         case 'send_type':
//             return Object.assign({},state,action);
//         default:
//             return state
//     }
// }

// module.exports = {
//     reducer
// }

const initState = {
    count:0
}

exports.reducer = (state = initState,action) =>{
    switch(action.type){
        case 'add_action':
            return {
                count: state.count + 1
            };
        default:
            break;
    }
    return state
}