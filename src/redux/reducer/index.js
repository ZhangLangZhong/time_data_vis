
const initState = {
    value:'default'
}
const reducer = (state = initState,action) => {
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