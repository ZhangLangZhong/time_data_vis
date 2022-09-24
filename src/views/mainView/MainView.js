import React from 'react'
import MainLayout from '../../components/mainLayout/MainLayout'
import TimeLineChart from '../../components/timeLineChart/TimeLineChart'
import TopInfor from '../../components/topInfor/TopInfor'
import SmallHACChart from '../../components/smallHACChart/SmallHACChart'
import MatrixChart from '../../components/matrixChart/MatrixChart'
import InforChart from '../../components/inforChart/InforChart'
import SortedChart from '../../components/SortedChart/SortedChart'
import { sendAction } from '../../redux/action';
import store from '../../redux/store';
import { Provider } from 'react-redux';
import { Connect } from 'react-redux';

export default function mainView() {
  console.log(" mainView");
  return (
    <div>
      <Provider store = {store}>
        <MainLayout />
        <TopInfor />
        <TimeLineChart></TimeLineChart>
        <SmallHACChart></SmallHACChart>
        <MatrixChart></MatrixChart>
        <InforChart></InforChart>
        <SortedChart></SortedChart>
      </Provider>
    </div>
  )
}
