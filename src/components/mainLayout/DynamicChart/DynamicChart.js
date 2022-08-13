import React, { useEffect, useState, useContext, useCallback, useRef, useReducer } from 'react'
import { Button } from 'antd';
import axios from 'axios'
import PubSub from 'pubsub-js'
import * as d3 from 'd3'
import useSyncCallback from '../../../MyHooks/useSyncCallback';
import useSyncState from '../../../MyHooks/useSyncState';

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
    // const [nodesIdArray, setnodesIdArray] = useState([])
    // const [nodesIdArray, setnodesIdArray] = useState([])
    
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
            setlayoutNodes(HashNodes.getValues)
        }
        drawLayoutChart()
    })

    const drawLayoutChart = useSyncCallback(() => {
        setnowData(nowData => transform(tarSou))


        var nowDatanode = findNode(nowData);
        var preDatanode = findNode(preData);
        var deleteNodeId, addNode; 
        // deleteNodeId = difference(preDatanode, nowDatanode);
        var layoutSourTar = preData;
        addNode = difference(nowDatanode, preDatanode)
        setpreData(preData=>nowData)
        let mainNodes = [];
        let otherNodes = [];

        var perLayoutNodes = [];
        layoutNodes.map(function (d) {
            var dict = {
                'id': d.id,
                'age': d.age,
                'degree': d.degree,
                'links': [].concat(d.links),
                'x': d.x,
                'y': d.y,
                'subs': d.subs
            };
            perLayoutNodes.push(dict);
        });
        var perNodes = Array.from(preDatanode);

        // 写在外面的
        var nodesIdArray = [].concat(perNodes);
        var addNodes = [];
        var addEdges = [];
        var addAlreadyEdges = [];
        var push_time = 0;


    })


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
