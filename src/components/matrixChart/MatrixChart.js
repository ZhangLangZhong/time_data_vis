import React, { useEffect, useState } from 'react'
import PubSub from 'pubsub-js'
import './MatrixChart.css'
import * as echarts from 'echarts'

export default function MatrixChart() {

  const [MatrixChartData,setMatrixChartData] = useState([])
  const [indexInfoNums,setindexInfoNums] = useState([])
  const [indexXYNums,setindexXYNums] = useState([])

  useEffect(() => {
    PubSub.subscribe('centerNodes',(msg,data)=>{
      setMatrixChartData(MatrixChartData=>data)
    })
    PubSub.subscribe('indexInfo',(msg,data)=>{
      setindexInfoNums(indexInfoNums=>data)
    })
    PubSub.subscribe('indexXY',(msg,data)=>{
      setindexXYNums(indexXYNums=>data)
    })
    if(MatrixChartData.length != 0){
      drawMatrixChart()
      // console.log(MatrixChartData);
    }
  }, [MatrixChartData])

  function drawMatrixChart(){
    var chartDom = document.getElementById('matrixChartGraph');
    var myChart = echarts.init(chartDom);

    console.log(indexInfoNums);
    console.log(indexXYNums);
    var changeIndex = []
    for (let index = 0; index < indexXYNums.length; index++) {
      // const element = array[index];
      // console.log(index);
      // console.log(indexXYNums[index]);
      let value = {"index":index,"data":indexXYNums[index]}
      changeIndex.push(value)
    }
    console.log(changeIndex);

    let hashchangeIndex = new HashTable()
    changeIndex.map((d)=>{
      hashchangeIndex.add(d.data,d.index)
    })

    for (let i = 0; i < indexInfoNums.length; i++) {
      // console.log(indexInfoNums[i]);
      for (let j = 0; j < indexInfoNums[i].length-1; j++) {
        // console.log(indexInfoNums[i][0])
        // console.log(typeof( hashchangeIndex.getValue(indexInfoNums[i][0]) ) )   
        indexInfoNums[i][j] = hashchangeIndex.getValue(indexInfoNums[i][j])
      }    
    }
    // console.log(indexInfoNums);




    var yNames = indexXYNums
    // yNames = yNames.reverse()
    // var xNames = ["2020年", "2019年", "2018年", "2017年", "2016年", "2015年","2020年", "2019年", "2018年", "2017年", "2016年", "2015年"]
    var xNames = indexXYNums
    var data = [
      [0, 0, 1],
      [1, 0, 80],
      [2, 0, 1],
      [3, 0, 40],
      [4, 0, 40],
      [5, 0, 40],
      [6, 0, 40],
      [7, 0, 80],
      [8, 0, 40],
      [0, 1, 80],
      [1, 1, 10],
      [2, 1, 80],
      [3, 1, 132],
      [4, 1, 60],
      [5, 1, 2],
      [6, 1, 60],
      [7, 1, 80],
      [8, 1, 60],
      [0, 2, 32],
      [1, 2, 91],
      [2, 2, 120],
      [3, 2, 30],
      [4, 2, 70],
      [5, 2, 80],
      [6, 2, 80],
      [7, 2, 2],
      [8, 2, 3],
      [0, 3, 47],
      [1, 3, 32],
      [2, 3, 20],
      [3, 3, 130],
      [4, 3, 60],
      [5, 3, 70],
      [6, 3, 80],
      [7, 3, 90],
      [8, 3, 110],
      [0, 4, 91],
      [1, 4, 38],
      [2, 4, 2],
      [3, 4, 5],
      [4, 4, 66],
      [5, 4, 21],
      [6, 4, 60],
      [7, 4, 10],
      [8, 4, 90],
      [0, 5, 22],
      [1, 5, 111],
      [2, 5, 110],
      [3, 5, 39],
      [4, 5, 40],
      [5, 5, 90],
      [6, 5, 50],
      [7, 5, 60],
      [8, 5, 2],
    ];

    var option = {
      
      backgroundColor: "#fff",
      xAxis: {
        // position: 'top',
        type: 'category',
        data: xNames,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: "#4B4B4B",
          fontSize: 5
        },
        
        splitLine: {
          show: true,
          lineStyle: {
            color: "#fff", //同背景色
            width: 2,
          },
        },
      },
      yAxis: {
      
        type: 'category',
        data: yNames,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: "#4B4B4B",
          fontSize: 5
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#fff", //同背景色
            width:2,
          },
        },
      },
      visualMap: {
        min: 0,
        max: 5,
        calculable: false,

        orient: 'vertical',

        bottom: '5%',

        top: '30%',
        right: '3%',
        text: ['高', '低'],

        inRange: {
          color: ['#FF9966', '#60BDCB', '#ff2121'],
        },
        textStyle: {
          color: "#4B4B4B"
        }
      },
      series: [{
        // name: '交易数据',
        type: 'heatmap',
        data: indexInfoNums,
        label: {
          show: true,
          fontSize:0
        },
        zlevel: -1
      }]
    };

    option && myChart.setOption(option);

  }

  function HashTable() {
    var size = 0;
    var entry = new Object();
    this.add = function (key, value) {
      if (!this.containsKey(key)) {
        size++;
      }
      entry[key] = value;
    }
    this.getValue = function (key) {
      return this.containsKey(key) ? entry[key] : null;
    }
    this.remove = function (key) {
      if (this.containsKey(key) && (delete entry[key])) {
        size--;
      }
    }
    this.containsKey = function (key) {
      return (key in entry);
    }
    this.containsValue = function (value) {
      for (var prop in entry) {
        if (entry[prop] == value) {
          return true;
        }
      }
      return false;
    }
    this.getValues = function () {
      var values = new Array();
      for (var prop in entry) {
        values.push(entry[prop]);
      }
      return values;
    }
    this.getKeys = function () {
      var keys = new Array();
      for (var prop in entry) {
        keys.push(prop);
      }
      return keys;
    }
    this.getSize = function () {
      return size;
    }
    this.clear = function () {
      size = 0;
      entry = new Object();
    }
  }


  return (
    <div id='matrixChart'>
      <div id='matrixChartGraph'></div>
    </div>
  )
}
