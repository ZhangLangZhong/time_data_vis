import axios from 'axios'
// import { Button } from 'antd';
import React, { useEffect, useRef, useContext, useState, useLayoutEffect } from 'react'
import { withRouter } from 'react-router'
import './mainLayout.css'
import FormatDateTime from '../topInfor/TopInfor'
import InitChart from './InitChart/InitChart'
import DynamicChart from './DynamicChart/DynamicChart';
function MainLayout() {

    const now_layout_type = 'incremental'
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

    return (
        <div className='mainLayout'>
            <InitChart FDT = {FormatDateTime} NLT={now_layout_type}></InitChart>
            <DynamicChart FDT = {FormatDateTime} NLT={now_layout_type}></DynamicChart>
        </div>
    )
}

export default withRouter(MainLayout)