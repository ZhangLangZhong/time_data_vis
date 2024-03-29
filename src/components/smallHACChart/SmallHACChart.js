import React, { useEffect, useState } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'
// import * as d3 from 'd3'
import * as d3 from 'd3'
import useSyncCallback from '../../MyHooks/useSyncCallback'
import './SmallHACChart.css'

export default function SmallHACChart() {

  const [MatrixInit, setMatrixInit] = useState([])
  const [axhacNodes, setaxhacNodes] = useState([])
  const [relatLinks, setrelatLinks] = useState([])
  const [centerNodesState, setcenterNodesState] = useState([])
  const [HashFinalNodesState, setHashFinalNodesState] = useState([])

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
          "perNodeInformation": perNodeInfor
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
    PubSub.publishSync('hacNodes', hacNodes)

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

    PubSub.publishSync('socialHac', socialHac)
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
      for (let index in getEleNums(indexNum)) {
        // console.log(index);
        let indexValue = [d.index, Number(index), getEleNums(indexNum)[index]]
        indexInfo.push(indexValue)
      }

      let indexFinal = unique(indexNum)
      // let center_x = HacCenterNode_X / d.List.length / 1.866
      // let center_y = HacCenterNode_Y / d.List.length / 2
      let center_x = HacCenterNode_X / d.List.length 
      let center_y = HacCenterNode_Y / d.List.length
      let value = { "index": d.index, "x": center_x, "y": center_y, "indexLinks": indexFinal }
      centerNodes.push(value)
    })

    PubSub.publishSync("indexXY", indexXY)

    PubSub.publishSync("indexInfo", indexInfo)

    PubSub.publishSync("centerNodes", centerNodes)

    let HashFinalNodes = new HashTable()
    centerNodes.forEach(d => {
      HashFinalNodes.add(d.index, d)
    })
    // console.log(indexInfo);
    // console.log(centerNodes);
    // console.log(HashFinalNodes);


    PubSub.subscribe('linkssssArray', (msg, data) => {
      setrelatLinks(relatLinks => data)
    })



    // console.log('1234141241',relatLinks)

    // const tempdraw = useSyncCallback(() => {
    //   console.log(relatLinks)
    // })
    tempdraw()
    setcenterNodesState(centerNodesState => centerNodes)
    setHashFinalNodesState(HashFinalNodesState => HashFinalNodes)
    // drawingHACGraph(centerNodes, HashFinalNodes)
    let uniqueEdge = removeDuplicateEdges(relatLinks)
    setrelatLinks(relatLinks => uniqueEdge)
  }

  const tempdraw = useSyncCallback(() => {
    // console.log('1234141241',relatLinks)
    // console.log(relatLinks);
    // console.log(centerNodesState);

    drawingHACGraph(centerNodesState, HashFinalNodesState, relatLinks)
  })


  // 新版本
  function drawingHACGraph(centerNodes, HashFinalNodes, rectLinks) {
    d3.select(".smallChart").select("svg").remove();
    let getSVG = document.getElementsByClassName('smallChart')
    let width = getSVG[0].clientWidth
    let height = getSVG[0].clientHeight
    var svg = d3.select(".smallChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    var seq_max = 10;
    var seq_length = 10;
    var radius = 5
    var edge = 2
    var linkDistance = 5
    var manyBodyStrength = -30

    var area_x_scale;
    var area, area2;

    // var forceCenter = d3.forceCenter(width / 2, height / 2);
    // var forceManyBody = d3.forceManyBody(manyBodyStrength);
    // var simulation = d3.forceSimulation();
    // simulation.force("charge", forceManyBody)
    //   .force("link", forceLink)
    //   .force("center", forceCenter);

    // var forceLink = d3.forceLink();
    var hashLinkNode = new HashTable()
    // console.log(centerNodes);
    // console.log(centerNodesState);
    // console.log(rectLinks);
    centerNodes.forEach(d => {
      hashLinkNode.add(d.index, d)
    })
    // forceLink.distance(function (d) {
    //   return linkDistance;
    // });
    var x = d3.scaleBand().rangeRound([0, linkDistance - radius * 2]).padding(0.1),
      y = d3.scaleLinear().rangeRound([10, 0]);
    x.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    y.domain([0, 10]);



    var ticked = function () {
      links
        .attr("x1", function (d) {
          // console.log(d);
          return hashLinkNode.getValue(d.tar).x
        })
        .attr("y1", d => hashLinkNode.getValue(d.tar).y)
        .attr("x2", d => hashLinkNode.getValue(d.sou).x)
        .attr("y2", d => hashLinkNode.getValue(d.sou).y);

      nodes
        .attr("cx", function (d) {
          // console.log(d);
          return d.x
        })
        .attr("cy", d => d.y);

      path.attr("transform", function (d, i) {
        var source = hashLinkNode.getValue(d.tar)
        var target = hashLinkNode.getValue(d.sou)
        var radians = Math.atan2(-(target.y - source.y), (target.x - source.x));
        var degrees = radians * 180 / Math.PI;
        return 'translate(' + source.x + ',' + source.y + ') rotate(' + -degrees + ') translate(' + (radius / 1 + edge / 1) + ',' + (-seq_max - 2) + ')';
      });
    };

    var links = svg.selectAll(".linkA")
      .data(rectLinks)
      .enter()
      .insert("line")
      .attr("class", "linkA");

    var nodes = svg.selectAll(".nodeA")
      .data(centerNodes)
      .enter()
      .append("circle", "svg")
      .attr("class", "nodeA")
      .attr("r", radius)
      .style('stroke-width', edge / 1)

    // simulation.nodes(centerNodes);
    // forceLink.links(rectLinks);

    var path = svg
      .selectAll(".area")
      .data(rectLinks)
      .enter()
      .append('g')
      .attr("class", "area")
      .each(function (d, i) {

        var distance = additions(hashLinkNode.getValue(d.tar), hashLinkNode.getValue(d.sou))
        var longs = d.val.length
        // console.log(longs);
        var theDis = distance / (longs + 1)

        var x = d3.scaleBand().rangeRound([0, distance]).padding(0.1),
          y = d3.scaleLinear().rangeRound([10, 0]);
        x.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        y.domain([0, 10]);

        d3.select(this).
          selectAll('.rect')
          .data(d.val)
          .enter()
          .insert('rect')
          .attr('class', 'rect')
          .attr('x', function (d, i) {
            return x(i);
          })
          .attr('y', function (d, i) {
            return y(d);
          })
          .attr("width", x.bandwidth())
          .attr("height", function (d) {
            return 10 - y(d);
          });
      });
    // simulation.on("tick", ticked);
    ticked()


  }

  function additions(A, B) {
    // console.log((A.x-B.x)(A.x-B.x));
    return Math.sqrt((A.x - B.x) * (A.x - B.x) + (A.y - B.y) * (A.y - B.y))
  }
  // 老版本 2.12
  // function drawingHACGraph(centerNodes, HashFinalNodes, rectLinks) {
  //   d3.select(".smallChart").select("svg").remove();

  //   // 原版
  //   let getSVG = document.getElementsByClassName('smallChart')
  //   let width = getSVG[0].clientWidth
  //   let height = getSVG[0].clientHeight

  //   console.log(centerNodes);

  //   //原版 
  //   var svg = d3.select(".smallChart")
  //     .append("svg")
  //     .attr("width", width)
  //     .attr("height", height)


  //     console.log(centerNodes);
  //     console.log(rectLinks);

  //     // 原版
  //   for (let i = 0; i < centerNodes.length; i++) {
  //     svg.append("g")
  //       .attr("class", "links")
  //       .selectAll("line")
  //       .data(centerNodes[i].indexLinks).enter()
  //       .append("line")
  //       .attr("class", "link")
  //       // .attr("stroke", 10)
  //       .attr("x1", centerNodes[i].x)
  //       .attr("y1", centerNodes[i].y)
  //       .attr("x2", d => {
  //         return HashFinalNodes.getValue(d).x
  //       })
  //       .attr("y2", d => {
  //         return HashFinalNodes.getValue(d).y
  //       })
  //       .attr("stroke", "gray")
  //       .attr("stroke-width", function (d) {
  //         // console.log(HashFinalNodes.getValue(d))
  //         return 0.5 + 0.5 * HashFinalNodes.getValue(d).indexLinks.length
  //       })
  //   }



  //   svg.append("g")
  //     .attr("class", "nodes")
  //   //   // 原版
  //     .selectAll("circle")
  //     // .selectAll(".nodes")
  //     .data(centerNodes).enter()
  //     .append("circle")
  //     .attr("class", "node")
  //     .attr("r", function (d) {
  //       // console.log(d)
  //       return 5 + 0.8 * d.indexLinks.length
  //     })
  //     .attr("cx", function (d) {
  //       return d.x;
  //     })
  //     .attr("cy", function (d) {
  //       return d.y;
  //     })
  //     .attr("id", function (d) {
  //       return d.id;
  //     })
  //     .attr("fill", "blue")
  //     .attr("stroke", "blue")

  // }

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

  function removeDuplicateEdges(edges) {
    const uniqueEdges = [];
    const edgeMap = new Map();

    for (const edge of edges) {
      const edgeKey = `${edge.tar}-${edge.sou}`;
      const edgeKey2 = `${edge.sou}-${edge.tar}`;
      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, true);
        edgeMap.set(edgeKey2, true);
        uniqueEdges.push(edge);
      }
    }

    return uniqueEdges;
  }

  return (
    <div className='smallChart'>
    </div>
  )
}
