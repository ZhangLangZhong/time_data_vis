import React from 'react'
import MainLayout from '../../components/mainLayout/MainLayout'
import TimeLineChart from '../../components/timeLineChart/TimeLineChart'
import TopInfor from '../../components/topInfor/TopInfor'


export default function mainView() {
    console.log(" mainView");
  return (
    <div>
        Mainview...
        <MainLayout/>
        <TopInfor/>
        <TimeLineChart></TimeLineChart>
    </div>
  )
}
