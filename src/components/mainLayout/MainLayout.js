// import axios from 'axios'
import { Button } from 'antd';
import React, { useEffect, useRef,useContext, useState, useLayoutEffect } from 'react'
import { withRouter } from 'react-router'
import InitChart from './InitChart/InitChart';
import './mainLayout.css'

function MainLayout() {
    
    console.log("   MainLayout");

    const [divHeight,setdivHeight] = useState()
    const [divWidth,setdivWidth] = useState()

    // 更新两次
    // useEffect(()=>{
    //     var box = document.getElementsByClassName("mainLayout")
    //     // console.log(box[0].offsetHeight);
    //     setdivHeight(box[0].offsetHeight)
    //     setdivWidth(box[0].offsetWidth)
    // },[])

    useLayoutEffect(()=>{
        var box = document.getElementsByClassName("mainLayout")
        // console.log(box[0].offsetHeight);
        setdivHeight(box[0].offsetHeight)
        setdivWidth(box[0].offsetWidth)
    })
    // console.log(divHeight);

    return (
        <div className='mainLayout'>
            <InitChart props={{divHeight,divWidth}}></InitChart>
            mainLayout...
            <div className='playButton'>
                <Button type="primary">Primary </Button>
            </div>
        </div>
    )
}

export default withRouter(MainLayout)