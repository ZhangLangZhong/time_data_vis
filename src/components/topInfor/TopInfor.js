import React, { useEffect, useState, createContext} from 'react'
import './TopInfor.css'
import axios from 'axios'
import PubSub from 'pubsub-js'


export default function TopInfor() {


    const [currentTime, setCurrentTime] = useState(0);

    const currentTimeNow = () => {
        let date = FormatDateTime((new Date()))
        // console.log('dateNOWis:'+date);
        return date
    }

    const FormatDateTime = (date) => {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    }

    // console.log("   TopInfor");

    // 更新两次
    useEffect(() => {
        axios.get(`http://localhost:3000/api/initial`).then(res => {
            setCurrentTime(currentTimeNow)
            const { packages } = res.data
            packages.forEach((every) => {
                every.date = new Date(every.date)
                every.value = +every.value;
            })
            PubSub.publish("initialTimeData",packages)
        })
    }, [])

    return (
        <div id='header'>
            <span className='title'>TimeSliceVis Visualization ystem</span>
            <span className='time'>{currentTime}</span>
        </div>
        
    )
}
