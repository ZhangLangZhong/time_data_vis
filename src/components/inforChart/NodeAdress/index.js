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
                data: ['step9', 'step10', 'step11', 'step12', 'step13', 'step14', 'step15','step16','step17','step18']
            },
            title: {
                left: 'left',
                text: 'Model stability',
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
                    data: [0.46, 0.49, 0.53,0.48, 0.59,0.42, 0.45,0.42,0.49,0.41],
                    type: 'line',
                    lineStyle:{
                        color:'#80AFBF'
                    }
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
