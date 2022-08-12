import React, { useEffect } from 'react'
import axios from 'axios'
// import FormatDateTime from '../../topInfor/TopInfor'
// import { dispatch } from 'd3'
import * as d3 from 'd3'
// import '../MainLayout'

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

const transform = (initData) => {
    // console.log(initData)
    var copylinks =  initData.links.map(function (item) {
        return {source: item.source, target: item.target}
    })
    // console.log(copylinks)

  return copylinks.filter(function (d) {
      // console.log(d.source != d.target)
      //true
       return d.source != d.target;
    })
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
        tmp_nodes = this.unique(tmp_nodes);
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

        console.log(99999);
        // let svg = d3.select
    }
}

const now_layout_type = 'incremental'

export default function InitChart(props) {

    console.log("      InitChart");
    console.log(props);
    // let aaa = FormatDateTime(new Date('2015-4-23 16:45'))
    // console.log(aaa);
    const now_layout_type = 'incremental'

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://localhost:3000/api/brush_extent',
            params: {
                "layout_type": now_layout_type,
                "start": FormatDateTime(new Date('2015-4-23 16:45')),
                "end": FormatDateTime(new Date('2015-4-23 16:50'))
            }
        }).then(initial=>{
            let startData = transform(initial.data)
            let preData = startData
            let layout = new d3layout(startData);
            
        })
    }, [])


    return (
        
        <div>
            initichart
        </div>
    )
}
