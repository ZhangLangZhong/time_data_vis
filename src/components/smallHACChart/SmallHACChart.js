import React, { useEffect, useState } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'
import * as d3 from 'd3'
import useSyncCallback from '../../MyHooks/useSyncCallback'
import './SmallHACChart.css'

export default function SmallHACChart() {

  const [MatrixInit, setMatrixInit] = useState([])
  const [axhacNodes,setaxhacNodes] = useState([])
  const [relatLinks,setrelatLinks] = useState([])
  const [centerNodesState,setcenterNodesState] = useState([])
  const [HashFinalNodesState,setHashFinalNodesState] = useState([])

  console.log("smallChart");
  useEffect(() => {
    // console.log("smallChart  useEffect");
    PubSub.subscribe('layoutNodes', (msg, data) => {
      setMatrixInit(MatrixInit => data)
    })
    PubSub.subscribe('hacNodes', (msg, data) => {
      setaxhacNodes(axhacNodes => data)
    })
    // console.log(axhacNodes);
    if (MatrixInit.length != 0) {

      var jsonForHAC = JSON.stringify(MatrixInit)
      var perNodeInfor = JSON.stringify(axhacNodes)
      axios({
        method: 'get',
        url: 'http://localhost:3000/api/element_position',
        // url: 'http://localhost:3000/api/testHAC',

        params: {
          "nodeInformation": jsonForHAC,
          "perNodeInformation":perNodeInfor
        }
      })
        .then(res => {
          // console.log(res.data);
          let jsonNodes = JSON.parse(res.data)
          drawHACTimeGraph(jsonNodes.nodes)
        })
    }
  }, [MatrixInit])

  function drawHACTimeGraph(hacNodes) {
    // console.log(hacNodes);
    PubSub.publishSync('hacNodes',hacNodes)

    let socialHac = []
    let hashHacNodes = new HashTable()
    hacNodes.forEach(d => {
      hashHacNodes.add(d.id, d)
    })
    // console.log(hashHacNodes.getValues());
    hacNodes.map(mapItem => {
      if (socialHac.length == 0) {
        socialHac.push({ index: mapItem.index, List: [mapItem] })
      } else {
        //有相同社区的就添加到当前项
        let socialHacIndex = socialHac.some(item => {
          if (item.index == mapItem.index) {
            item.List.push(mapItem)
            return true
          }
        })
        //没找到同一个社区再添加一个对象
        if (!socialHacIndex) {
          socialHac.push({ index: mapItem.index, List: [mapItem] })
        }
      }
    })
    let centerNodes = []

    PubSub.publishSync('socialHac',socialHac)
    // console.log(hacNodes);
    // 社区内部有几个点
    // console.log(socialHac);

    let indexInfo = []
    let indexXY = []
    socialHac.forEach(d => {
      /**
       * part1 求中心点的坐标位置
       * @type {number}
       */
      let HacCenterNode_X = 0
      let HacCenterNode_Y = 0
      let indexNum = []
      

      d.List.forEach(socialNode => {
        HacCenterNode_X += socialNode.x
        HacCenterNode_Y += socialNode.y
        for (let i = 0; i < socialNode.links.length; i++) {
          //如果这个links的index也在父节点的社区 则不管他 因为是同一个社区的
          if (hashHacNodes.getValue(socialNode.links[i]).index == d.index) {
            continue
          }
          else if (indexNum.indexOf(hashHacNodes.getValue(socialNode.links[i]).index) == 0) {
            continue
          }
          else {
            indexNum.push(hashHacNodes.getValue(socialNode.links[i]).index)
          }
        }
      })

      indexXY.push(d.index)

      // console.log(indexNum)
      for(let index in getEleNums(indexNum)){
        // console.log(index);
        let indexValue = [d.index,Number(index),getEleNums(indexNum)[index]]
        indexInfo.push(indexValue)
      }
      
      let indexFinal = unique(indexNum)
      let center_x = HacCenterNode_X / d.List.length/1.866
      let center_y = HacCenterNode_Y / d.List.length/2
      let value = { "index": d.index, "x": center_x, "y": center_y, "indexLinks": indexFinal }
      centerNodes.push(value)
    })

    PubSub.publishSync("indexXY",indexXY)

    PubSub.publishSync("indexInfo",indexInfo)

    PubSub.publishSync("centerNodes",centerNodes)

    let HashFinalNodes = new HashTable()
    centerNodes.forEach(d => {
      HashFinalNodes.add(d.index, d)
    })
    // console.log(indexInfo);
    // console.log(centerNodes);
    // console.log(HashFinalNodes);


    PubSub.subscribe('linkssssArray',(msg,data)=>{
      setrelatLinks(relatLinks=>data)
    })



    // console.log('1234141241',relatLinks)

    // const tempdraw = useSyncCallback(() => {
    //   console.log(relatLinks)
    // })
    tempdraw()
    setcenterNodesState(centerNodesState=>centerNodes)
    setHashFinalNodesState(HashFinalNodesState=>HashFinalNodes)
    drawingHACGraph(centerNodes, HashFinalNodes)
  }

  const tempdraw = useSyncCallback(() => {
    // console.log('1234141241',relatLinks)
    drawingHACGraph(centerNodesState, HashFinalNodesState)
  })

  
  

  function drawingHACGraph(centerNodes, HashFinalNodes) {
    d3.select(".smallChart").select("svg").remove();

    let getSVG = document.getElementsByClassName('smallChart')
    let width = getSVG[0].clientWidth 
    let height = getSVG[0].clientHeight 

    var svg = d3.select(".smallChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)


    for (let i = 0; i < centerNodes.length; i++) {
      svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(centerNodes[i].indexLinks).enter()
        .append("line")
        .attr("class", "link")
        // .attr("stroke", 10)
        .attr("x1", centerNodes[i].x)
        .attr("y1", centerNodes[i].y)
        .attr("x2", d => {
          return HashFinalNodes.getValue(d).x
        })
        .attr("y2", d => {
          return HashFinalNodes.getValue(d).y
        })
        .attr("stroke", "gray")
        .attr("stroke-width",function(d){
          // console.log(HashFinalNodes.getValue(d))
          return 0.5 + 0.5*HashFinalNodes.getValue(d).indexLinks.length
        })
    }

    svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(centerNodes).enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", function(d){
        // console.log(d)
        return 5 + 0.8*d.indexLinks.length
      })
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      })
      .attr("id", function (d) {
        return d.id;
      })
      .attr("fill", "blue")
      .attr("stroke", "blue")

  }

  function indexAlreadyHad(indexNum, allIndex) {

    var result = allIndex.some(item => {
      if (item) {
        return true
      }
    })

  }

  function unique(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (newArr.indexOf(arr[i]) === -1) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  function getEleNums(data) {
    var map = {}
    for (let i = 0; i < data.length; i++) {
        var key = data[i]
        if (map[key]) {
            map[key] += 1
        } else {
            map[key] = 1
        }
    }
    return map
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
    <div className='smallChart'>
    </div>
  )
}
