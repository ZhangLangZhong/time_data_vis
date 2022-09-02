
const initState = {
    value:'default'
}
const reducer = (state = initState,action) => {
    // console.log('reducer**************:',state,action)
    switch(action.type){
        case 'send_type':
            return Object.assign({},state,action);
        default:
            break;
    }
};

module.exports = {
    reducer
}