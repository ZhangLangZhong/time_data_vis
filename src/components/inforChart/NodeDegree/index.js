import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts'
import PubSub from 'pubsub-js'
import './index.css'

export default function NodeDegree() {


    useEffect(()=>{
        drawLine()
    })


    function drawLine(){
        var myChart = echarts.init(document.getElementById('nodeDegree'));
        // console.log(myChart)
        const option = {
            xAxis: {
                type: 'category',
                data: ['step9', 'step10', 'step11', 'step12', 'step13', 'step14', 'step15','step16','step17','step18']
            },
            title: {
                left: 'left',
                text: 'centroid change',
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
                    data: [18.35,12.54,7.56,2.16,3.49,28.34,16.59,8.54,4.35,3.29,2.51],
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
        <div id='nodeDegree'>
            {/* <h2>节点社区</h2> */}
        </div>
    )
}
