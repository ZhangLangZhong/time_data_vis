import React, { useEffect, useState, useContext, useCallback, useRef, useReducer } from 'react'
import { Button } from 'antd';
import axios from 'axios'
import PubSub from 'pubsub-js'
import * as d3 from 'd3'
import useSyncCallback from '../../../MyHooks/useSyncCallback';
// import useSyncState from '../../../MyHooks/useSyncState';

export default function DynamicChart({ FDT, NLT }) {
    const [buttonOpen, setbuttonOpen] = useState(false)
    const [nowTimeData, setnowTimeData] = useState(0)
    const [init_data_line, setinit_data_line] = useState([])
    const [startBool, setstartBool] = useState(true)
    const [initLayoutNodes, setinitLayoutNodes] = useState([])

    const [layoutNodes, setlayoutNodes] = useState([])
    const [initHash, setinitHash] = useState(true)
    const [tarSou, settarSou] = useState([])
    const [preData, setpreData] = useState([])
    const [nodesIdArray, setnodesIdArray] = useState([])
    const [nowData, setnowData] = useState([])
    // const [nowtest, setnowtest] = useSyncState(0)
    const [addEdges, setaddEdges] = useState([])
    const [addNodes, setaddNodes] = useState([])
    const [perLayoutNodes, setperLayoutNodes] = useState([])
    const [addNode, setaddNode] = useState([])
    
    let HashNodes = new HashTable()
    // var nowData = null

    // 点击button执行定时器请求数据
    useEffect(() => {
        console.log("       DynamicChart useEffect");
        PubSub.subscribe("initialTimeData", (msg, data) => {
            setinit_data_line(data)
        })
        PubSub.subscribe("preData", (msg, data) => {
            setpreData(preData => data)
        })
        if (buttonOpen) {
            const timer = setInterval(() => {
                console.log("           setInterval");
                setnowTimeData(nowTimeData => nowTimeData + 1)
                axiosInit()
            }, 1200)
            return () => clearInterval(timer)
        }
    }, [buttonOpen])

    // 发送axios请求动态数据
    const axiosInit = useSyncCallback(() => {
        console.log(nowTimeData);
        axios({
            method: 'get',
            url: 'http://localhost:3000/api/brush_extent',
            params: {
                "layout_type": NLT,
                "start": FDT(init_data_line[nowTimeData].date),
                "end": FDT(init_data_line[nowTimeData + 1].date)
            }
        }).then(res => {
            let timeData = FDT(init_data_line[nowTimeData].date)
            settarSou(tarSou=>res.data)
            funcInitDynamicChart()
        })
    })

    const funcInitDynamicChart = useSyncCallback(() => {
        if (startBool) {
            setstartBool(startBool => false)
            setinitLayoutNodes(initLayoutNodes => countArray(tarSou.links))
        }
        funcInitLayoutNode()
    })

    const funcInitLayoutNode = useSyncCallback(() => {
        console.log();
        if (initHash) {
            initLayoutNodes.map(item => {
                HashNodes.add(item.id, item)
            })
            setinitHash(false)
            setlayoutNodes(layoutNodes=>HashNodes.getValues)
        }
        drawLayoutChart()
    })

    const drawLayoutChart = useSyncCallback(() => {
        setnowData(nowData => transform(tarSou))
        drawLayoutChart2()
    })

    const drawLayoutChart2 = useSyncCallback(() => {
        var nowDatanode = findNode(nowData);
        var preDatanode = findNode(preData);
        // var addNode; 
        // var layoutSourTar = preData;
        // addNode = difference(nowDatanode, preDatanode)

        setaddNode(addNode=>difference(nowDatanode, preDatanode))

        setperLayoutNodes(perLayoutNodes=>[])
        // var perLayoutNodes = [];
        // console.log(layoutNodes);
        layoutNodes.forEach(function (d) {
            var dict = {
                'id': d.id,
                'age': d.age,
                'degree': d.degree,
                'links': [].concat(d.links),
                'x': d.x,
                'y': d.y,
                'subs': d.subs
            };
            // perLayoutNodes.push(dict);
            setperLayoutNodes(perLayoutNodes=>[...perLayoutNodes,dict])
        });
        var perNodes = Array.from(preDatanode);
        // console.log(perNodes);
        setpreData(preData=>nowData)
        setnodesIdArray(nodesIdArray=>[].concat(perNodes))
        drawLayoutChart3()
    })

    const drawLayoutChart3 = useSyncCallback(() => {
        console.log(addNode);
        var layoutSourTar = preData;
        // var addNodes = [];
        // var addEdges = [];
        setaddEdges(addEdges=>[])
        setaddNodes(addNodes=>[])
        var layoutNodesStr = JSON.stringify(layoutSourTar);
        // console.log(layoutNodesStr);
        nowData.forEach(function (d, index) {
            var sourceId = d.source, targetId = d.target;
            var d_str = JSON.stringify(d);
            if(!layoutNodesStr.includes(d_str)){
                if(nodesIdArray.includes(sourceId) && nodesIdArray.includes(targetId)){
                    // addEdges.push(d);
                    setaddEdges(addEdges=>[...addEdges,d])
                }else{
                    // addNodes.push(d);
                    setaddNodes(addNodes=>[...addNodes,d])
                }
            }
        });
        // console.log(addNodes);
        // console.log(addEdges);
        setlayoutNodes(layoutNodes=>[].concat(deleteNodes(layoutNodes, nowData)))
        drawLayoutChart4()
    })

    const drawLayoutChart4 = useSyncCallback(() => {

        // console.log(nowData);

        let getSVG = document.getElementsByClassName('mainLayout')
        let width = getSVG[0].clientWidth - 5
        let height = getSVG[0].clientHeight - 5

        var aer = new AER(layoutNodes, addEdges, width, height);
        aer.start()
        var ssbm = new SSBM(layoutNodes, addNodes, width, height);
        ssbm.start();//初始化新增节点位置
        var age = new AGE(perLayoutNodes, layoutNodes, addNode);
        age.start();//设置年龄
        var repulsion = new RepulsionAll(layoutNodes, width, height);
        repulsion.start();//计算排斥力等，移动位置

    })

    function AER(layoutNodes,addEdges,width,height){

        var nodes = [];
        var id_index;
        var k = parseInt(Math.sqrt(width*height/layoutNodes.length)), a = 0.8 , b = 0.8;
        this.start = function(){
            this.nodePos();
        }
    
        this.nodePos = function(){
            id_index = idToIndex(layoutNodes);
    
    
            var edgesOrder = this.edgeLengthOrder(addEdges);
            //先计算最长的边，然后依次计算
            // console.log('添加的边：');
            // console.log(addEdges, edgesOrder);
            edgesOrder.forEach(function(d){
             var x1 = layoutNodes[id_index[d.target] - 0].x - layoutNodes[id_index[d.source] - 0].x;
             var y1 = layoutNodes[id_index[d.target] - 0].y - layoutNodes[id_index[d.source] - 0].y;
             var edgeLength = Math.sqrt(x1*x1 + y1*y1);
             var degreeScale = layoutNodes[id_index[d.target] - 0].degree/(layoutNodes[id_index[d.source] - 0].degree + layoutNodes[id_index[d.target] - 0].degree)
             let w = a*(1 - b*k/edgeLength)*degreeScale;
             layoutNodes[id_index[d.source] - 0].x = w*x1 + layoutNodes[id_index[d.source] - 0].x;
             layoutNodes[id_index[d.source] - 0].y = w*y1 + layoutNodes[id_index[d.source] - 0].y;
    
             layoutNodes[id_index[d.target] - 0].x = -w*x1 + layoutNodes[id_index[d.target] - 0].x;
             layoutNodes[id_index[d.target] - 0].y = -w*y1 + layoutNodes[id_index[d.target] - 0].y;
            // setlayoutNodes(layoutNodes[id_index[d.source] - 0].x=>w*x1 + layoutNodes[id_index[d.source] - 0].x)
          })
        }
        //将边按长度的大小顺序排序，大的在前，小的在后
        this.edgeLengthOrder = function(edges){
            var edgeOrder = [];
            var lengthArray = [];
            var lengtDict = {};
    
            edges.forEach(function(d){
              var x1 = layoutNodes[id_index[d.target] - 0].x - layoutNodes[id_index[d.source] - 0].x;
              var y1 = layoutNodes[id_index[d.target] - 0].y - layoutNodes[id_index[d.source] - 0].y;
              var edgeLength = Math.sqrt(x1*x1 + y1*y1);
              lengtDict[edgeLength] = d;
              lengthArray.push(edgeLength);
            })
            //根据edge的长度进行排序，降序排列
            lengthArray.sort(function compare(a,b){ return b - a});
            for (var i = 0; i < lengthArray.length; i++) {
                edgeOrder[i] = lengtDict[lengthArray[i]];
            }
            return edgeOrder;
        }
    
        function idToIndex(layoutNodes) {
            var  idIndex = {};
            layoutNodes.forEach(function (d) {
                idIndex[d.id] = d.subs;
            })
            return idIndex;
        }
    }

    function SSBM(layoutNodes, addNodes, width, height) {
        var k = parseInt(Math.sqrt(width*height/layoutNodes.length)*3);
    
        var nodesArrayCopy1 = [];
        var id_index ;
    
        this.start = function() {
         var nodeOrder;
         nodeOrder = this.nodesOrder();
         this.nodesPos(nodeOrder, nodesArrayCopy1)
        }
    
        this.nodesOrder = function() {
            id_index = idToIndex(layoutNodes);
    
            var nodesArray = [];
            var nodesDict;
            var nodeCount;
            var nodeOrder = [];
            var addNodesArray = [];
            var addNodesCopy = [].concat(addNodes);
            var nodesDictCopy;
    
            layoutNodes.forEach(function(d) {
                nodesArray.push(d.id);
            })
            nodesArrayCopy1 = [].concat(nodesArray);
    
            addNodes.forEach(function(d){
                if(nodesArray.indexOf(d.source) == -1){
                    addNodesArray.push(d.source);
                }
                if(nodesArray.indexOf(d.target) == -1){
                    addNodesArray.push(d.target);
                }
            })
            //新增的节点
            addNodesArray = this.unique(addNodesArray);
        //	console.log('新增节点：', addNodesArray)
    
            while(1) {
    
                nodeCount = [];
                nodesDict = {};
                nodesDictCopy = {};
                addNodesCopy.forEach(function(d) {
    
                    if(nodesArray.indexOf(d.source) == -1 && nodesArray.indexOf(d.target) == -1) {
                        if(!nodesDict[d.source]) {
                            nodesDict[d.source] = 0;
                        }
                        if(!nodesDict[d.target]) {
                            nodesDict[d.target] = 0;
                        }
                    }
                    if(nodesArray.indexOf(d.source) > -1&&nodesArray.indexOf(d.target) == -1) {
                        if(nodesDict[d.target]) {
                            nodesDict[d.target]++;
                            nodesDictCopy[d.target].push(d.source);
                        } else {
                            nodesDict[d.target] = 1;
                            nodesDictCopy[d.target] = [];
                            nodesDictCopy[d.target].push(d.source);
                        }
                    }
    
                    if(nodesArray.indexOf(d.target) > -1&&nodesArray.indexOf(d.source) == -1) {
                        if(nodesDict[d.source]) {
                            nodesDict[d.source]++;
                            nodesDictCopy[d.source].push(d.target);
                        } else {
                            nodesDict[d.source] = 1;
                            nodesDictCopy[d.source] = [];
                            nodesDictCopy[d.source].push(d.target);
                        }
                    }
                })
                for(var head in nodesDict) {
                    nodeCount.push(nodesDict[head]);
                }
                //根据新增节点与已存在的节点的连接的度的大小顺序（降序）
                nodeCount.sort(function compare(a, b) {
                    return b - a
                });
                //选择count最大的节点
                for(var head in nodesDict) {
                        if(nodesDict[head] == nodeCount[0]) {
                        nodeOrder.push({"id":head, "count":nodeCount[0], "nodes":nodesDictCopy[head]})
                        nodesArray.push(head);
                        break;
                     }
                }
    
                var addNodesCopy_i = 0;
                var delete_i = [];
                addNodesCopy.forEach(function(d){
                    if(nodesArray.indexOf(d.source) > -1&&nodesArray.indexOf(d.target) > -1) {
                        delete_i.push(addNodesCopy_i);
                    }
                    addNodesCopy_i++;
                })
                var number = 0
                for (var i = 0; i < delete_i.length; i++) {
                    number = delete_i[i] - i;
                    addNodesCopy.splice(number,1);
                }
    
                if(nodeOrder.length == addNodesArray.length) {
                    break;
                }
            }
                  return nodeOrder;
        }
    
        this.nodesPos = function(nodeOrder, nodesArrayCopy){
          //  console.log('新增节点顺序',nodeOrder)
                 /**
                 * degree:节点的度
                 * index:节点的类别
                 * **/
            nodeOrder.forEach(function(d){
                var subs =  layoutNodes.length - 1;
                layoutNodes[subs + 1] = {'degree': 0, 'id': d.id, 'links': [], 'x': 0, 'y': 0,'age': 1, 'subs': subs + 1};
                id_index = idToIndex(layoutNodes);
    
                var x1 = Math.random(), y1 = Math.random();
                //计算node的x，y
                if(d.count >= 2){
                    var center_x = 0, center_y = 0;
                    for(var i = 0; i < d.nodes.length; i++){
                        center_x += layoutNodes[id_index[d.nodes[i]] - 0].x;
                        center_y += layoutNodes[id_index[d.nodes[i]] - 0].y;
                    }
                    center_x = (1/d.count)*center_x;
                    center_y = (1/d.count)*center_y;
    
                    layoutNodes[id_index[d.id] - 0].x = center_x + 0.05*k*x1;
                    layoutNodes[id_index[d.id] - 0].y = center_y + 0.05*k*y1;
    
                }else if(d.count == 1){
                    var center_x = 0, center_y = 0;
                    center_x += layoutNodes[id_index[d.nodes[0]] - 0].x;
                    center_y += layoutNodes[id_index[d.nodes[0]] - 0].y;
                    layoutNodes[id_index[d.id] - 0].x = center_x + 0.5*k*x1;
                    layoutNodes[id_index[d.id] - 0].y = center_y + 0.5*k*y1;
    
                }else{
                    var random_x = 4*width/5 - 100*x1;
                    var random_x1 = width/5 + 100*x1;
                    var node_x = 0;
                    if(Math.random() >= 0.5){
                        node_x = random_x
                    }else{
                        node_x = random_x1;
                    }
                    layoutNodes[id_index[d.id] - 0].x = node_x;
                    layoutNodes[id_index[d.id] - 0].y = height*y1;
                }
                //相应的改变layoutNodes
                addNodes.forEach(function(n){
                    if(d.id == n.source){
                        if(nodesArrayCopy.indexOf(n.source) > -1){
                            layoutNodes[id_index[n.source] - 0].links.push(d.id);
                            layoutNodes[id_index[n.source] - 0].degree++;
                        }
                        layoutNodes[id_index[d.id] - 0].index = d.id - 1;
                        layoutNodes[id_index[d.id] - 0].degree++;
                        layoutNodes[id_index[d.id] - 0].links.push(n.target);
                    }
                    if(d.id == n.target){
                        if(nodesArrayCopy.indexOf(n.target) > -1){
                            layoutNodes[id_index[n.target] - 0].links.push(d.id);
                            layoutNodes[id_index[n.target] - 0].degree++;
                        }
                        layoutNodes[id_index[d.id] - 0].index = d.id;
                        layoutNodes[id_index[d.id] - 0].degree++;
                        layoutNodes[id_index[d.id] - 0].links.push(n.source);
                    }
                })
            })
    
        }
    
        this.unique = function(arr) {
            return  Array.from(new Set(arr));
        }
         function idToIndex(layoutNodes) {
            var  idIndex = {};
            layoutNodes.forEach(function (d) {
                idIndex[d.id] = d.subs;
            })
            return idIndex;
        }
    }

    function AGE(preLayoutNodes, layoutNodes, addNode) {
        var nodesArray = [];
        var id_index;
        var perId_index;
        this.start = function() {
            this.age();
        }
    
        this.age = function() {
    
            id_index = idToIndex(layoutNodes);
            perId_index = idToIndex(preLayoutNodes);
            preLayoutNodes.forEach(function(d) {
                nodesArray.push(d.id);
            })
    
            for(var i = 0; i < layoutNodes.length; i++){
                var id = layoutNodes[i].id;
               // console.log(id, i);
                //新增节点的age为1，不用计算
                if(addNode.includes(id)){
                    continue;
                }
                var perLinks = [], links = [];
                perLinks = preLayoutNodes[perId_index[id] - 0].links;
                links = layoutNodes[id_index[id] - 0].links;
                //console.log('节点链接情况：');
                //console.log(perLinks, links);
                //没有变化的节点age只需加1
                if(equalArray(perLinks, links)){
                    layoutNodes[i].age++;
                    continue;
                }
                var add_age = 0,
                    rem_age = 0,
                    tol_age = 0,
                    del_age = 0;
    
                 //计算节点的age（rem_age，add_age）;
                for(var j = 0; j < links.length; j++) {
                    if(perLinks.indexOf(links[j]) > -1) {
                        rem_age += preLayoutNodes[perId_index[links[j]] - 0].age;
                    } else {
                        if(nodesArray.indexOf(links[j]) > -1){
                            add_age += preLayoutNodes[perId_index[links[j]] - 0].age;
                        }else{
                            //这时此节点为新增节点
                            add_age++;
                        }
                    }
                }
                //计算节点的age（del_age）;
                for(var k = 0; k < perLinks.length; k++) {
                    if(links.indexOf(perLinks[k]) == -1) {
                        del_age += preLayoutNodes[perId_index[perLinks[k]] - 0].age;
                    }
                }
                tol_age = rem_age + add_age + del_age;
                // console.log('节点age：')
                // console.log(tol_age, rem_age, add_age, del_age)
                // console.log('节点id：')
                // console.log(id_index[id] - 0, perId_index[id] - 0)
                layoutNodes[id_index[id] - 0].age = parseInt(preLayoutNodes[perId_index[id] - 0].age * (rem_age / tol_age) + 1);
            }
        }
        this.unique = function(arr) {
            return  Array.from(new Set(arr));
        }
        //将对于id转为对应数组下标
        function idToIndex(layoutNodes) {
            var  idIndex = {};
            layoutNodes.forEach(function (d) {
                idIndex[d.id] = d.subs;
            })
            return idIndex;
        }
        //判断两数字数组是否相等
        function equalArray(arr1, arr2) {
             if(arr1.sort().toString() === arr2.sort().toString()){
                 return true;
             }
             return false;
        }
    }

    function RepulsionAll(layoutNodes,width, height){
        let id_index;
        let k = 10	,β = 0.08, t = 10;
        let distance_x = 1;
        this.start = function(){
          this.repulsion();
          //  console.log([].concat(layoutNodes))
        }
    
        this.repulsion = function () {
            id_index = idToIndex();
            layoutNodes.forEach(function(d) {
                d.disp_x = 0;
                d.disp_y = 0;
            })
    
            /**计算排斥力**/
           for(var iteration_count = 0; iteration_count < 20; iteration_count++) {
                for(let i = 0; i < layoutNodes.length; i++) {
    
                    let pos_x = layoutNodes[i].x;
                    let pos_y = layoutNodes[i].y;
                    layoutNodes[i].disp_x = 0; layoutNodes[i].disp_y = 0;
                     for(let j = 0; j < layoutNodes.length; j++){
                         if(i != j){
                             let  node_x = layoutNodes[j].x;
                             let  node_y = layoutNodes[j].y;
    
                             let disp_x = pos_x - node_x;
                             let disp_y = pos_y - node_y;
                             let distance = Math.sqrt(disp_x * disp_x + disp_y * disp_y);
    
                             if(distance == 0){//出现节点重合的情况则给一个很大的排斥力
                                 distance = 0.1;
                                 disp_x = 1;
                                 disp_y = 1;
                             }
                             if(distance < 100){
                                 distance_x = 1
                             }else{
                                 distance_x = 0;
                             }
    
                             let disp_repl_x = disp_x > 0?1:-1;
                             let disp_repl_y = disp_y > 0?1:-1;
                             let fr = k*k/(distance)*10 > 2000?2000:k*k/(distance)*10;
                             layoutNodes[i].disp_x =  layoutNodes[i].disp_x + distance_x*disp_repl_x*fr;
                             layoutNodes[i].disp_y =  layoutNodes[i].disp_y + distance_x*disp_repl_y*fr;
    
                         }
                     }
                }
                
               for(let i = 0; i < layoutNodes.length; i++){
                    let links = layoutNodes[i].links;
                    let pos_x = layoutNodes[i].x;
                    let pos_y = layoutNodes[i].y;
    
                    for(let n = 0; n < links.length; n++){
                        let node_id = links[n];
                        let node_x = layoutNodes[id_index[node_id] - 0].x;
                        let node_y = layoutNodes[id_index[node_id] - 0].y;
    
                        let disp_x = pos_x - node_x;
                        let disp_y = pos_y - node_y;
                        let distance = Math.sqrt(disp_x * disp_x + disp_y * disp_y);
    
    
                        if(distance == 0){//出现节点重合的情况则给一个很小的吸引力
                            distance = 0.1;
                            disp_x = 1;
                            disp_y = 1;
                        }
    
                        let fa = (distance*distance)/k > 2000?2000:(distance*distance)/k;
                        let disp_a_x = disp_x > 0?1:-1;
                        let disp_a_y = disp_y > 0?1:-1;
                        layoutNodes[i].disp_x =  layoutNodes[i].disp_x - disp_a_x*fa;
                        layoutNodes[i].disp_y =  layoutNodes[i].disp_y - disp_a_y*fa;
                    }
    
                }
                /**计算位置**/
                for(let i = 0; i < layoutNodes.length; i++){
                    let node_age = layoutNodes[i].age;
                    let layout_disp_x = layoutNodes[i].disp_x/Math.abs( layoutNodes[i].disp_x)||1;
                    let layout_disp_y = layoutNodes[i].disp_y/Math.abs( layoutNodes[i].disp_y)||1;
                    let d_t = Math.pow(Math.E, -β * node_age);
                    layoutNodes[i].x = layoutNodes[i].x +  d_t* layout_disp_x *Math.min(t, Math.abs( layoutNodes[i].disp_x));
                    layoutNodes[i].y = layoutNodes[i].y +  d_t* layout_disp_y *Math.min(t, Math.abs( layoutNodes[i].disp_y));
    
                    if(layoutNodes[i].x <= 0||layoutNodes[i].x >= width){
                        this.controlPos(layoutNodes[i].id);
                    }
                    if(layoutNodes[i].y <= 0||layoutNodes[i].y >= height){
                        this.controlPos(layoutNodes[i].id);
                    }
    
                }
                t = 0.8*t;
            }
     }
    
        /***防止置换超出边界(约束规范化)***/
        this.controlPos = function (id) {
            let min_x = 99999, min_y = 9999, max_x = 0, max_y = 0;
            layoutNodes.forEach(function(d){
                if(d.x > max_x){
                    max_x = d.x;
                }
                if(d.y > max_y){
                    max_y = d.y;
                }
                if(d.x < min_x){
                    min_x = d.x;
                }
                if(d.y < min_y){
                    min_y = d.y;
                }
            })
            let r_x = width/(max_x - min_x);
            let r_y = height/(max_y - min_y);
    
            if(layoutNodes[id_index[id] - 0] .x <= 0||layoutNodes[id_index[id] - 0].x >= width){
                layoutNodes[id_index[id] - 0].x = (layoutNodes[id_index[id] -0].x - min_x)*r_x ;
            }
    
            if(layoutNodes[id_index[id] - 0].y <= 0||layoutNodes[id_index[id] - 0].y >= height){
                layoutNodes[id_index[id] - 0].y = (layoutNodes[id_index[id] - 0].y - min_y)*r_y ;
    
            }
        }
    
    
        function idToIndex() {
            let  idIndex = {};
            layoutNodes.forEach(function (d) {
                idIndex[d.id] = d.subs;
            })
            return idIndex;
        }
    
    }

    function countArray(data) {
        console.log("countArray");
        let nodeDict = {};
        let layoutNodes = [];
        data.forEach(function (item) {
            if (nodeDict[item.source]) {
                nodeDict[item.source].push(item.target)
            } else {
                nodeDict[item.source] = [];
                nodeDict[item.source].push(item.target)
            }
            if (nodeDict[item.target]) {
                nodeDict[item.target].push(item.source)
            } else {
                nodeDict[item.target] = [];
                nodeDict[item.target].push(item.source)
            }
        });
        var count = 0;
        d3.selectAll(".node").each(function (d) {
            var id = d3.select(this).attr('id');
            var x = d3.select(this).attr('cx');
            var y = d3.select(this).attr('cy');
            var dict = {};
            dict['id'] = id;
            dict['links'] = nodeDict[id];
            dict['subs'] = count;
            dict['age'] = 1;
            dict['degree'] = nodeDict[id].length;
            dict['x'] = Number(x);
            dict['y'] = Number(y);
            layoutNodes.push(dict)
            count++;
        })
        return layoutNodes;
    }

    function transform(initData) {
        var copylinks =  initData.links.map(function (item) {
            return {source: item.source, target: item.target}
        })
      return copylinks.filter(function (d) {
           return d.source != d.target;
        })
    }

    function findNode(data) {
        var nodeData = new Set()
        data.forEach(function (item) {
            nodeData.add(item.source)
            nodeData.add(item.target)
        })
        return nodeData
    }

    function difference(thisSet, otherSet) {
        var differenceSet = new Set();
        var values = Array.from(thisSet);
        for (var i = 0; i < values.length; i++) {
            if (!otherSet.has(values[i])) {
                differenceSet.add(values[i]);
            }
        }
        return Array.from(differenceSet)
    };

    function deleteNodes(layoutNodes, nowData) {
         var nowDataDict =  countLinks(nowData);
         var layoutNodesCopy = [];
         var layoutNodes1 = [].concat(layoutNodes);
        layoutNodes1.forEach(function(d){
              if(nowDataDict[d.id]){
                  d.links = nowDataDict[d.id];
                  d.degree = nowDataDict[d.id].length;
                  d.subs = layoutNodesCopy.length;
                  layoutNodesCopy.push(d);
              }
         })
        return layoutNodesCopy;
    }

    function countLinks(data) {
        var nodedict = {};
        data.forEach(function(d) {
            if(nodedict[d.source]) {
                nodedict[d.source].push(d.target);
            }
            else {
                nodedict[d.source] = [];
                nodedict[d.source].push(d.target);
            }
            if(nodedict[d.target]) {
                nodedict[d.target].push(d.source)
            } else {
                nodedict[d.target] = [];
                nodedict[d.target].push(d.source);
            }
        })
        return nodedict;
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
        <div>
            <div className='playButton'>
                <Button type="primary" onClick={() => setbuttonOpen(!buttonOpen)}>Primary111 </Button>
                {/* <Button type="primary" onClick={() => setnowTimeData({ type: 'COUNT_INCREMENT' })}>aaa </Button> */}
            </div>
        </div>
    )
}
