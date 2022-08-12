import React, { useEffect, useState } from 'react'
import './TopInfor.css'
import axios from 'axios'


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

    console.log("   TopInfor");

    // 更新两次
    useEffect(() => {
        axios.get(`http://localhost:3000/api/initial`).then(res => {
            setCurrentTime(currentTimeNow)
            const { packages } = res.data
            // console.log(packages);
            console.log("TopInfor+2");
            packages.forEach((every) => {
                every.date = new Date(every.date)
                every.value = +every.value;
            })

        })
    }, [])

    return (
        <div id='header'>
            <span className='title'>时序数据分析可视化系统</span>
            <span className='time'>{currentTime}</span>
        </div>
    )
}
