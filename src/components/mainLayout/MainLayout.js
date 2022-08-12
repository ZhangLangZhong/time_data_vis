import axios from 'axios'
import { Button } from 'antd';
import React, { useEffect, useRef, useContext, useState, useLayoutEffect } from 'react'
import { withRouter } from 'react-router'
import './mainLayout.css'
import FormatDateTime from '../topInfor/TopInfor'
import InitChart from './InitChart/InitChart'
function MainLayout() {

    // console.log("   MainLayout");
    // var box = document.getElementsByClassName("mainLayout")
    // console.log(box)
    // console.log(box[0].clientWidth);
    // var height = box[0].clientWidth
    // var width = box[0].clientWidth
    // console.log(height);
    // const [divHeight, setdivHeight] = useState()
    // const [divWidth, setdivWidth] = useState()
    // function getSize() {
    //     var box = document.getElementsByClassName("mainLayout")
    //     // setdivHeight(box[0].offsetHeight)
    //     // setdivWidth(box[0].offsetWidth)
    //     height = box[0].offsetHeight
    //     width = box[0].offsetWidth
    //     // console.log(height);
    //     // InitChart(height, width)
    // }
    // console.log(height);

    return (
        <div className='mainLayout'>
            <InitChart></InitChart>
            <div className='playButton'>
                <Button type="primary">Primary </Button>
            </div>
        </div>
    )
}

export default withRouter(MainLayout)