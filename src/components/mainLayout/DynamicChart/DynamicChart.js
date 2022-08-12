import React, { useEffect, useState,useContext } from 'react'
import { Button } from 'antd';
import axios from 'axios'

export default function DynamicChart({ FDT, NLT }) {

    const [buttonOpen, setbuttonOpen] = useState(false)
    const [nowTimeData,setnowTimeData] = useState(0)


    useEffect(() => {
        
        if (buttonOpen) {
            const timer = setInterval(() => {
                axios({
                    method: 'get',
                    url: 'http://localhost:3000/api/brush_extent',
                    params: {
                        "layout_type": NLT,
                        "start": FDT(new Date('2015-4-23 16:45')),
                        "end": FDT(new Date('2015-4-23 16:50'))
                    }
                }).then(res => {
                    console.log(res.data);
                })
            }, 1200)
            return () => clearInterval(timer)
        }
    }, [buttonOpen])

    return (
        <div>
            <div className='playButton'>
                <Button type="primary" onClick={() => setbuttonOpen(!buttonOpen)}>Primary111 </Button>
            </div>
        </div>
    )
}
