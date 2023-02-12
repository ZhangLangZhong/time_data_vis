import React, { useEffect, useState } from 'react'
import PubSub from 'pubsub-js'
import './MatrixChart.css'
import useSyncCallback from '../../MyHooks/useSyncCallback'
import * as echarts from 'echarts'

export default function MatrixChart() {

  const [MatrixChartData, setMatrixChartData] = useState([])
  const [indexInfoNums, setindexInfoNums] = useState([])
  const [indexXYNums, setindexXYNums] = useState([])
  const [linksArray, setlinksArray] = useState([])
  const [initLinks, setinitLinks] = useState(true)
  const [nowLinks, setnowLinks] = useState([])

  useEffect(() => {
    PubSub.subscribe('centerNodes', (msg, data) => {
      setMatrixChartData(MatrixChartData => data)
    })
    PubSub.subscribe('indexInfo', (msg, data) => {
      setindexInfoNums(indexInfoNums => data)
    })
    PubSub.subscribe('indexXY', (msg, data) => {
      setindexXYNums(indexXYNums => data)
    })
    if (MatrixChartData.length != 0) {
      drawMatrixChart()
      // console.log(MatrixChartData);
    }
  }, [MatrixChartData])

  function drawMatrixChart() {
    var chartDom = document.getElementById('matrixChartGraph');
    var myChart = echarts.init(chartDom);

    // console.log(indexInfoNums);
    // console.log(indexXYNums);
    var changeIndex = []
    for (let index = 0; index < indexXYNums.length; index++) {
      // const element = array[index];
      // console.log(index);
      // console.log(indexXYNums[index]);
      let value = { "index": index, "data": indexXYNums[index] }
      changeIndex.push(value)
    }
    // console.log(changeIndex);

    let hashchangeIndex = new HashTable()
    changeIndex.map((d) => {
      hashchangeIndex.add(d.data, d.index)
    })

    for (let i = 0; i < indexInfoNums.length; i++) {
      // console.log(indexInfoNums[i]);
      for (let j = 0; j < indexInfoNums[i].length - 1; j++) {
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
            width: 2,
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
          fontSize: 0
        },
        zlevel: -1
      }]
    };

    option && myChart.setOption(option);

    // 第一次把index换成实际社区关系
    // if (initLinks) {
    for (let i = 0; i < indexInfoNums.length; i++) {
      let value = { 'tar': xNames[indexInfoNums[i][0]], 'sou': yNames[indexInfoNums[i][1]], 'val': indexInfoNums[i][2] }
      setlinksArray(linksArray => [...linksArray, value])
        // tar sou val 就是linksarray
        // linksArray.push(value)
    }
    // }
    sendLinksArray()
  }

  // 建立哈希表索引
  const sendLinksArray = useSyncCallback(() => {
    // let temp 因为linksarray这里才能刷新 初始化linksmap
    // console.log(linksArray);
    if (initLinks) {
      let linksMap = new Map()
      for (let i = 0; i < linksArray.length; i++) {
        let keyLinks = String(linksArray[i]['tar']) +','+ String(linksArray[i]['sou'])
        // console.log(val);
        linksMap.set(keyLinks, linksArray[i]['val'])
      }
      setnowLinks(nowLinks => Array.from(linksMap))
      // console.log('linkssssArray',linksArray);
      // linksmap是map对象的实例 nowlinks是转义为数组的索引池
      PubSub.publishSync('linkssssArray', linksArray)
      setlinksArray(linksArray=>[])
    }

    sendLinksArray2()
    setinitLinks(initLinks => false)

  })

  
  const sendLinksArray2 = useSyncCallback(() => {
    // 时序开始 先把初始值给到
    if (!initLinks) {
      // console.log('linksArray',linksArray);
      let linksMap2 = new Map()
      for(let i = 0;i<nowLinks.length;i++){
        linksMap2.set(nowLinks[i][0],nowLinks[i][1])
      }
      // console.log(Array.from(linksMap));

      for (let i = 0; i < linksArray.length; i++) {
        let keyLinks = String(linksArray[i]['tar']) +','+ String(linksArray[i]['sou'])

        if(linksMap2.has(keyLinks)){
          // 继承旧的
          let temp = []
          // console.log(keyLinks);
          // console.log(linksMap2.has(keyLinks));
          // console.log('999999999999',linksMap2.get(keyLinks))
          // console.log('linksMap2.values(keyLinks)',linksMap2.values(keyLinks))
          for(let j = 0;j<linksMap2.get(keyLinks).length;j++){
            temp.push(linksMap2.get(keyLinks)[j])
          }
          // temp.concat(linksMap2.get(keyLinks))
          // console.log(tempArray);
          // console.log('linksMap.get(keyLinks)',linksMap.get(keyLinks));
          // let temp = [].concat(tempArray)
          // temp.push(linksMap.get(keyLinks))
          // temp.push(linksMap.get(keyLinks))
          // console.log(linksArray[i]['val']);
          // 加入新的
          temp.push(linksArray[i]['val'])
          // console.log(temp);
          linksMap2.set(keyLinks,temp)
        }else{
          linksMap2.set(keyLinks,linksArray[i]['val'])
          let value = {'tar':linksArray[i]['tar'],'sou':linksArray[i]['sou'],'val':linksArray[i]['val']}
          // console.log('262662626262',value);
          setlinksArray(linksArray=>[...linksArray,value])
        }
      }

      let nowTemp = Array.from(linksMap2)
      // 更新nowLinks
      setnowLinks(nowLinks=>Array.from(linksMap2))

      let finalLinks = []
      for(let i = 0;i<nowTemp.length;i++){
        // console.log(nowTemp);
        let tar = nowTemp[i][0].split(',')[0]
        let sou = nowTemp[i][0].split(',')[1]
        let value = {'tar':Number(tar),'sou':Number(sou),'val':nowTemp[i][1]}
        finalLinks.push(value)
      }
      setlinksArray(linksArray=>finalLinks)
      finalSend()
    }
  })

  const finalSend = useSyncCallback(() => {
    // console.log(linksArray);
    // console.log(nowLinks);
    PubSub.publishSync('linkssssArray', linksArray)
    setlinksArray(linksArray=>[])
  })


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
