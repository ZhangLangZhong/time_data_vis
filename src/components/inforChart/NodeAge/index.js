import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts'
import PubSub from 'pubsub-js'
import './index.css'

export default function NodeAge() {

    // // console.log(props.props)
    // const[nowbool,setnowbool] = useState(false)



    // useEffect(() => {
    //     PubSub.subscribe('ischecked',(msg,data)=>{
    //         setnowbool(data)
    //     })
    //     drawNodeAge()
    // }, [])



    // function drawNodeAge() {

    useEffect(()=>{
        var myChart = echarts.init(document.getElementById('nodeAge'));
        // console.log(myChart)
        const option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: 'line'
                }
            ]
        };

        myChart.setOption(option);
    })


    return (
        <div id='nodeAge'>
            
        </div>
    )
}
