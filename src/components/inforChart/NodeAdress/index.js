import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts'
import PubSub from 'pubsub-js'
import './index.css'

export default function NodeAdress() {


    useEffect(()=>{
        drawLine()
    })


    function drawLine(){
        var myChart = echarts.init(document.getElementById('nodeAdress'));
        // console.log(myChart)
        const option = {
            xAxis: {
                type: 'category',
                data: ['4.50', '4.55', '5.00', '5.05', '5.10', '5.15', '5.20']
            },
            title: {
                left: 'left',
                text: '节点位置变化',
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
                    data: [7.5, 3.1, 8.6, 9.5, 6.8, 7.4, 5.1],
                    type: 'line'
                }
            ]
        };

        myChart.setOption(option);
    }

    return (
        <div id='nodeAdress'>
            {/* <h2>节点社区</h2> */}
        </div>
    )
}
