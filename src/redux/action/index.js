


const sendAction = (type,state)=>{
    // console.log(state)
    return {
        type:type,
        value:state
    }
}



module.exports = {sendAction};