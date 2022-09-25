import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts'
import PubSub from 'pubsub-js'
import './index.css'

export default function NodeSocial() {


    useEffect(()=>{
        drawLine()
    })


    function drawLine(){
        var myChart = echarts.init(document.getElementById('nodeSocial'));
        // console.log(myChart)
        const option = {
            xAxis: {
                type: 'category',
                data: ['4.50', '4.55', '5.00', '5.05', '5.10', '5.15', '5.20']
            },
            title: {
                left: 'left',
                text: '节点社区',
                textStyle:{
                    fontSize:13,
                },
              },
            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                      fontSize: "8",
                    },
                }        


            },
            series: [
                {
                    data: [2, 2, 2, 2, 2, 3, 3],
                    type: 'line'
                }
            ]
        };

        myChart.setOption(option);
    }

    return (
        <div id='nodeSocial'>
            {/* <h2>节点社区</h2> */}
        </div>
    )
}
