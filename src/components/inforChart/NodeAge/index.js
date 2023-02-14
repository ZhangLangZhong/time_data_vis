import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts'
import PubSub from 'pubsub-js'
import './index.css'

export default function NodeAge() {


    useEffect(()=>{
        drawLine()
    })


    function drawLine(){
        var myChart = echarts.init(document.getElementById('nodeAge'));
        // console.log(myChart)
        const option = {
            xAxis: {
                type: 'category',
                data: ['step9', 'step10', 'step11', 'step12', 'step13', 'step14', 'step15','step16','step17','step18']
            },
            title: {
                left: 'left',
                text: 'Node important',
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
                    data: [0.021,0.024,0.027,0.025,0.023,0.020,0.018,0.017,0.015,0.013],
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
        <div id='nodeAge'>
            {/* <h2>节点社区</h2> */}
        </div>
    )
}
