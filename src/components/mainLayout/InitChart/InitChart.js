import React, { useEffect, useState } from 'react'
import axios from 'axios'
import FormatDateTime from '../../topInfor/TopInfor'
// import { dispatch } from 'd3'
import * as d3 from 'd3'
import PubSub from 'pubsub-js'
// import DynamicChart from '../DynamicChart/DynamicChart';
// import '../MainLayout'
import useSyncCallback from '../../../MyHooks/useSyncCallback';



const transform = (initData) => {
    var copylinks =  initData.links.map(function (item) {
        return {source: item.source, target: item.target}
    })
  return copylinks.filter(function (d) {
       return d.source != d.target;
    })
}

const unique = (arr)=> {
    var result = [],
        hash = {};
    for (var i = 0, elem;
         (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

function d3layout(data, width, height) {
    let tmp_nodes = [];
    let index_of_nodes = [];
    let nodeNumber = 0;
    let links = [];
    let nodes = [];
    let nodeDict = {}
    this.draw = function(){
        data.forEach((item)=>{
            tmp_nodes.push(item.source);
            tmp_nodes.push(item.target);
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
        })
        tmp_nodes = unique(tmp_nodes);
        index_of_nodes = d3.map();
        nodeNumber = tmp_nodes.length;
        tmp_nodes.sort(function compare(a, b) {
            return a - b
        });
        for (let i = 0; i !== tmp_nodes.length; ++i) {
            let node = {id: tmp_nodes[i]};
            nodes.push(node);
            index_of_nodes.set(tmp_nodes[i], i);
        }

        data.forEach((item)=> {
            let link = {
                source: index_of_nodes.get(item.source),
                target: index_of_nodes.get(item.target)
            };
            links.push(link);
        });
        
        let svg = d3.select('.mainLayout')
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // v3 版本
        // this.force = d3.layout.force()
        //     .nodes(nodes)
        //     .links(links)
        //         // .linkDistance(0.01)
        //     .size([width, height])
        
        // v4版本
        this.force = d3.forceSimulation(nodes)
            .force('link',d3.forceLink(links))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide(11).iterations(5));
            
        this.force.restart();
        
        var svg_links = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("stroke-opacity", 0.9)
            .attr("stroke", "gray")

        var svg_nodes = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", function (d) {
                return 2;
            })
            .attr("id", function (d) {
                // console.log(d)
                return d.id;
            })
            .attr("opacity", 1)
            .attr("stroke", "red")
            .attr("fill", "red")

        this.force.on("tick", function () {
                svg_links.attr("x1", function (d) {
                    return d.source.x;
                });
                svg_links.attr("y1", function (d) {
                    return d.source.y;
                });
                svg_links.attr("x2", function (d) {
                    return d.target.x;
                });
                svg_links.attr("y2", function (d) {
                    return d.target.y;
                });
                svg_nodes.attr("cx", function (d) {
                    return d.x;
                });
                svg_nodes.attr("cy", function (d) {
                    return d.y;
                });
            });
        
        // console.log(nodes);
        
        return nodes
    }
}

export default function InitChart({FDT,NLT}) {

    // const [startDataInit,setstartDataInit] = useState([])
    // const [numIni,setnumIni] = useState(1)
    const [InitpreData,setInitpreData] = useState([])

    console.log("      InitChart");
    const now_layout_type = 'incremental'

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://localhost:3000/api/brush_extent',
            params: {
                "layout_type": NLT,
                "start": FDT(new Date('2015-4-23 16:45')),
                "end": FDT(new Date('2015-4-23 16:50'))
            }
        }).then(res=>{
            console.log(res.data);
            let startData = transform(res.data)
            // console.log(startData);

            // console.log(numIni == 1);
            // if(numIni == 1){
            //     // setstartDataInit(startDataInit=>startData)
            //     PubSub.publishSync('startDataIni',startData)
            //     setnumIni(numIni=>2)
            // }
            
            


            let getSVG = document.getElementsByClassName('mainLayout')

            let width = getSVG[0].clientWidth - 5
            let height = getSVG[0].clientHeight - 5
            // let preData = startData
            setInitpreData(InitpreData=>startData)
            funcInitpreData()
            let layout = new d3layout(startData,width,height);
            layout.draw()
        })
    }, [])


    const funcInitpreData = useSyncCallback(() => {
        // console.log(InitpreData);
        PubSub.publish("preData",InitpreData)
    })


    return (
        
        <div>
            {/* <button >
                <DynamicChart></DynamicChart>
            </button> */}
            {/* <DynamicChart></DynamicChart> */}
        </div>
    )
}
