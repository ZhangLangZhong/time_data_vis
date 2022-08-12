import React, { useEffect, useState,useContext, useCallback } from 'react'
import { Button } from 'antd';
import axios from 'axios'
import PubSub from 'pubsub-js'

export default function DynamicChart({ FDT, NLT }) {

    const [buttonOpen, setbuttonOpen] = useState(false)
    const [nowTimeData,setnowTimeData] = useState(0)
    const [init_data_line,setinit_data_line] = useState([])

    useEffect(() => {
        PubSub.subscribe("initialTimeData",(msg,data)=>{
            setinit_data_line(data)
        })
        if (buttonOpen) {
            const timer = setInterval(() => {
                // setnowTimeData(nowTimeData + 1)
                setnowTimeData(nowTimeData + 1)
                // console.log(nowTimeData);
                // console.log(init_data_line[nowTimeData].date)

                axios({
                    method: 'get',
                    url: 'http://localhost:3000/api/brush_extent',
                    params: {
                        "layout_type": NLT,
                        "start": FDT(init_data_line[nowTimeData].date),
                        "end": FDT(init_data_line[nowTimeData+1].date)
                    }
                }).then(res => {
                    // console.log(res.data);
                    let timeData = FDT(init_data_line[nowTimeData].date)
                    drawDynamicChart(res.data,timeData)
                })
            }, 1200)
            return () => clearInterval(timer)
        }
    }, [buttonOpen,nowTimeData])

    function drawDynamicChart(updateData,timeDate){
        console.log(updateData);
    }

    return (
        <div>
            <div className='playButton'>
                <Button type="primary" onClick={() => setbuttonOpen(!buttonOpen)}>Primary111 </Button>
            </div>
        </div>
    )
}
