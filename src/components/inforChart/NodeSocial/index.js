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
                data: ['step9', 'step10', 'step11', 'step12', 'step13', 'step14', 'step15','step16','step17','step18']
            },
            title: {
                left: 'left',
                text: 'cluster move',
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
                    data: [0.2,0.3,0.2,0.3,0.4,0.3,0.2,0.1,0.1],
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
        <div id='nodeSocial'>
            {/* <h2>节点社区</h2> */}
        </div>
    )
}
